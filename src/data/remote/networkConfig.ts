export const NETWORK_DELAY_MS = { min: 800, max: 1500 } as const;

type Mode = 'online' | 'offline' | 'empty';

let mode: Mode = 'online';

export const networkConfig = {
  getMode: (): Mode => mode,

  setMode: (next: Mode) => {
    mode = next;
  },
  reset: () => {
    mode = 'online';
  },
  isOffline: () => mode === 'offline',
  isEmpty: () => mode === 'empty',
};

export type NetworkMode = Mode;
