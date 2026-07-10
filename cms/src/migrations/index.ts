import * as migration_20260710_034257_initial from './20260710_034257_initial';

export const migrations = [
  {
    up: migration_20260710_034257_initial.up,
    down: migration_20260710_034257_initial.down,
    name: '20260710_034257_initial'
  },
];
