# Sequential Voice Processing Implementation Guide

**Updated: Enhanced State Management and Complete Response Cycle Control**

This guide has been updated with additional improvements to ensure:
1. Speech recognition is completely stopped during AI speaking periods
2. State management is properly handled throughout the entire response cycle
3. No premature state changes occur during LLM processing or TTS playback

## Overview
This document explains the enhanced sequential voice processing system that ensures only one voice interaction is processed at a time, preventing interruptions and ensuring smooth user experience.

## Key Features

### 1. **Complete Response Cycle Blocking**
- Once valid speech is recognized, the system blocks ALL new voice inputs
- Processing continues through: Speech Recognition → LLM Processing → TTS Playback → Completion
- No new voice input accepted until the entire cycle completes

### 2. **Enhanced State Management**
- `isProcessing`: Blocks new inputs during LLM processing and TTS playback
- `isSpeaking`: Indicates TTS is actively playing audio
- Both flags must be `false` for new voice input to be accepted

### 3. **Robust Speech Validation**
- Filters out noise, repeated characters, low-confidence speech
- Only passes validated speech to LLM processing
- Automatically restarts listening after rejecting invalid input

### 4. **Enhanced Speech Recognition Control**
- Completely stops speech recognition during AI speaking periods
- Uses `abort()` method for immediate recognition termination
- Prevents audio capture during response playback
- Blocks automatic restarts when system is busy

## Processing Flow

```
Step 1: Voice Input Received
├── Check if system is busy (isSpeaking || isProcessing)
├── If busy → Ignore input and log reason
└── If available → Validate speech input

Step 2: Speech Validation
├── Check for noise patterns, length, confidence
├── If invalid → Restart listening after 1 second
└── If valid → Begin processing

Step 3: LLM Processing (isProcessing = true)
├── Stop listening to prevent interruptions
├── Send validated input to Ollama LLM
├── Stream complete response
└── Prepare for TTS

Step 4: TTS Playback (isSpeaking = true, isProcessing = true)
├── Play response using ONLY Niraj Hindi voice
├── Block ALL new voice inputs during playback
├── Monitor playback completion
└── Release locks when finished

Step 5: Completion & Auto-restart
├── Set isProcessing = false
├── Set isSpeaking = false
├── Auto-restart listening for next input
└── Ready for new voice interaction
```

## Key Improvements

### Sequential Processing Guarantees
```typescript
// Before processing any voice input
if (isSpeaking || isProcessing) {
  console.log('Voice input ignored - system busy');
  return;
}

// Block new inputs during entire response cycle
setIsProcessing(true);
stopListening();
```

### TTS Completion Handling
```typescript
sound.setOnPlaybackStatusUpdate((status) => {
  if (status.didJustFinish) {
    // Release all locks only after TTS completes
    setIsSpeaking(false);
    setIsProcessing(false);
    
    // Auto-restart listening for next input
    if (autoStartListening) {
      setTimeout(() => {
        if (!isSpeaking && !isProcessing) {
          startListening();
        }
      }, 1000);
    }
  }
});
```

### Validation-First Approach
```typescript
const isValidSpeechInput = (text: string, confidence?: number): boolean => {
  // Comprehensive validation prevents invalid inputs from reaching LLM
  if (!text || text.trim().length < 2) return false;
  
  // Pattern validation for noise, repeated chars, etc.
  const normalized = text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const hasRepeatedChars = /(..)\1{2,}/.test(normalized);
  const isVowelsOnly = /^[aeiou\s]+$/i.test(normalized);
  
  if (hasRepeatedChars || isVowelsOnly) return false;
  
  // Confidence threshold
  if (confidence && confidence < 0.5) return false;
  
  return true;
};
```

## Voice Recognition States

