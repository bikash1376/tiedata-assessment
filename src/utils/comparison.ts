import type { Team } from '../types/game';

export interface MetricDomain {
  min: number;
  max: number;
}

export interface ComparisonMetric {
  key: 'offensiveRating' | 'defensiveRating' | 'pace';
  label: string;
  lowerIsBetter: boolean;
  neutral?: boolean;
  domain: MetricDomain;
}

export const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    key: 'offensiveRating',
    label: 'Offensive rating',
    lowerIsBetter: false,
    domain: { min: 105, max: 125 },
  },
  {
    key: 'defensiveRating',
    label: 'Defensive rating',
    lowerIsBetter: true,
    domain: { min: 105, max: 125 },
  },
  {
    key: 'pace',
    label: 'Pace',
    lowerIsBetter: false,
    neutral: true,
    domain: { min: 92, max: 106 },
  },
];

export type Leader = 'home' | 'away' | null;

export const leaderFor = (
  metric: ComparisonMetric,
  homeValue: number,
  awayValue: number
): Leader => {
  if (metric.neutral || homeValue === awayValue) return null;
  const homeLeads = metric.lowerIsBetter ? homeValue < awayValue : homeValue > awayValue;
  return homeLeads ? 'home' : 'away';
};

const MIN_VISIBLE_FRACTION = 0.06;

export const fractionFor = (metric: ComparisonMetric, value: number): number => {
  const { min, max } = metric.domain;
  const span = max - min;
  if (span <= 0) return MIN_VISIBLE_FRACTION;
  const normalized = (value - min) / span;
  return Math.min(1, Math.max(MIN_VISIBLE_FRACTION, normalized));
};

export const barFractions = (
  metric: ComparisonMetric,
  homeValue: number,
  awayValue: number
): { home: number; away: number } => ({
  home: fractionFor(metric, homeValue),
  away: fractionFor(metric, awayValue),
});

export const metricValue = (team: Team, key: ComparisonMetric['key']): number => team.metrics[key];
