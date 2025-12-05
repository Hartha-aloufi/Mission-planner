# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project using shadcn/ui components with Tailwind CSS v4. The project is initialized with the React Compiler enabled for optimized rendering performance.

## Common Commands

**Development:**
```bash
npm run dev        # Start dev server
npm run build      # TypeScript check + production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Tech Stack

- **React 19** with React Compiler (babel-plugin-react-compiler)
- **TypeScript 5.9** with strict mode enabled
- **Vite 7** as build tool
- **Tailwind CSS v4** with @tailwindcss/vite plugin
- **shadcn/ui** component library pattern
- **Radix UI** primitives for accessible components
- **ESLint** with TypeScript, React Hooks, and React Refresh plugins

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component
├── index.css             # Global styles with Tailwind v4 and CSS variables
├── components/
│   └── ui/               # shadcn/ui components (button.tsx, etc.)
└── lib/
    └── utils.ts          # Utility functions (cn helper)
```

## Architecture Details

### Path Aliases
- `@/*` is aliased to `./src/*` in both tsconfig and Vite config
- Always use `@/` imports for src files (e.g., `import { Button } from "@/components/ui/button"`)

### Styling System
- Uses Tailwind CSS v4 with custom CSS variables defined in `src/index.css`
- Design tokens are defined as CSS custom properties using OKLCH color space
- Theme supports light/dark modes via `.dark` class
- `cn()` utility in `src/lib/utils.ts` combines clsx and tailwind-merge for conditional classes

### shadcn/ui Pattern
- UI components in `src/components/ui/` follow shadcn/ui conventions
- Components use `class-variance-authority` (cva) for variant management
- Components support polymorphism via Radix UI's `asChild` prop pattern
- All interactive components include proper focus-visible states and ARIA support

### React Compiler
- React Compiler is enabled via babel-plugin-react-compiler in vite.config.ts
- Automatically optimizes component rendering without manual memoization
- No need to use useMemo/useCallback unless for non-render optimizations

### TypeScript Configuration
- Strict mode enabled with additional safety checks
- Uses `erasableSyntaxOnly: true` for compatibility with React Compiler
- `noEmit: true` since Vite handles bundling
- Module resolution set to "bundler" for modern module handling

## Development Guidelines

### Adding shadcn/ui Components
When adding new shadcn/ui components, place them in `src/components/ui/` and ensure they:
- Use the `cn()` utility for className merging
- Follow the existing patterns for variants and polymorphism
- Include proper TypeScript types with `React.ComponentProps` and `VariantProps`

### Styling Conventions
- Prefer Tailwind utility classes over custom CSS
- Use design tokens from index.css for colors (e.g., `bg-primary`, `text-foreground`)
- Follow the existing dark mode pattern with `.dark` variant
- Use `data-slot` attributes for component identification (as seen in Button)

### ESLint Configuration
- Project uses flat config format (eslint.config.js)
- Enforces React Hooks rules and React Refresh patterns
- TypeScript recommended rules are enabled
- `dist/` directory is globally ignored
