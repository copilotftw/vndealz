export const azure = {
  light: {
    '--color-bg': '#F0F4FF', '--color-surface': '#FFFFFF', '--color-primary': '#1D4ED8',
    '--color-primary-hover': '#1E40AF', '--color-primary-text': '#FFFFFF', '--color-secondary': '#3B82F6',
    '--color-accent': '#38BDF8', '--color-text': '#0F172A', '--color-text-muted': '#475569',
    '--color-border': '#DBEAFE', '--color-hot': '#F97316', '--color-cold': '#38BDF8',
    '--color-success': '#16A34A', '--color-danger': '#DC2626', '--color-sponsored': '#7C3AED',
    '--color-nav-bg': '#FFFFFF', '--color-nav-text': '#0F172A', '--color-nav-text-muted': '#475569',
    '--color-nav-border': '#DBEAFE', '--color-nav-input-bg': '#F0F4FF',
  },
  dark: {
    '--color-bg': '#07101F', '--color-surface': '#0F1E35', '--color-primary': '#60A5FA',
    '--color-primary-hover': '#93C5FD', '--color-primary-text': '#07101F', '--color-secondary': '#93C5FD',
    '--color-accent': '#38BDF8', '--color-text': '#E2E8F0', '--color-text-muted': '#94A3B8',
    '--color-border': '#1E3A5F', '--color-hot': '#FB923C', '--color-cold': '#38BDF8',
    '--color-success': '#4ADE80', '--color-danger': '#F87171', '--color-sponsored': '#A78BFA',
    '--color-nav-bg': '#060E1C', '--color-nav-text': '#E2E8F0', '--color-nav-text-muted': '#94A3B8',
    '--color-nav-border': '#1E3A5F', '--color-nav-input-bg': 'rgba(255,255,255,0.08)',
  },
} as const;

export default azure;
