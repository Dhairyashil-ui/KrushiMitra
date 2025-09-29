# TTS Connection Fix Guide

## Problem Fixed ✅
Your app was trying to connect to `localhost:3000` which only works in web browsers, not on mobile devices.

## Solution Applied ✅

### 1. Environment Configuration Created
- Created `.env` file with LAN IP configuration
- Set `EXPO_PUBLIC_API_URL=http://10.60.149.114:3000`
- Set `EXPO_PUBLIC_OLLAMA_SERVER_IP=10.60.149.114`

### 2. API URLs Updated
Updated these files to use LAN IP instead of localhost:
- `app/(tabs)/index.tsx` - Main voice orb TTS
- `app/ai-chat.tsx` - AI chat TTS
- `app/index.tsx` - Landing page TTS

### 3. Backend Server Status ✅
- Backend server is running on port 3000
- TTS endpoint tested and working: `http://10.60.149.114:3000/tts`
- Health check passed: `http://10.60.149.114:3000/health`
- Using ONLY Niraj Hindi voice as requested

## How to Use

### For Web Browser (localhost works):
- App will automatically work in web browser
- Uses either LAN IP or localhost fallback

### For Mobile Devices (Expo Go or built app):
- App now uses LAN IP: `10.60.149.114:3000`
- Make sure both devices are on same WiFi network
- Backend server must be running

## Testing Steps

1. **Ensure Backend is Running:**
   ```bash
   cd backend
   node server.js
   ```

2. **Test TTS Endpoint:**
   ```bash
   curl "http://10.60.149.114:3000/tts?lang=hi&text=Hello%20test" -o test.mp3
   ```

3. **Test from Mobile:**
   - Open Expo Go app
   - Scan QR code or connect to dev server
   - Try voice interaction with the voice orb

## Important Notes

- **LAN IP Changes:** If you connect to a different WiFi network, update the IP in `.env` file
- **Firewall:** Make sure Windows Firewall allows Node.js on port 3000
- **Network:** Both computer and mobile device must be on same WiFi
- **Voice Only:** System uses ONLY Niraj Hindi voice - no fallbacks or multiple voices

## Error Messages to Look For

✅ **Success:** Console shows "API_BASE_URL configured as: http://10.60.149.114:3000"
✅ **Success:** Console shows "Using Niraj Hindi voice for TTS"
❌ **Error:** "ERR_CONNECTION_REFUSED" means backend not running or wrong IP
❌ **Error:** "Network request failed" means firewall or network issue

## IP Address Detection

To find your computer's LAN IP:
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

Look for IPv4 address under your WiFi adapter (usually starts with 192.168.x.x or 10.x.x.x).