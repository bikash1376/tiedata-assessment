import { teamAccents } from '../theme/tokens';

export const teamColor = (teamId: string): string => {
  let hash = 0;
  for (let i = 0; i < teamId.length; i += 1) {
    hash = (hash * 31 + teamId.charCodeAt(i)) % 100000;
  }
  return teamAccents[hash % teamAccents.length];
};
