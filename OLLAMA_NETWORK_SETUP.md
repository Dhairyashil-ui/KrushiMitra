# Ollama Network Configuration Setup Guide

## Overview
This guide explains how to configure Ollama server for network accessibility, allowing mobile devices on the same LAN to connect to the AI model.

## Quick Setup Steps

### 1. Start Ollama with Network Binding
```powershell
$env:OLLAMA_HOST="0.0.0.0"; ollama serve
```
This command starts Ollama and makes it accessible from all network interfaces.

### 2. Configure Windows Firewall (Run as Administrator)
```powershell
netsh advfirewall firewall add rule name="Ollama Server" dir=in action=allow protocol=TCP localport=11434
```

### 3. Test Connectivity
Test from any device on the same network:
```
http://10.60.149.114:11434/api/tags
```

You should see JSON output with available models (e.g., llama3:latest).

## Configuration Details

### Environment Variables
The following are configured in `.env`:
- `EXPO_PUBLIC_OLLAMA_SERVER_IP=10.60.149.114`
- `EXPO_PUBLIC_OLLAMA_PORT=11434`

### Code Configuration
The `ollama.ts` utility automatically uses the LAN IP from environment variables:
- Endpoint: `http://10.60.149.114:11434/api/generate`
- Includes logging for debugging connectivity issues

## Network Requirements
- Both devices (computer running Ollama and mobile device) must be on the same WiFi network
- Computer's firewall must allow inbound connections on port 11434
- Ollama must be started with `OLLAMA_HOST=0.0.0.0` for network binding

## Troubleshooting

### Connection Refused
- Ensure Ollama is running with network binding
- Check if firewall allows port 11434
- Verify both devices are on same network

### Model Not Found
- Ensure llama3 model is installed: `ollama pull llama3`
- Check available models: `ollama list`

### Performance Issues
- Server runs in low VRAM mode (CPU-only) 
- Consider upgrading to compatible GPU for better performance
- Current setup: 15.3 GiB total RAM, 3.1 GiB available

## Current Status
✅ Ollama server configured for network access  
✅ Environment variables updated  
✅ Connectivity tested successfully  
✅ llama3 model available and accessible  

## Usage in App
The app automatically uses the configured LAN IP for Ollama connections. No additional changes needed in the mobile app code.