# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project using shadcn/ui components with Tailwind CSS v4. The project is initialized with the React Compiler enabled for optimized rendering performance.

## Common Commands

**Development:**
```bash
bun run dev        # Start dev server
bun run build      # TypeScript check + production build
bun run preview    # Preview production build
bun run lint       # Run ESLint
```

## Tech Stack

- **React 19** with React Compiler (babel-plugin-react-compiler)
- **TypeScript 5.9** with strict mode enabled
- **Vite 7** as build tool
- **Tailwind CSS v4** with @tailwindcss/vite plugin
- **shadcn/ui** component library pattern
- **Radix UI** primitives for accessible components
- **Zustand** for state management
- **react-map-gl** with Mapbox GL for maps
- **ESLint** with TypeScript, React Hooks, and React Refresh plugins

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component
├── index.css             # Global styles with Tailwind v4 and CSS variables
├── components/
│   └── ui/               # shadcn/ui components (button.tsx, etc.)
├── stores/               # Zustand stores (useAuthStore.ts, useMapStore.ts, etc.)
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

### State Management with Zustand

This project uses Zustand for state management. Follow these best practices:

**1. Only Export Custom Hooks**
- Never export the store directly
- Export custom hooks for accessing state/actions
- Example:
  ```typescript
  const useStore = create(...)
  export const useUser = () => useStore((state) => state.user)
  export const useActions = () => useStore((state) => state.actions)
  ```

**2. Prefer Atomic Selectors**
- Create specific selectors for each piece of state
- Avoid selecting entire state objects when only part is needed
- Improves performance by preventing unnecessary re-renders
- Example:
  ```typescript
  // Good - atomic selector
  export const useUserId = () => useStore((state) => state.user.id)

  // Avoid - selecting entire object
  export const useUser = () => useStore((state) => state.user)
  ```

**3. Separate Actions from State**
- Keep actions in a separate object within the store
- Makes it clear what's state and what's behavior
- Example:
  ```typescript
  interface Store {
    user: User | null
    isLoading: boolean
    actions: {
      login: (credentials: Credentials) => Promise<void>
      logout: () => void
    }
  }
  ```

**4. Model Actions as Events, not Setters**
- Name actions after events/intentions, not after what they set
- Example:
  ```typescript
  // Good - event-based naming
  actions: {
    login: () => {...}
    submitForm: () => {...}
    fetchUserData: () => {...}
  }

  // Avoid - setter-based naming
  actions: {
    setUser: () => {...}
    setFormData: () => {...}
  }
  ```

**Store Location:**
- Place stores in `src/stores/` directory
- Use descriptive names: `useAuthStore.ts`, `useMapStore.ts`, etc.

**Reference:** [Working with Zustand by TkDodo](https://tkdodo.eu/blog/working-with-zustand)

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
