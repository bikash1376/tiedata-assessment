# NBA Matchup

A small React Native app for browsing NBA matchups: a games list, a matchup detail view with a team-stat comparison, and persistent favorites. Built for the TIE DATA mobile technical assessment.

The bundled `sample_nba_data.json` is treated as a remote response. It is served through a simulated network layer with realistic latency, a deterministic failure switch, and an offline cache, so the data source can be swapped for a real API without touching a single screen.

---

## Setup

Requires Node 20+ and the **Expo Go** app (SDK 54) on an Android device.

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `a` to open the connected Android device or emulator.

```bash
npm test        # Jest suite
npm run typecheck   # tsc --noEmit
```

No API keys, environment variables, or secrets are involved. Nothing needs configuring before the first run.

---

## Demonstrating the required states

The Games screen header carries a three-way network control. It is deterministic: the selected mode decides the outcome of every subsequent request until it is changed.

| Mode | What happens |
|---|---|
| **Online** | Request succeeds after 800-1500 ms and the games render |
| **Fail** | Request throws. With a cached payload you get the cached list plus an offline banner; with no cache you get the error state and a Retry button |
| **Empty** | Request succeeds with zero games, showing the empty state |

To see the error state from a cold start, choose **Fail** before the first successful load (or clear app data first). To see the offline-cache path, load once on **Online**, then switch to **Fail** and pull to refresh.

Favorites persist across a full restart. Star a game, close Expo Go, reopen.

---

## Architecture

Three layers, one direction of dependency: **UI to state to data**. Nothing in `src/data` imports from `src/screens` or `src/components`.

```
src/
  types/game.ts                Domain model
  data/
    remote/                    Simulated network: latency, failure switch, raw JSON
    mappers/gameMapper.ts      Raw JSON to domain model, with validation
    local/                     AsyncStorage: games cache, favorites
    repositories/              Fetch, parse, cache, offline fallback
  state/                       React Context providers, discriminated-union state
  navigation/                  Stack over bottom tabs
  screens/                     Games, Favorites, Matchup details
  components/                  Presentational, theme-driven
  theme/                       Tokens, Geist font loading, ThemeProvider
  utils/                       Formatting, comparison math, team colors
```

### Data flow, end to end

`GamesProvider` calls `gamesRepository.getGames()`. The repository asks `GamesRemoteDataSource` for a raw body, hands it to `toGamesPayload` for parsing and validation, writes the parsed result to `gamesCache`, and returns it tagged `origin: 'network'`. If the request throws, the repository reads the cache: a hit returns `origin: 'cache'` with a timestamp, a miss rethrows. The provider turns that outcome into a `GamesState` value, and `GamesListView` renders exactly one branch of it.

### State management

Plain React Context with `useState`, no external state library. Two providers:

- **`GamesProvider`** owns the remote data lifecycle and exposes `state`, `load()`, and `refresh()`.
- **`FavoritesProvider`** owns the favorite id set, hydrates it from storage on mount, and writes through on every toggle.

`GamesState` is a discriminated union rather than a bag of booleans:

```ts
type GamesState =
  | { status: 'loading' }
  | { status: 'refreshing'; games: Game[]; origin: GamesOrigin; cachedAt?: string }
  | { status: 'success';    games: Game[]; origin: GamesOrigin; cachedAt?: string }
  | { status: 'empty';      origin: GamesOrigin }
  | { status: 'error';      message: string };
```

Impossible combinations, such as loading and error at once, cannot be represented, and the compiler forces every render path to account for each case.

---

## Technical decisions and trade-offs

**Context instead of Redux or Zustand.** Two pieces of state, one screen tree, no cross-cutting updates. A store library would add indirection without removing any. If this grew to server-driven pagination or multi-endpoint caching, React Query would be the next step, and the repository boundary means it would slot in without changing the UI.

**Parsing separated from fetching.** `gameMapper` validates field by field and throws a `ParseError` naming the exact JSON path. It costs more code than `JSON.parse` and a type assertion, but a malformed field surfaces as a precise message instead of an `undefined` crash three components deep, and the mapper is testable against fixtures with no network involved.

**Optional fields stay optional.** `homeScore`, `awayScore`, `period` and `clock` are absent depending on status. They are typed as optional and never defaulted to zero, so a scheduled game does not render as `0 - 0`.

