# OverlandOS 🏕️

A mobile-first overland adventure app built with Expo + React Native.

## Features

- **Auth** — Supabase email/password login & registration
- **Gear & Vehicle Checklists** — Multiple lists, categories, progress tracking, Cybertruck RTT starter template
- **Campsite & BLM Search** — Recreation.gov API + BLM mock data, filter by type/amenities
- **Dark Theme** — Black/dark gray with orange accents

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your values:

- **Supabase**: Create a project at [supabase.com](https://supabase.com), get your URL + anon key
- **Recreation.gov**: Register for a free API key at [ridb.recreation.gov](https://ridb.recreation.gov/docs) (or use `DEMO_KEY` for testing)

### 3. Supabase — Enable Email Auth

In your Supabase dashboard:
1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. (Optional) Disable email confirmation for dev: Authentication → Settings → Disable "Confirm email"

### 4. Run the app

```bash
# Start dev server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

## Project Structure

```
app/
  (tabs)/         # Bottom tab screens
  auth/           # Login & register
components/       # Reusable UI components
hooks/            # Custom React hooks
lib/              # Supabase client, API helpers
constants/        # Colors, theme
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 51 + React Native |
| Routing | Expo Router (file-based) |
| Auth | Supabase |
| Storage | AsyncStorage |
| Campsite Data | Recreation.gov API + BLM mock data |
| Language | TypeScript |

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build iOS/Android
eas build --platform ios
eas build --platform android
```
