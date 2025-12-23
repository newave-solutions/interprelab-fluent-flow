/**
 * Shared Design Tokens for InterpreLab Platform
 * Ensures consistent fonts, colors, and styling across all services
 */

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'serif'],
    display: ['Poppins', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Nobel Brand Colors
  nobel: {
    gold: '#C5A059',
    dark: '#1a1a1a',
    cream: '#F9F8F4',
  },

  // Primary (from CSS variables)
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    glow: 'hsl(var(--primary-glow))',
  },

  // Secondary
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },

  // Status Colors
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
  },
  warning: {
    DEFAULT: 'hsl(var(--warning))',
    foreground: 'hsl(var(--warning-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },

  // Neutral Colors
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },

  // UI Elements
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  nobelGold: 'hsl(var(--nobel-gold))',

  // Component Colors
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
};

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  '2xl': 'calc(var(--radius) + 8px)',
  '3xl': '1.5rem',
  full: '9999px',
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: 'var(--shadow-glow)',
  card: 'var(--shadow-card)',
  cardLight: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  cardHoverLight: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  timing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-20px)' },
    },
    pulseGlow: {
      '0%, 100%': { opacity: 1, boxShadow: '0 0 20px hsl(var(--primary) / 0.5)' },
      '50%': { opacity: 0.8, boxShadow: '0 0 40px hsl(var(--primary) / 0.8)' },
    },
  },
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
};

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
  primary: 'var(--gradient-primary)',
  success: 'var(--gradient-success)',
  glow: 'var(--gradient-glow)',
};

// ============================================================================
// COMPONENT SPECIFIC TOKENS
// ============================================================================

export const components = {
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  },
};

// ============================================================================
// BADGE RARITY COLORS
// ============================================================================

export const badgeRarityColors = {
  common: {
    bg: 'hsl(210, 16%, 93%)',
    border: 'hsl(210, 16%, 82%)',
    text: 'hsl(210, 16%, 35%)',
    glow: 'rgba(148, 163, 184, 0.3)',
  },
  uncommon: {
    bg: 'hsl(142, 71%, 95%)',
    border: 'hsl(142, 71%, 70%)',
    text: 'hsl(142, 71%, 25%)',
    glow: 'rgba(34, 197, 94, 0.3)',
  },
  rare: {
    bg: 'hsl(221, 83%, 95%)',
    border: 'hsl(221, 83%, 70%)',
    text: 'hsl(221, 83%, 25%)',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  epic: {
    bg: 'hsl(271, 81%, 95%)',
    border: 'hsl(271, 81%, 70%)',
    text: 'hsl(271, 81%, 25%)',
    glow: 'rgba(168, 85, 247, 0.3)',
  },
  legendary: {
    bg: 'hsl(45, 93%, 95%)',
    border: 'hsl(45, 93%, 60%)',
    text: 'hsl(45, 93%, 20%)',
    glow: 'rgba(234, 179, 8, 0.4)',
  },
};

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const designTokens = {
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  gradients,
  components,
  badgeRarityColors,
};

export default designTokens;
