// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Run 'npm run theme:generate' to update this file.

import aliexpressLayout from './layouts/aliexpress'
import amazonLayout from './layouts/amazon'
import minimalistLayout from './layouts/minimalist'
import modernLayout from './layouts/modern'
import mydealzLayout from './layouts/mydealz'
import shopeeLayout from './layouts/shopee'
import christmasColor from './colors/christmas'
import darkOrangeColor from './colors/dark-orange'
import defaultColor from './colors/default'
import forestColor from './colors/forest'
import midAutumnColor from './colors/mid-autumn'
import midnightColor from './colors/midnight'
import monochromeColor from './colors/monochrome'
import nationalDayColor from './colors/national-day'
import oceanColor from './colors/ocean'
import roseColor from './colors/rose'
import sunsetColor from './colors/sunset'
import tetColor from './colors/tet'

export const LAYOUTS = {
  'aliexpress': aliexpressLayout,
  'amazon': amazonLayout,
  'minimalist': minimalistLayout,
  'modern': modernLayout,
  'mydealz': mydealzLayout,
  'shopee': shopeeLayout,
} as const;

export const COLORS = {
  'christmas': christmasColor,
  'dark-orange': darkOrangeColor,
  'default': defaultColor,
  'forest': forestColor,
  'mid-autumn': midAutumnColor,
  'midnight': midnightColor,
  'monochrome': monochromeColor,
  'national-day': nationalDayColor,
  'ocean': oceanColor,
  'rose': roseColor,
  'sunset': sunsetColor,
  'tet': tetColor,
} as const;

export const AVAILABLE_LAYOUTS = Object.keys(LAYOUTS) as Array<keyof typeof LAYOUTS>;
export const AVAILABLE_COLORS = Object.keys(COLORS) as Array<keyof typeof COLORS>;
