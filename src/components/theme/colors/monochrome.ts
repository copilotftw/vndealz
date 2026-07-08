export const monochrome = {
  
    light: {
      '--color-bg': '#FAFAFA', '--color-surface': '#FFFFFF', '--color-primary': '#171717',
      '--color-primary-hover': '#404040', '--color-primary-text': '#FFFFFF', '--color-secondary': '#525252',
      '--color-accent': '#A3A3A3', '--color-text': '#0A0A0A', '--color-text-muted': '#737373',
      '--color-border': '#E5E5E5', '--color-hot': '#DC2626', '--color-cold': '#2563EB',
      '--color-success': '#16A34A', '--color-danger': '#DC2626', '--color-sponsored': '#7C3AED',
      '--color-nav-bg': '#FFFFFF', '--color-nav-text': '#0A0A0A', '--color-nav-text-muted': '#737373',
      '--color-nav-border': '#E5E5E5', '--color-nav-input-bg': '#F5F5F5',
    },
    dark: {
      '--color-bg': '#0A0A0A', '--color-surface': '#171717', '--color-primary': '#FAFAFA',
      '--color-primary-hover': '#E5E5E5', '--color-primary-text': '#0A0A0A', '--color-secondary': '#A3A3A3',
      '--color-accent': '#525252', '--color-text': '#FAFAFA', '--color-text-muted': '#A3A3A3',
      '--color-border': '#262626', '--color-hot': '#EF4444', '--color-cold': '#3B82F6',
      '--color-success': '#22C55E', '--color-danger': '#EF4444', '--color-sponsored': '#8B5CF6',
      '--color-nav-bg': '#0F0F0F', '--color-nav-text': '#FAFAFA', '--color-nav-text-muted': '#A3A3A3',
      '--color-nav-border': '#262626', '--color-nav-input-bg': 'rgba(255,255,255,0.08)',
    },
  } as const;

export default monochrome;