### State Combinations and Behaviors
| isSpeaking | isProcessing | Behavior |
|------------|--------------|----------|
| false | false | ✅ Ready to accept voice input |
| false | true | ❌ Processing LLM response, block input |
| true | false | ❌ TTS playing (shouldn't occur) |
| true | true | ❌ TTS playing, block all input |

### Error Handling
- Network errors during TTS: Release locks and auto-restart listening
- Speech recognition errors: Attempt gentle retry with delay
- Invalid speech: Immediate restart of listening

## Benefits

### User Experience
- **No Interruptions**: Users can't accidentally interrupt responses
- **Clear Feedback**: Visual and audio indicators show system state
- **Automatic Flow**: No manual restart needed between interactions
- **Reliable Processing**: Each input gets complete attention

### Technical Advantages
- **Race Condition Prevention**: Eliminates concurrent processing issues
- **Resource Management**: Ensures proper cleanup of audio resources
- **Error Recovery**: Robust handling of network and audio errors
- **State Consistency**: Clear state management prevents confusion

## Enhanced State Management

### Proper State Transitions
The system now implements improved state management to ensure proper transitions throughout the complete response cycle:

1. **Initial State**: `isProcessing = false`, `isSpeaking = false` (ready for input)
2. **Voice Input Received**: `isProcessing = true` (blocks new inputs)
3. **LLM Processing**: `isProcessing = true` (maintained throughout)
4. **TTS Playback**: `isSpeaking = true`, `isProcessing = true` (maintained)
5. **Completion**: Both flags set to `false` only after TTS finishes

### Technical Implementation
```typescript
// In handleVoiceInput function
const handleVoiceInput = async (text: string, confidence?: number) => {
  // Block concurrent voice inputs
  if (isSpeaking || isProcessing) return;
  
  // Validate input
  if (!isValidSpeechInput(text, confidence)) {
    // Restart listening after invalid input
    setTimeout(() => {
      if (!isSpeaking && !isProcessing) startListening();
    }, 1000);
    return;
  }
  
  // Set processing state for entire cycle
  setIsProcessing(true);
  stopListening();
  
  try {
    // LLM processing - isProcessing remains true
    for await (const chunk of queryOllamaStream(prompt, ollamaServerIp)) {
      finalResponse += chunk;
    }
    
    // TTS playback - isProcessing remains true until completion
    speakResponse(finalResponse.trim(), true);
    
    // Note: isProcessing is NOT set to false here
    // It will be set to false only when TTS completes in speakResponse
  } catch (error) {
    // Error handling - isProcessing will be released when TTS completes
    speakResponse(errorMessage, true);
  }
  
  // No finally block that prematurely releases isProcessing
};

// In speakResponse function
const speakResponse = async (text: string, autoStartListening: boolean = false) => {
  setIsSpeaking(true);
  // isProcessing should already be true from handleVoiceInput
  
  // ... TTS setup ...
  
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      // Release both flags only after TTS completes
      setIsSpeaking(false);
      setIsProcessing(false); // This is the ONLY place where isProcessing is set to false
      
      // Auto-restart listening
      if (autoStartListening) {
        setTimeout(() => {
          if (!isSpeaking && !isProcessing) startListening();
        }, 1000);
      }
    }
  });
};
```

## Enhanced Speech Recognition Control

### Complete Recognition Management
The system now implements comprehensive speech recognition control to prevent any audio capture during AI speaking periods:

1. **Immediate Recognition Stop**: When AI begins speaking, speech recognition is immediately stopped using the `abort()` method
2. **Double Protection**: Both result filtering and recognition stopping prevent input capture
3. **Error Handler Updates**: Automatic restarts are blocked when system is busy
4. **Explicit State Checking**: All entry points check `isSpeaking` and `isProcessing` states

### Technical Implementation
```typescript
// In speech recognition onresult handler
if (isSpeaking || isProcessing) {
  console.log('Voice input ignored - system busy');
  stopListening(); // Ensure recognition is completely stopped
  return;
}

// In error handlers
errorRestartTimeoutRef.current = setTimeout(() => {
  // Additional check before restarting
  if (Platform.OS === 'web' && !isSpeaking && !isProcessing) {
    startListening();
  }
}, 1500);

// In startListening function
const startListening = () => {
  // Ensure clean state before starting
  if (recognitionRef.current?.abort) {
    recognitionRef.current.abort();
  }
  
  if (isSpeaking || isProcessing) {
    console.warn('Voice capture disabled - system busy');
    return;
  }
  // ... rest of function
};
```

## Implementation Notes

### Critical Requirements
1. **ONLY Niraj Hindi Voice**: Exclusive use of 11labs Niraj voice (ID: 9BWtsMINqrJLrRacOk9x)
2. **No Fallbacks**: No device TTS or alternative voices
3. **Complete Cycles**: Each voice input must complete full processing cycle
4. **Validation First**: All speech must pass validation before LLM processing
5. **Complete Recognition Control**: Speech recognition completely stopped during AI speaking

### Configuration
- LAN IP for mobile connectivity: `10.60.149.114:3000`
- Ollama endpoint: `10.60.149.114:11434`
- Rate limiting: 10 requests per minute
- Auto-restart delay: 1 second after completion

## Testing Scenarios

### Normal Flow
1. Say valid input → See processing indicator
2. Wait for complete response → Hear Niraj voice
3. System auto-restarts → Ready for next input

### Error Handling
1. Say invalid input (noise) → System ignores and restarts
2. Try speaking during response → Input ignored, logged
3. Network error during TTS → System recovers and restarts

### Edge Cases
1. Multiple rapid inputs → Only first valid input processed
2. Very long responses → No timeout, complete playback required
3. User interruption attempts → All blocked until completion

## Monitoring and Debugging

### Key Log Messages
- `"Voice input ignored - system busy"`: Normal blocking behavior
- `"Valid speech recognized"`: Successful validation
- `"TTS completed - ready for next voice input"`: Cycle complete
- `"Auto-starting listening after TTS completion"`: Successful restart

### Performance Metrics
- Average response time: Voice Input → TTS Start
- TTS completion rate: Successful playback percentage
- Validation accuracy: Valid vs. invalid input ratio
- Error recovery time: Network error → System ready

This sequential processing system ensures reliable, interruption-free voice interactions while maintaining the exclusive use of the Niraj Hindi voice as requested.