# KodNest Premium Build System

A design system for serious B2C product. Calm, intentional, coherent, confident.

---

## Design Philosophy

- **Calm** — No flash, no noise, no animation overload
- **Intentional** — Every choice serves purpose
- **Coherent** — One mind designed it; no visual drift
- **Confident** — Large type, generous spacing, clear hierarchy

**Avoid:** Gradients, glassmorphism, neon colors, hackathon-style, playful fonts, random sizes.

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--kn-bg` | `#F7F6F3` | Background (off-white) |
| `--kn-text` | `#111111` | Primary text |
| `--kn-accent` | `#8B0000` | Accent, primary actions |
| `--kn-success` | `#4A6B4A` | Success states |
| `--kn-warning` | `#8B6914` | Warning states |

**Rule:** Maximum 4 colors across the entire system. No additional palette.

---

## Typography

| Element | Font | Size | Line Height |
|---------|------|------|-------------|
| Headings | Cormorant Garamond (serif) | XL: 2.5rem, LG: 2rem, MD: 1.5rem | 1.25 |
| Body | Inter (sans-serif) | 16–18px | 1.6–1.8 |
| Caption | Inter | 14px | 1.6 |

**Rules:**
- Text blocks: max-width 720px
- No decorative fonts
- No random sizes

---

## Spacing Scale

Use only these values. Never use 13px, 27px, etc.

| Token | Value |
|-------|-------|
| `--kn-space-1` | 8px |
| `--kn-space-2` | 16px |
| `--kn-space-3` | 24px |
| `--kn-space-4` | 40px |
| `--kn-space-5` | 64px |

Whitespace is part of the design.

---

## Global Layout Structure

Every page follows this order:

```
[Top Bar]
    ↓
[Context Header]
    ↓
[Primary Workspace (70%) | Secondary Panel (30%)]
    ↓
[Proof Footer]
```

### Top Bar
- **Left:** Project name
- **Center:** Progress indicator (Step X / Y)
- **Right:** Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline
- 1-line subtext
- Clear purpose, no hype language

### Primary Workspace (70%)
- Main product interaction
- Clean cards, predictable components
- No crowding

### Secondary Panel (30%)
- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- Calm styling

### Proof Footer (persistent)
Checklist style:
- □ UI Built
- □ Logic Working
- □ Test Passed
- □ Deployed

Each checkbox requires user proof input.

---

## Components

### Buttons
- **Primary:** Solid deep red (`--kn-accent`)
- **Secondary:** Outlined, transparent background
- Same hover effect and border radius everywhere
- Border radius: 4px

### Inputs
- Clean borders
- No heavy shadows
- Clear focus state (border color change)

### Cards
- Subtle border
- No drop shadows
- Balanced padding (24px)

---

## Interaction Rules

- **Transitions:** 150–200ms, ease-in-out
- **No bounce, no parallax**

---

## Error & Empty States

### Errors
- Explain what went wrong
- Explain how to fix
- Never blame the user

### Empty States
- Provide next action
- Never feel dead

---

## File Structure

```
design-system/
├── design-tokens.css   # Colors, typography, spacing, transitions
├── base.css            # Reset, typography, spacing utilities
├── components.css      # Buttons, inputs, cards, badges, prompt box
├── layout.css          # Top bar, context header, workspace, panel, footer
└── kodnest-premium.css # Single entry point (import all)
```

---

## Usage

```html
<link rel="stylesheet" href="design-system/kodnest-premium.css">
```

Or in your build:

```css
@import "./design-system/kodnest-premium.css";
```

---

*KodNest Premium Build System — One mind. No drift.*
