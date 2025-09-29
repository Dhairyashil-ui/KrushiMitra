// Voice configuration for 11labs TTS
// This file centralizes voice settings for the entire app

export interface Voice {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: 'male' | 'female';
}

export const AVAILABLE_VOICES: Record<string, Voice> = {
  niraj: {
    id: 'niraj',
    name: 'Niraj - Hindi Narrator',
    description: 'Professional Hindi male voice, ideal for farming instructions',
    language: 'hi',
    gender: 'male'
  },
  monika: {
    id: 'monika',
    name: 'Monika Sogam - Hindi Modulated',
    description: 'Clear and warm Hindi female voice, great for conversations',
    language: 'hi',
    gender: 'female'
  },
  bella: {
    id: 'bella',
    name: 'Bella - English',
    description: 'Default English voice, fallback option',
    language: 'en',
    gender: 'female'
  }
};

// Default voice selection based on language and context
export const getDefaultVoice = (language: string = 'hi', context: 'chat' | 'orb' | 'welcome' = 'chat'): string => {
  switch (language) {
    case 'hi':
      // Use Niraj for farming instructions and male contexts
      // Use Monika for conversations and female contexts
      return context === 'orb' ? 'niraj' : 'monika';
    case 'mr':
    case 'ml':
      return 'monika'; // Monika works well for other Indian languages
    default:
      return 'bella'; // Fallback for English
  }
};

// Generate TTS URL with proper voice selection
export const generateTTSUrl = (
  baseUrl: string,
  text: string,
  language: string = 'hi',
  context: 'chat' | 'orb' | 'welcome' = 'chat',
  customVoice?: string
): string => {
  const voice = customVoice || getDefaultVoice(language, context);
  return `${baseUrl}/tts?lang=${language}&voice=${voice}&text=${encodeURIComponent(text)}`;
};

// Voice utility functions for components
export const VoiceUtils = {
  // Get voice for AI chat responses
  getChatVoice: (language: string = 'hi') => getDefaultVoice(language, 'chat'),
  
  // Get voice for voice orb
  getOrbVoice: (language: string = 'hi') => getDefaultVoice(language, 'orb'),
  
  // Get voice for welcome messages
  getWelcomeVoice: (language: string = 'hi') => getDefaultVoice(language, 'welcome'),
  
  // Generate TTS URL for AI chat
  getChatTTSUrl: (baseUrl: string, text: string, language: string = 'hi') => 
    generateTTSUrl(baseUrl, text, language, 'chat'),
  
  // Generate TTS URL for voice orb
  getOrbTTSUrl: (baseUrl: string, text: string, language: string = 'hi') => 
    generateTTSUrl(baseUrl, text, language, 'orb'),
  
  // Generate TTS URL for welcome messages
  getWelcomeTTSUrl: (baseUrl: string, text: string, language: string = 'hi') => 
    generateTTSUrl(baseUrl, text, language, 'welcome'),
};