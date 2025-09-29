# Troubleshooting Guide for KrushiMitra

This guide provides solutions for common issues encountered when setting up and running the KrushiMitra application.

## 1. Ollama Server Configuration Issues

### Problem: Unable to connect to Ollama at http://172.20.157.114:11434/api/generate

### Solution:

1. **Start Ollama with network binding:**
   ```bash
   # On Windows PowerShell (run as Administrator)
   $env:OLLAMA_HOST="0.0.0.0"; ollama serve
   ```

2. **Configure Windows Firewall:**
   ```powershell
   netsh advfirewall firewall add rule name="Ollama Server" dir=in action=allow protocol=TCP localport=11434
   ```

3. **Verify Ollama is running:**
   ```bash
   # Check if llama3 model is installed
   ollama list

   # If not installed, pull it
   ollama pull llama3
   ```

4. **Test connectivity:**
   ```bash
   # From your computer
   curl http://localhost:11434/api/tags

   # From another device on the same network
   curl http://YOUR_COMPUTER_IP:11434/api/tags
   ```

## 2. TTS Service Configuration Issues

### Problem: Unable to connect to TTS service

### Solution:

1. **Start the backend server correctly:**
   ```bash
   cd backend
   npm start
   ```

2. **Use the correct endpoint:**
   - TTS endpoint: `http://10.60.149.114:3000/tts` (port 3000, not 3001)
   - AI chat endpoint: `http://10.60.149.114:3000/ai/chat`

## 3. Environment Configuration

### Create a .env file in your project root with the correct IP addresses:
```env
# For mobile app environment variables
EXPO_PUBLIC_API_URL=http://10.60.149.114:3000
EXPO_PUBLIC_OLLAMA_SERVER_IP=10.60.149.114
```

## 4. Network Verification Steps

1. **Verify your computer's IP address:**
   ```bash
   ipconfig
   ```
   Look for your WiFi adapter's IPv4 address.

2. **Ensure both devices are on the same network:**
   - Computer and mobile device must be on the same WiFi network

3. **Test connectivity between devices:**
   ```bash
   # From mobile device, test if you can reach the computer
   ping 10.60.149.114
   ```

## 5. Updated Connection URLs

Based on your project configuration, use these URLs:
- Ollama API: `http://10.60.149.114:11434/api/generate`
- Backend API: `http://10.60.149.114:3000`
- TTS Endpoint: `http://10.60.149.114:3000/tts`

## 6. Debugging Steps

1. **Check if services are running:**
   ```bash
   # Check if port 11434 (Ollama) is listening
   netstat -an | findstr 11434

   # Check if port 3000 (Backend) is listening
   netstat -an | findstr 3000
   ```

2. **Test endpoints directly:**
   ```bash
   # Test Ollama
   curl http://localhost:11434/api/tags

   # Test backend health
   curl http://localhost:3000/health
   ```

3. **Check firewall settings:**
   - Ensure Windows Firewall allows inbound connections on ports 11434 and 3000
   - You may need to add exceptions for Node.js and Ollama

## 7. Mobile App Configuration

Make sure your mobile app is configured with the correct IP addresses:

In [app/ai-chat.tsx](file:///d:/KrushiMitra/app/ai-chat.tsx):
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.60.149.114:3000';
```

In [src/utils/ollama.ts](file:///d:/KrushiMitra/src/utils/ollama.ts):
```typescript
const endpoint = `http://${serverIp}:11434/api/generate`;
```

## 8. Common Error Messages and Solutions

### "Network request failed"
- Ensure the backend server is running
- Check that you're using the correct IP address
- Verify that ports 3000 and 11434 are not blocked by firewall

### "Failed to load"
- Check your internet connection
- Ensure the ElevenLabs API key is correctly configured in the backend

### "Ollama request failed with status 500"
- Make sure the llama3 model is installed
- Restart the Ollama service

## 9. Additional Tips

1. **Restart services**: If you're experiencing connection issues, try restarting both the Ollama service and the backend server.

2. **Check ElevenLabs API key**: Make sure the ElevenLabs API key is correctly set in the backend environment variables.

3. **Use correct IP addresses**: Ensure you're using the correct LAN IP address for your computer, not localhost.

4. **Mobile device network**: Make sure your mobile device is on the same network as your computer.

5. **Port conflicts**: If ports 3000 or 11434 are already in use, you may need to stop other services or change the ports in the configuration.