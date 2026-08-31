import { COMPARISON_METRICS, barFractions, fractionFor, leaderFor } from '../src/utils/comparison';

const offensive = COMPARISON_METRICS[0];
const defensive = COMPARISON_METRICS[1];
const pace = COMPARISON_METRICS[2];

describe('leaderFor', () => {
  it('gives offensive rating to the higher value', () => {
    expect(leaderFor(offensive, 121.2, 118.5)).toBe('home');
  });

  // Defensive rating is the one inverted metric in the data set; treating it
  // like the others would highlight the worse defense.
  it('gives defensive rating to the lower value', () => {
    expect(leaderFor(defensive, 110.4, 112.8)).toBe('home');
    expect(leaderFor(defensive, 115.1, 114.2)).toBe('away');
  });

  it('declares no leader for pace', () => {
    expect(leaderFor(pace, 101.3, 96.9)).toBeNull();
  });

  it('declares no leader on a tie', () => {
    expect(leaderFor(offensive, 117.0, 117.0)).toBeNull();
  });
});

describe('fractionFor', () => {
  // Bars are scaled against a fixed league-realistic domain rather than against
  // the pair being compared, so a 0.6-point gap does not render as a landslide.
  it('places a value proportionally inside the metric domain', () => {
    expect(fractionFor(offensive, 115)).toBeCloseTo(0.5, 5);
    expect(fractionFor(pace, 99)).toBeCloseTo(0.5, 5);
  });

  it('keeps a below-domain value visible instead of collapsing to zero', () => {
    expect(fractionFor(offensive, 90)).toBeGreaterThan(0);
    expect(fractionFor(offensive, 90)).toBeLessThan(0.1);
  });

  it('clamps an above-domain value to a full bar', () => {
    expect(fractionFor(offensive, 140)).toBe(1);
  });
});

describe('barFractions', () => {
  it('orders two close ratings correctly', () => {
    const { home, away } = barFractions(offensive, 116.8, 117.4);

    expect(away).toBeGreaterThan(home);
  });

  it('keeps both fractions inside the track', () => {
    const { home, away } = barFractions(pace, 101.3, 96.9);

    expect(home).toBeLessThanOrEqual(1);
    expect(away).toBeGreaterThan(0);
  });

  it('renders equal values identically', () => {
    const { home, away } = barFractions(defensive, 110, 110);

    expect(home).toBe(away);
  });
});
