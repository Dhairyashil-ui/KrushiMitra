# Voice Assistant Implementation

This document explains the voice assistant implementation in the KrushiAI application.

## Features

1. **Speech-to-Text**: Uses Web Speech API to convert user voice to text
2. **AI Processing**: Integrates with Google Gemini API for intelligent responses
3. **Text-to-Speech**: Uses SpeechSynthesis API to speak AI responses
4. **Visual Feedback**: Animated UI elements showing listening/speaking states

## Implementation Details

### Technologies Used

- **Web Speech API**: For speech recognition (speech-to-text)
- **Google Generative AI (Gemini)**: For natural language processing
- **SpeechSynthesis API**: For speech output (text-to-speech)
- **React Native with Expo**: For cross-platform mobile application

### Key Components

1. **Voice Recognition**:
   - Uses `webkitSpeechRecognition` for browser compatibility
   - Handles continuous listening with automatic restart
   - Provides visual feedback when listening

2. **AI Integration**:
   - Connects to Google Gemini API using `@google/generative-ai` package
   - Sends user queries to Gemini for processing
   - Receives contextual farming advice

3. **Speech Synthesis**:
   - Uses `speechSynthesis` API to convert text responses to speech
   - Automatically starts listening after speaking completes
   - Handles speech errors gracefully

### How It Works

1. When the home page loads, the voice assistant automatically starts listening
2. User speaks a question or command
3. Web Speech API converts speech to text
4. Text is sent to Google Gemini API for processing
5. Gemini generates a relevant farming-related response
6. Response is spoken aloud using SpeechSynthesis API
7. Voice assistant automatically starts listening again

### UI Elements

- **Pulsing Circle**: Main voice assistant interface with animated glow effects
- **Microphone Icon**: Shows current state (listening/speaking)
- **Status Text**: Displays "Listening...", "Speaking...", or "Neural Interface Active"
- **Orbital Animation**: Futuristic visual elements around the main circle

### Platform Support

- Currently only available on web platform due to browser API limitations
- Falls back gracefully on mobile platforms with appropriate messages

## Setup Instructions

1. Ensure you have a Google Gemini API key
2. Add the API key to your environment variables:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
3. The voice assistant will automatically start when the home page loads

## Usage

1. Allow microphone permissions when prompted
2. Speak naturally when the circle shows "Listening..."
3. The assistant will respond with farming-related advice
4. The conversation continues automatically

## Error Handling

- Handles speech recognition errors gracefully
- Provides fallback responses when AI is unavailable
- Shows user-friendly error messages
- Continues functioning even after errors

## Customization

The voice assistant can be customized by modifying:
- Prompt templates in `handleVoiceInput` function
- Voice settings in `speakResponse` function
- UI animations and visual elements
- Response handling logic