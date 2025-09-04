# Copilot Instructions for AI Coding Agents

## Project Overview
This is a React Native app using Expo, TypeScript, and Metro bundler. The app is structured around venue management and booking workflows, supporting both venue owners and regular users. Routing is handled by `expo-router` with typed routes enabled.

## Architecture & Key Components
- **Screens**: Located in `app/` and `app/(tabs)/`, each file is a screen or tab. Examples: `first-venue-setup.tsx`, `venue/[id].tsx`, `edit-venue/[id].tsx`, `onboarding.tsx`.
- **Context Providers**: Shared state and logic are managed via React Contexts in `components/` (e.g., `AuthContext.tsx`, `VenueContext.tsx`).
- **Mock Data**: All data flows (venues, bookings) use mock objects from `data/mockData.ts`.
- **Localization**: i18n is set up via `i18n/index.ts` and `locales/` (English/Arabic). Use `useTranslation` for UI text.
- **UI Patterns**: Consistent use of React Native `StyleSheet` for styling. Category, amenity, and unit chips follow a color and style convention (see `categoryChip`, `activeCategoryChip`, etc.).
- **Routing**: Dynamic routes (e.g., `[id].tsx`) are used for entity detail/edit screens. Navigation uses `expo-router`'s `router` object.

## Developer Workflows
- **Build/Run**: Use Expo CLI (`npx expo start`) to run the app locally. Metro bundler is used for web builds.
- **No Tests**: There are no test files or test commands present.
- **Debugging**: Use Expo's built-in debugging tools. No custom debug scripts found.
- **Linting**: No explicit linting setup detected; follow TypeScript and React Native conventions.

## Project-Specific Conventions
- **Form State**: Forms use local state objects (e.g., `formData`) and update via `setFormData({...formData, field: value})`.
- **Mock Data Usage**: All business logic (venue creation, booking, filtering) manipulates mock data arrays. No backend/API integration.
- **Owner/User Flows**: Screens and logic often branch based on `user.userType` (see `first-venue-setup.tsx`, `OwnerDashboard`).
- **Component Imports**: Use `@/components/...` and `@/data/...` for absolute imports.
- **Localization**: Always wrap UI text in `t('key')` for translation.

## Integration Points
- **Expo Plugins**: See `app.json` for plugins (`expo-router`, `expo-font`, `expo-web-browser`).
- **External Libraries**: Uses `lucide-react-native` for icons, `expo-image-picker` for image uploads.

## Examples
- **Venue Creation**: See `first-venue-setup.tsx` for form, image picker, and amenity selection patterns.
- **Booking Flow**: See `venue/[id].tsx` for booking logic and reviews integration.
- **Tab Navigation**: See `app/(tabs)/_layout.tsx` for tab setup and icon usage.

## Patterns to Follow
- Use context providers for shared state.
- Use mock data for all CRUD operations.
- Use dynamic routing for entity screens.
- Follow StyleSheet conventions for UI consistency.
- Always use translation hooks for UI text.

---
If any section is unclear or missing, please provide feedback to improve these instructions.
