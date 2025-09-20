# Page Transitions System

This document explains the page transition system implemented in the KrushiMitra app.

## Overview

We've implemented a smooth transition system between pages using a custom `PageTransition` component and navigation utilities. This provides a more polished user experience when navigating between screens.

## Components

### PageTransition Component

The `PageTransition` component (`/components/PageTransition.tsx`) provides four types of transitions:

1. **Fade** - Simple opacity transition (default)
2. **Scale** - Scale transform transition
3. **Slide** - Vertical slide transition
4. **SlideFromRight** - Horizontal slide from right transition

### Navigation Utilities

The navigation utilities (`/src/utils/navigation.ts`) provide wrapper functions for Expo Router navigation methods with built-in transition support:

- `navigateWithTransition` - Navigate to a new screen
- `replaceWithTransition` - Replace the current screen
- `backWithTransition` - Go back with transition

## Implementation

### Using PageTransition Component

```tsx
import PageTransition from '@/components/PageTransition';

export default function MyScreen() {
  const [transitioning, setTransitioning] = useState(false);
  
  return (
    <PageTransition isActive={!transitioning} type="slide">
      {/* Screen content */}
    </PageTransition>
  );
}
```

### Using Navigation Utilities

```tsx
import { replaceWithTransition } from '@/src/utils/navigation';

const handleNavigation = () => {
  setTransitioning(true);
  // The actual navigation happens in useEffect when transitioning state changes
};

useEffect(() => {
  if (transitioning) {
    replaceWithTransition('/path/to/screen');
  }
}, [transitioning]);
```

## Transition Types

1. **Fade** - Best for simple transitions between unrelated screens
2. **Scale** - Good for emphasizing important transitions (e.g., splash screen)
3. **Slide** - Natural for sequential steps (e.g., onboarding flow)
4. **SlideFromRight** - Ideal for forward navigation in a hierarchy

## Current Implementation

The transitions have been implemented in the following screens:

1. **Index Screen** - Uses fade transition to splash screen
2. **Splash Screen** - Uses scale transition to language screen
3. **Language Screen** - Uses slide transition to login screen
4. **Login Screen** - Uses slide from right transition to main app

## Customization

To change the transition type for a screen, modify the `type` prop in the `PageTransition` component:

```tsx
<PageTransition isActive={!transitioning} type="scale">
```

To adjust the transition timing, modify the `transitionDelay` in the navigation utilities:

```tsx
replaceWithTransition('/path', { transitionDelay: 500 });
```