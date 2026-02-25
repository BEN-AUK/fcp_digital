# FCP Digital

NZ Food Safety–compliant digital logging (Expo/PWA, Firebase, Zustand, i18next).

## Setup

1. Copy `.env.example` to `.env` and fill in Firebase config.
2. `npm install`
3. `npm run web` or `npm start` (then choose platform).

## Auth (Dual-layer)

- **Venue**: Firebase Auth with `browserLocalPersistence` — survives device restart.
- **Staff**: Zustand + AsyncStorage persist — survives device restart.
- **Invite**: Open with `?inviteToken=<payload>`. If payload is base64 JSON `{ staffId, displayName }`, staff is bound silently after venue is set.

## Offline

- Firestore: IndexedDb persistence enabled for web.
- Writes: use Zustand + local cache first; sync to Firestore in background (implement per feature).

## Rules

See `.cursor/rules/core-development-non-negotiables.mdc` for legal, hardware, auth, UI, and coding constraints.
