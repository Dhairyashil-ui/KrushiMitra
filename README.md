# KrushiMitra - AI-Powered Farming Assistant

KrushiMitra (meaning "Farmers' Friend" in Hindi) is an AI-powered mobile application designed to empower farmers with intelligent agricultural assistance. The app provides personalized advice on crop care, pest management, weather updates, market prices, and government schemes in multiple Indian languages.

## Features

### Multilingual Support
- English
- Hindi
- Malayalam
- Marathi

### Core Functionalities
1. **AI Chat Assistant** - Conversational AI for farming queries
2. **Crop Disease Detection** - Image-based disease identification
3. **Activity Tracking** - Log farming activities and get AI insights
4. **Mandi Prices** - Real-time market price information
5. **Government Schemes** - Information on subsidies and benefits
6. **Farming News** - Latest agricultural updates
7. **Community Forum** - Connect with other farmers
8. **Events Calendar** - Workshops and webinars

## Technology Stack

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Native UI components

### Backend
- Node.js with Express
- MongoDB for data storage
- ElevenLabs API for text-to-speech
- LLaMA 3 for AI assistance

### AI/ML Services
- Computer Vision for crop disease detection
- Natural Language Processing for chat
- Multilingual support with translation capabilities

## Farmer-Friendly AI Implementation

The application uses a specially trained LLaMA 3 model that provides:
- Simple language explanations
- Culturally relevant advice
- Practical, actionable recommendations
- Support for small-scale farming practices

### Training Approach
1. **Persona-based prompting** - The AI adopts a friendly farming expert persona
2. **Context-aware responses** - Personalized advice based on farmer profile
3. **Language-specific guidelines** - Culturally appropriate communication
4. **Practical focus** - Emphasis on low-cost, implementable solutions

For detailed information on training the AI to be farmer-friendly, see [FARMER_FRIENDLY_AI_TRAINING.md](FARMER_FRIENDLY_AI_TRAINING.md).

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance
- ElevenLabs API key
- Expo CLI for mobile development
- Ollama with llama3 model

### Backend Setup
```bash
cd backend
npm install
# Set environment variables
# Start the server
npm start
```

### Mobile App Setup
```bash
npm install
# For development
npx expo start
```

## Troubleshooting

If you encounter any issues during setup or runtime, please refer to our [Troubleshooting Guide](TROUBLESHOOTING.md) for common solutions to connectivity and configuration problems.

## API Documentation

The backend provides RESTful APIs for all functionalities:
- Authentication and user management
- Activity tracking
- Market price information
- AI chat interface
- Text-to-speech services

Detailed API documentation can be found in [backend/API_CONTRACT.md](backend/API_CONTRACT.md).

## Contributing

We welcome contributions from the community. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For support or queries, please contact the development team at [support@krushimitra.com](mailto:support@krushimitra.com).