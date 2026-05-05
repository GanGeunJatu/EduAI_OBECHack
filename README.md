# EduAI Webapp

A full-stack educational AI platform for Thai high school students.

## Setup

1. Get an OpenAI API key from https://platform.openai.com/api-keys (free tier available with $5 credit)

2. In `backend/.env`, replace `your_openai_api_key_here` with your actual API key.

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## Features

- AI-powered chat for learning assistance
- Dynamic quiz generation based on subject and topic
- Educational content generation
- Multi-language support (English/Thai)
- Responsive design

## API Endpoints

- `POST /api/chat` - Chat with AI
- `POST /api/generate-quiz` - Generate quiz questions
- `POST /api/generate-content` - Generate educational content