# Developer Setup Guide - IMPORTANT CHANGES

## ⚠️ CRITICAL: Expo Go No Longer Works

This project has been **migrated from Expo Go to Development Builds** due to native dependencies. **You cannot use `expo start` and scan QR code anymore.**

## What Changed

### 1. Native Dependencies Added

- **react-native-vlc-media-player** - For RTSP video streaming
- **react-native-reanimated** - Removed due to Worklets conflicts
- These require **native compilation** (not supported in Expo Go)

### 2. Configuration Changes

- **metro.config.js** - Added for proper Metro bundler configuration
- **babel.config.js** - Removed react-native-reanimated plugin
- **package.json** - Removed react-native-reanimated dependency

### 3. Component Updates

- **LogoLoadingScreen.tsx** - Converted from Reanimated to React Native Animated API
- **RTSPPlayer.js** - Optimized VLC Player settings for RTSP streaming
- **NetworkTest.js** - Added network connectivity testing component

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo-url>
cd obex-edge
npm install
```

### 2. Development Build (Required)

**You MUST build the app - Expo Go won't work:**

**Option A: EAS Build (Recommended - No Java SDK needed):**

```bash
# Install EAS CLI if not installed
npm install -g @expo/eas-cli

# Build development version (connects to Metro bundler)
eas build --platform android --profile development #(This won/'t take time like the others)
```

**Option B: Local Build (Requires Java SDK setup):**

```bash
# For Android (requires Android Studio + Java SDK)
npx expo run:android

# For iOS (requires Xcode)
npx expo run:ios
```

**Use Option A** to avoid Java SDK installation and potential build errors.

### 3. EAS Build (Production)

```bash
# Install EAS CLI if not installed
npm install -g @expo/eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Why These Changes Were Made

### 1. RTSP Streaming Requirements

- **VLC Player** needed for robust RTSP video streaming
- Expo Go doesn't support native video players
- **Development builds required** for VLC Player to work

### 2. Reanimated Issues

- **react-native-reanimated v4** caused Worklets initialization errors
- **Removed completely** and replaced with React Native's built-in Animated API
- **LogoLoadingScreen** now uses standard animations (still looks the same)

### 3. Performance Optimizations

- **Metro config** added for better bundling
- **VLC Player settings** optimized for mobile RTSP streaming
- **Network testing** component added for debugging connectivity

## Development Workflow

### Old Workflow (No longer works):

```bash
expo start
# Scan QR code with Expo Go ❌
```

### New Workflow (Required):

```bash
# Development (Recommended)
eas build --platform android --profile development  # Build dev version
# Download and install APK, then:
npx expo start  # Start Metro bundler

# Alternative (requires Java SDK)
npx expo run:android  # Local build + install
npx expo start        # Start Metro bundler

# Production
eas build --platform android --profile production
```

## Key Files Changed

### Added Files:

- `metro.config.js` - Metro bundler configuration
- `components/NetworkTest.js` - Network connectivity testing

### Modified Files:

- `package.json` - Removed react-native-reanimated
- `babel.config.js` - Removed reanimated plugin
- `components/LogoLoadingScreen.tsx` - Converted to React Native Animated
- `components/RTSPPlayer.js` - Optimized VLC settings
- `screens/LiveStreamScreen.js` - Added NetworkTest component

### Unchanged:

- All other screens and components work exactly the same
- UI/UX remains identical
- App functionality is the same

## Testing RTSP Streaming

### Network Requirements:

- Phone and camera must be on **same WiFi network**
- Router **AP Isolation must be disabled**
- Camera must support RTSP protocol

### Test Connectivity:

1. Go to **Live Stream** screen
2. Use **Network Test** component to check camera connectivity
3. If test fails, fix network configuration first
4. RTSP streaming will work once network connectivity is established

## Troubleshooting

### Build Errors:

```bash
# Clean and rebuild
npx expo run:android --clear

# Reset Metro cache
npx expo start --clear
```

### RTSP Not Working:

1. Test network connectivity with NetworkTest component
2. Ensure phone and camera on same network
3. Check router AP isolation settings
4. Verify RTSP URL format: `rtsp://user:pass@ip:port/path`

### Development vs Production:

- **Development builds**: Connect to Metro bundler, faster iteration
- **EAS builds**: Standalone APK/IPA files for distribution

## Summary for Your Co-Developer

**Bottom line:**

- Clone repo → `npm install` → `eas build --platform android --profile development`
- **Never use Expo Go again**
- **Use EAS development builds** to avoid Java SDK setup issues
- Everything else works the same
- RTSP streaming now works properly

The app is now a **proper React Native app with native dependencies** instead of a pure Expo managed workflow.
