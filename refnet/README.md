# RefNet Monorepo

This monorepo contains the backend (Supabase) and frontend (React Native + Expo) for the RefNet peer-to-peer social referral network.

## Directory Structure
- `/backend`: Contains the Supabase SQL schema (`schema.sql`) for creating tables and enabling Row Level Security (RLS). You can run this directly in your Supabase SQL Editor.
- `/frontend`: Contains the React Native Expo application.

## Setup Instructions

### Backend (Supabase)
1. Create a new Supabase project.
2. Go to **Authentication -> Providers**, and enable Phone Auth (Twilio or Test OTP).
3. Go to the **SQL Editor** and run the contents of `/backend/schema.sql`.

### Frontend (React Native / Expo)
1. Navigate to the frontend directory locally:
   ```bash
   cd frontend
   ```
2. Initialize the project dependencies:
   ```bash
   npx create-expo-app . -t expo-template-blank-typescript
   npm install @supabase/supabase-js @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
   ```
3. Create a `.env` file in `/frontend` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start the development server:
   ```bash
   npm run start
   ```
