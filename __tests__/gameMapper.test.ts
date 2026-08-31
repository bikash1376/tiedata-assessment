import fixture from '../assets/data/sample_nba_data.json';
import { ParseError, toGamesPayload } from '../src/data/mappers/gameMapper';

describe('toGamesPayload', () => {
  it('parses every game in the sample payload', () => {
    const { games, generatedAt } = toGamesPayload(fixture);

    expect(games).toHaveLength(3);
    expect(generatedAt).toBe('2026-08-28T00:00:00Z');
    expect(games.map((game) => game.status)).toEqual(['scheduled', 'live', 'final']);
  });

  // Scores, period and clock are absent depending on status. Defaulting them to
  // zero would render "0 - 0" on an unplayed game, so they must stay undefined.
  it('leaves score, period and clock undefined on a scheduled game', () => {
    const [scheduled] = toGamesPayload(fixture).games;

    expect(scheduled.homeScore).toBeUndefined();
    expect(scheduled.awayScore).toBeUndefined();
    expect(scheduled.period).toBeUndefined();
    expect(scheduled.clock).toBeUndefined();
  });

  it('keeps period and clock on a live game', () => {
    const live = toGamesPayload(fixture).games[1];

    expect(live.period).toBe(3);
    expect(live.clock).toBe('04:18');
    expect(live.homeScore).toBe(78);
    expect(live.awayScore).toBe(74);
  });

  // Roster length varies across the fixture: two players in game one, one in the
  // rest. A fixed-length assumption in the UI would drop or crash on the others.
  it('preserves rosters of differing length', () => {
    const games = toGamesPayload(fixture).games;

    expect(games[0].homeTeam.keyPlayers).toHaveLength(2);
    expect(games[1].homeTeam.keyPlayers).toHaveLength(1);
  });

  it('maps nested team records and metrics', () => {
    const [scheduled] = toGamesPayload(fixture).games;

    expect(scheduled.homeTeam.abbreviation).toBe('LAL');
    expect(scheduled.homeTeam.record).toEqual({ wins: 48, losses: 34 });
    expect(scheduled.awayTeam.metrics.pace).toBe(101.3);
  });

  it('rejects a payload whose games are not an array', () => {
    expect(() => toGamesPayload({ games: null })).toThrow(ParseError);
  });

  it('rejects an unknown game status', () => {
    const broken = {
      games: [{ ...(fixture.games[0] as object), status: 'postponed' }],
    };

    expect(() => toGamesPayload(broken)).toThrow(/known game status/);
  });

  it('reports the path of a missing field', () => {
    const broken = {
      games: [{ ...(fixture.games[0] as object), id: undefined }],
    };

    expect(() => toGamesPayload(broken)).toThrow(/root\.games\[0\]\.id/);
  });
});
