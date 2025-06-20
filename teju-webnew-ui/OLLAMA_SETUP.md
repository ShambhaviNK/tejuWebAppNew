# Ollama Setup Guide

This project now supports using Ollama locally instead of OpenAI API. Here's how to set it up:

## Prerequisites

1. **Install Ollama**: Download and install Ollama from [https://ollama.ai](https://ollama.ai)

2. **Pull a Model**: After installing Ollama, pull a model. We recommend Llama 3.2:
   ```bash
   ollama pull llama3.2
   ```

   Or for a smaller, faster model:
   ```bash
   ollama pull llama3.2:3b
   ```

## Configuration

Create a `.env.local` file in the project root with the following content:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Available Models

You can use any of these models by changing the `OLLAMA_MODEL` in your `.env.local`:

- `llama3.2` (default, 8B parameters)
- `llama3.2:3b` (3B parameters, faster)
- `llama3.2:7b` (7B parameters)
- `llama3.2:13b` (13B parameters, better quality)
- `llama3.2:70b` (70B parameters, best quality but slower)

## Running the Project

1. **Start Ollama**: Make sure Ollama is running:
   ```bash
   ollama serve
   ```

2. **Start the Next.js app**:
   ```bash
   npm run dev
   ```

3. **Test the application**: Open [http://localhost:3000](http://localhost:3000)

## Benefits of Using Ollama

- **No API Costs**: Run completely locally without any API charges
- **Privacy**: All data stays on your machine
- **Offline**: Works without internet connection
- **Customizable**: You can fine-tune models or use different ones
- **Fast**: No network latency for API calls

## Troubleshooting

1. **Ollama not running**: Make sure Ollama is started with `ollama serve`
2. **Model not found**: Pull the model first with `ollama pull <model-name>`
3. **Slow responses**: Try a smaller model like `llama3.2:3b`
4. **Memory issues**: Close other applications or use a smaller model

## Switching Back to OpenAI

If you want to use OpenAI instead, simply change the API endpoint in `MainInterface.tsx`:
```typescript
const res = await fetch("/api/generate-options", {  // Change back to OpenAI route
```

And set your OpenAI API key in `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
``` 