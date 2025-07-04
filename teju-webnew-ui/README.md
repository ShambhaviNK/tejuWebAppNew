# Teju Web - AI-Powered Communication Assistant

Teju Web is a Next.js application designed to assist communication with autistic individuals through speech recognition, text-to-speech, and AI-generated multiple-choice options.

## 🌟 Features

- **Speech Recognition**: Real-time speech-to-text with enhanced punctuation
- **Text-to-Speech**: Individual and batch reading of options
- **AI-Generated Options**: Context-aware multiple-choice responses using OpenAI GPT-4
- **User Authentication**: Secure sign-up and sign-in system with Supabase database
- **Responsive Design**: Mobile-friendly interface with accessibility features
- **Fullscreen Mode**: Immersive experience with toggle functionality
- **Image Context Support**: Enhanced AI responses based on uploaded images

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Supabase account (for user authentication)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd teju-webnew-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Set up Supabase Database**:
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) for detailed instructions
   - Create a `users` table with the required schema
   - Configure Row Level Security policies

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Setup

This application uses Supabase for user authentication and data storage. The database stores:

- **User accounts** (name, email, hashed password)
- **Session management** (for authentication)
- **User preferences** (future enhancement)

### Required Database Schema

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

For complete setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## 🏗️ Project Structure

```
teju-webnew-ui/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── generate-options/ # AI option generation
│   │   │   └── recognize-audio/  # Speech recognition
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main application
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── Auth/             # Authentication components
│   │   ├── Dashboard/        # Dashboard components
│   │   └── ui/               # UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.ts       # Supabase client
│   │   └── textProcessing.ts # Text processing utilities
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── .env.local               # Environment variables (create this)
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/generate-options` - Generate AI options
- `POST /api/recognize-audio` - Speech recognition

## 🎨 Features in Detail

### Speech Recognition
- Real-time audio processing
- Enhanced punctuation and formatting
- Support for multiple languages
- Error handling and retry mechanisms

### Text-to-Speech
- Individual option reading
- Batch reading of all options
- Adjustable speech rate and voice
- Cross-browser compatibility

### AI-Generated Options
- Context-aware responses
- Multiple-choice format
- Caching for performance
- Image context support

### User Authentication
- Secure password hashing with bcrypt
- JWT-based session management
- Protected routes
- Form validation and error handling

## 📱 Mobile Features

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **No Zoom**: Prevents accidental zooming on mobile devices
- **Fullscreen Support**: Immersive experience toggle

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Protection**: Configured for production
- **Environment Variables**: Secure API key storage

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add all required environment variables
3. **Deploy**: Vercel will automatically build and deploy your app

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Review the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Open an issue on GitHub

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the release notes
- Reviewing the changelog

---

**Built with ❤️ for the autism community**
