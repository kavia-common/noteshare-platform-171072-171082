//
// Ocean Professional Theme Tokens and Utilities
//

// PUBLIC_INTERFACE
export const theme = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',   // Blue 600
    primaryHover: '#1D4ED8', // Blue 700
    secondary: '#F59E0B', // Amber 500
    secondaryHover: '#D97706', // Amber 600
    success: '#10B981',   // Emerald 500
    error: '#EF4444',     // Red 500
    warning: '#F59E0B',   // Amber 500
    info: '#3B82F6',      // Blue 500
    text: '#111827',      // Gray 900
    textMuted: '#6B7280', // Gray 500
    background: '#F9FAFB',// Gray 50
    surface: '#FFFFFF',   // White
    border: '#E5E7EB',    // Gray 200
    ring: 'rgba(37, 99, 235, 0.35)', // primary focus ring
    // Dark mode tokens
    dark: {
      background: '#0B1220',
      surface: '#0F172A',
      text: '#E5E7EB',
      textMuted: '#9CA3AF',
      border: '#1F2937',
      ring: 'rgba(59,130,246,0.45)',
    }
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 10px rgba(2, 6, 23, 0.08)',
    lg: '0 10px 25px rgba(2, 6, 23, 0.12)',
    glow: '0 0 0 4px rgba(37,99,235,0.12)',
  },
  spacing: (n) => `${n * 4}px`,
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    sizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

// PUBLIC_INTERFACE
export function getCSSVariables(isDark = false) {
  const c = theme.colors;
  const palette = isDark
    ? { ...c, ...c.dark }
    : c;

  return `
    --color-primary: ${c.primary};
    --color-primary-hover: ${c.primaryHover};
    --color-secondary: ${c.secondary};
    --color-secondary-hover: ${c.secondaryHover};
    --color-success: ${c.success};
    --color-error: ${c.error};
    --color-warning: ${c.warning};
    --color-info: ${c.info};

    --color-text: ${palette.text};
    --color-text-muted: ${palette.textMuted};
    --color-bg: ${palette.background};
    --color-surface: ${palette.surface};
    --color-border: ${palette.border};
    --color-ring: ${palette.ring};

    --radius-sm: ${theme.radii.sm};
    --radius-md: ${theme.radii.md};
    --radius-lg: ${theme.radii.lg};
    --radius-pill: ${theme.radii.pill};

    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-glow: ${theme.shadows.glow};

    --font-family: ${theme.typography.fontFamily};
    --font-xs: ${theme.typography.sizes.xs};
    --font-sm: ${theme.typography.sizes.sm};
    --font-md: ${theme.typography.sizes.md};
    --font-lg: ${theme.typography.sizes.lg};
    --font-xl: ${theme.typography.sizes.xl};
    --font-weight-regular: ${theme.typography.weights.regular};
    --font-weight-medium: ${theme.typography.weights.medium};
    --font-weight-semibold: ${theme.typography.weights.semibold};
    --font-weight-bold: ${theme.typography.weights.bold};
  `;
}

// PUBLIC_INTERFACE
export function applyThemeToRoot(isDark = false) {
  const root = document.documentElement;
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  root.style.cssText += getCSSVariables(isDark);
}
