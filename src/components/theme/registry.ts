// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run 'npm run theme:generate' to update this file.

import atlasLayout from './layouts/atlas'
import ledgerLayout from './layouts/ledger'
import mydealzLayout from './layouts/mydealz'
import prismLayout from './layouts/prism'
import pulseLayout from './layouts/pulse'
import vitrineLayout from './layouts/vitrine'
import amberColor from './colors/amber'
import azureColor from './colors/azure'
import christmasColor from './colors/christmas'
import crimsonColor from './colors/crimson'
import defaultColor from './colors/default'
import emeraldColor from './colors/emerald'
import forestColor from './colors/forest'
import graphiteColor from './colors/graphite'
import midnightColor from './colors/midnight'
import plumColor from './colors/plum'
import roseColor from './colors/rose'
import sandColor from './colors/sand'
import tealColor from './colors/teal'
import tetColor from './colors/tet'

export const LAYOUTS = {
  'atlas': atlasLayout,
  'ledger': ledgerLayout,
  'mydealz': mydealzLayout,
  'prism': prismLayout,
  'pulse': pulseLayout,
  'vitrine': vitrineLayout,
} as const;

export const COLORS = {
  'amber': amberColor,
  'azure': azureColor,
  'christmas': christmasColor,
  'crimson': crimsonColor,
  'default': defaultColor,
  'emerald': emeraldColor,
  'forest': forestColor,
  'graphite': graphiteColor,
  'midnight': midnightColor,
  'plum': plumColor,
  'rose': roseColor,
  'sand': sandColor,
  'teal': tealColor,
  'tet': tetColor,
} as const;

export const AVAILABLE_LAYOUTS = Object.keys(LAYOUTS) as Array<keyof typeof LAYOUTS>;
export const AVAILABLE_COLORS = Object.keys(COLORS) as Array<keyof typeof COLORS>;
