# Visual Design Guide - LMS Dashboard

## Design System Overview

### 1. Color Palette

#### Primary Colors
- **Brand Blue**: #465fff (Primary CTA, Links)
- **Light Blue**: #0ba5ec (Accents)
- **Dark Blue**: #2a31d8 (Hover states)

#### Success Colors
- **Success Green**: #10b981 (Success messages, Active states)
- **Light Green**: #d1fadf (Success backgrounds)

#### Alert Colors
- **Error Red**: #ef4444 (Errors, Warnings)
- **Light Red**: #fee2e2 (Error backgrounds)
- **Warning Orange**: #fb6514 (Warnings)
- **Light Orange**: #ffead5 (Warning backgrounds)

#### Neutral Colors
- **Gray-50**: #f9fafb (Lightest backgrounds)
- **Gray-100**: #f3f4f6 (Card backgrounds)
- **Gray-200**: #e5e7eb (Borders)
- **Gray-500**: #6b7280 (Secondary text)
- **Gray-900**: #111827 (Primary text)

### 2. Typography System

#### Font Family
- **Primary Font**: Outfit (sans-serif)
- **Fallback**: System fonts

#### Heading Hierarchy
```
h1 (title-lg): 48px, weight 700, line-height 60px
h2 (title-md): 36px, weight 700, line-height 44px
h3 (title-sm): 30px, weight 700, line-height 38px

Body Text:
Large: 20px, weight 400, line-height 30px
Normal: 16px, weight 400, line-height 24px
Small: 14px, weight 400, line-height 20px
XSmall: 12px, weight 400, line-height 18px
```

### 3. Spacing Scale

```
xs: 4px
sm: 8px
md: 12px
lg: 16px (base)
xl: 24px (gap-6)
2xl: 32px
3xl: 48px
```

### 4. Component Library

#### Buttons

**Primary Button**
```
Background: Gradient (Blue-600 → Blue-700)
Padding: px-6 py-2.5
Border-radius: 0.5rem (8px)
Font-weight: 500
Text-color: White
Hover: Darker gradient + shadow
Active: Scale 95% transform
```

**Secondary Button**
```
Background: Gray-50
Border: 1px Gray-300
Text-color: Gray-700
Hover: Gray-100 background
Dark mode: Gray-800 background
```

#### Cards

**Primary Card**
```
Border: 1px solid Gray-200
Border-radius: 1rem (16px)
Background: White
Padding: 24px
Shadow: sm (0 1px 2px rgba...)
Hover: md shadow + slight lift
Dark mode: Gray-800 background with opacity
```

#### Inputs

**Text Input**
```
Border: 1px solid Gray-300
Border-radius: 0.5rem (8px)
Padding: 10px 16px
Font-size: 14px
Focus: Blue ring (2px, offset 2px)
Dark mode: Gray-700 border, Gray-800 background
```

#### Tables

**Header Row**
```
Background: Transparent
Border-bottom: 1px Gray-200
Text: Gray-500, uppercase, 12px, tracking-wider
```

**Data Row**
```
Border-bottom: 1px Gray-200
Hover: Gray-50 background
Dark mode: hover is gray-800/50
```

### 5. Shadows

```
shadow-sm: 0 1px 2px 0 rgba(16, 24, 40, 0.05)
shadow-md: 0 2px 4px 0 rgba(16, 24, 40, 0.1)
shadow-lg: 0 4px 8px 0 rgba(16, 24, 40, 0.15)
shadow-xl: 0 8px 16px 0 rgba(16, 24, 40, 0.2)
```

### 6. Border Radius

```
sm: 0.375rem (6px)
base: 0.5rem (8px)
md: 0.75rem (12px)
lg: 1rem (16px)
xl: 1.5rem (24px)
2xl: 2rem (32px)
```

## Layout System

### Grid
- **Desktop**: 12-column grid
- **Tablet**: 8-column grid
- **Mobile**: 4-column grid
- **Gap**: 24px (md: 16px)

### Responsive Breakpoints
```
2xsm: 375px (mobile)
xsm: 425px (small mobile)
sm: 640px
md: 768px (tablet)
lg: 1024px
xl: 1280px
2xl: 1536px
3xl: 2000px
```

## Dark Mode Implementation

All components use Tailwind's `dark:` prefix:
```
Light: bg-white text-gray-900
Dark: dark:bg-gray-800 dark:text-white

Accent Colors in Dark:
- Primary: dark:text-blue-400
- Success: dark:text-green-400
- Error: dark:text-red-400
```

## Animation Specifications

### Transitions
```
- Duration: 300ms (default)
- Easing: ease-in-out
- Properties: all, shadow, transform, background
```

### Key Animations
```
Fade-in: opacity 0→1 (300ms)
Slide-up: translateY(10px)→0 (300ms)
Scale: scale(1)→0.95 (active state)
Spin: 360° rotation (continuous)
```

## Form Guidelines

### Form Layout
```
- Label spacing: 8px below label
- Field spacing: 16px between fields
- Error spacing: 4px below field
- Form sections: 24px spacing
```

### Form States
```
Default: Gray-300 border, White background
Hover: Gray-400 border
Focus: Blue-500 border + Blue ring
Error: Red-500 border + Red ring
Disabled: Gray-100 background, 50% opacity
```

## Data Visualization

### Badge Colors
```
Primary (Blue): bg-blue-100, text-blue-800
Success (Green): bg-green-100, text-green-800
Danger (Red): bg-red-100, text-red-800
Warning (Orange): bg-orange-100, text-orange-800
Purple: bg-purple-100, text-purple-800

Dark mode: Add /30 opacity and use 400 color for text
```

## Accessibility Standards

### Color Contrast
- Minimum WCAG AA: 4.5:1 for text
- Minimum WCAG AAA: 7:1 for text
- All implementations meet WCAG AA

### Focus States
- All interactive elements have visible focus rings
- Focus color: Blue-500 (#3b82f6)
- Ring width: 2px

### Font Sizes
- Minimum: 12px (with line-height 1.5)
- Ideal body: 16px
- Maximum: 72px (for headings)

## Mobile Responsive Guidelines

### Mobile-First Approach
1. Design for 375px first
2. Scale up to 425px
3. Enhance for 640px+
4. Optimize for 768px+

### Touch Targets
- Minimum size: 44x44px
- Ideal size: 48x48px
- Spacing: 8px minimum between targets

## Brand Voice in Design

- **Modern**: Clean lines, ample whitespace
- **Professional**: Consistent typography, proper hierarchy
- **Trustworthy**: Clear patterns, predictable interactions
- **Accessible**: Inclusive design for all users
- **Responsive**: Works seamlessly across devices

## Implementation Checklist

- [x] Color system implemented
- [x] Typography system defined
- [x] Component styles created
- [x] Dark mode support added
- [x] Responsive layouts working
- [x] Animations smooth and purposeful
- [x] Accessibility standards met
- [x] Form validation clear and helpful
- [x] Loading states visible
- [x] Error states obvious

---

**Design System Version**: 1.0
**Last Updated**: January 2026
**Status**: Production Ready ✅