**Bars scaled to a fixed domain, not to the pair.** Team ratings cluster tightly, for example 116.8 against 117.4. Normalizing each pair against itself would make a 0.6-point gap look like a blowout. Bars are instead scaled against a league-realistic domain (105-125 for ratings, 92-106 for pace), so the visual is honest and comparable across games. The trade-off is that close matchups look close, which is why the numeric value sits beside every bar and the leader is highlighted.

**Defensive rating is inverted.** It is the one metric where lower is better. `leaderFor` handles it explicitly and the UI labels it, rather than silently highlighting the worse defense.

**Pace has no winner.** It is descriptive, not a quality measure, so it is marked neutral and neither side is highlighted.

**Cache fallback lives in the repository, not the UI.** Screens ask for games and receive an origin tag. They never coordinate a network attempt with a cache read.

**AsyncStorage over SQLite.** The persisted data is a small id list and one JSON payload. SQLite would be the right call once queries or relational data appear.

**No images.** The dataset carries no logos, headshots, or team colors, and shipping real NBA logos would mean bundling trademarked assets that were never provided. Team identity is drawn instead: an abbreviation monogram on a color derived deterministically from `team.id`. As a side effect there is no image loading or error state to handle.

**Bottom tabs rather than a filter toggle.** The assessment allows either a favorite-only view or a filter. A dedicated tab keeps favorites one tap away and avoids two controls that do the same thing. Both tabs render the same `GamesListView`.

---

## iOS support

The app is pure React Native with no custom native modules, so the same bundle runs on iOS Expo Go today. Every dependency is cross-platform: Expo, React Navigation, AsyncStorage, `@expo/vector-icons`, and `expo-font`. Platform differences are handled by components that already adapt, `SafeAreaProvider` for insets and `RefreshControl` for pull-to-refresh, rather than by branching on `Platform.OS`. Producing an iOS build is a matter of running it on a Mac or through EAS; no code changes are required. If a genuinely platform-specific behavior appeared later, the layering means it would land in a component or a data source, not in business logic.

---

## Testing

28 tests across four suites, covering the parts most likely to break as the app grows.

| Suite | Covers |
|---|---|
| `gameMapper.test.ts` | Parsing the real fixture, optional fields staying undefined, varying roster lengths, rejection of bad status and missing fields with path-accurate errors |
| `gamesRepository.test.ts` | Network success writes the cache, failure falls back to cache, failure with no cache rethrows, recovery after a failed attempt, empty payload |
| `favoritesStore.test.ts` | Persistence round trip, removals persisting, corrupt and non-string values degrading safely |
| `comparison.test.ts` | Inverted defensive rating, neutral pace, ties, domain scaling and clamping |

```bash
npm test
```

---

## Screen sizes

Layouts are flex-based with token spacing and no fixed widths. Team names truncate rather than wrap or overflow, stat rows distribute evenly, and the detail screen scrolls. Safe-area insets are respected at the top and bottom.

---

## Known limitations

- The remote data source reads a bundled JSON file. There is no real HTTP client, by design.
- Live games are a static snapshot. There is no polling or websocket, so period and clock do not advance.
- The cache has no expiry. It is served whenever the network fails, however old it is, and the banner reports its age.
- The network mode control ships in the release build so the states can be demonstrated. In a production app it would sit behind a debug flag.
- No component or end-to-end tests. Coverage is on the data, state, and logic layers, where regressions are most likely and cheapest to catch.
- Favorites are device-local, with no account or sync.
- Team colors come from a hash, so two teams can share an accent in a larger dataset. A real app would use official colors.

---

## Time spent

Approximately 4 hours.

---

## AI tool disclosure

**Claude Code** was used for code generation across the project: the data layer, state providers, components, screens, and the test suite. **Gemini** was used for UI direction, specifically the color palette, spacing and radius scales, and the layout of the game card and comparison bars.

Every file was reviewed and adjusted before it was committed. Two decisions came out of that review rather than out of the generated output: the comparison bars originally normalized each pair of values against itself, which made a 0.6-point rating gap read as a blowout, so they were changed to scale against a fixed league-realistic domain; and the matchup screen originally used the native stack header, which lost its top inset under edge-to-edge and pushed the title into the status bar, so it was replaced with an in-screen header. The architecture, the layer boundaries, and the trade-offs recorded above are mine, and I can walk through, modify, or debug any part of the codebase.
