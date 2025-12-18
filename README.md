# AI Website Builder

An intelligent web application that generates complete HTML websites based on natural language descriptions using AI agents. This project combines a React frontend with AI-powered backend services to create, preview, and deploy websites with minimal effort.

## 🌟 Features

- **AI-Powered Website Generation**: Describe your website needs in plain English and let AI agents create complete HTML websites
- **Real-time Progress Tracking**: Watch as AI agents work through multiple iterations to perfect your website
- **Instant Preview**: View generated websites instantly in an embedded preview panel
- **One-click Deployment**: Deploy websites to the public internet using Ngrok with a single click
- **GitHub Integration**: Push generated websites directly to GitHub repositories
- **Persistent Sessions**: Maintain chat history and user sessions across browser restarts
- **Responsive Design**: All generated websites are mobile-friendly and responsive

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-site-builder
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. In a separate terminal, start the hosting server:
```bash
npm run server
```

3. Open your browser and navigate to `http://localhost:8080` (or the port shown in the terminal)

## 🛠️ Architecture

### Frontend
- Built with React, TypeScript, and Vite
- Uses shadcn/ui components for a modern UI
- Implements real-time chat interface with streaming progress updates
- Features responsive design with Tailwind CSS

### Backend Services
- **AI Generation Service**: Communicates with AI agents to generate websites
- **Hosting Server**: Local Express server that serves websites and creates Ngrok tunnels
- **GitHub Integration**: Pushes websites to GitHub repositories

### Data Flow
1. User describes website requirements in chat
2. Frontend sends request to AI service
3. AI agents process request through multiple iterations
4. Progress updates are streamed back to frontend
5. Final HTML is extracted and displayed
6. User can preview, deploy, or save to GitHub

## 🔧 Usage Guide

### Generating a Website
1. Type your website requirements in the chat input (e.g., "Create a restaurant landing page with menu section")
2. Watch the progress as AI agents work on your request
3. View the generated website in the preview panel
4. Use the action buttons to:
   - Copy HTML code
   - View fullscreen preview
   - Host on Ngrok
   - Push to GitHub

### Hosting on Ngrok
1. Ensure the hosting server is running (`npm run server`)
2. Click "Host on Ngrok" on any generated website
3. Get a public URL to share your website

### Pushing to GitHub
1. Click "Push to GitHub" on any generated website
2. Enter a repository name
3. The website will be pushed as `index.html` to a new public repository

## 📁 Project Structure

```
ai-site-builder/
├── src/
│   ├── components/     # React components (chat, preview, sidebar)
│   ├── pages/          # Page components (Index, NotFound)
│   ├── lib/            # Utility functions and mock data
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main application component
├── server.js           # Backend hosting server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
NGROK_AUTHTOKEN=your_ngrok_auth_token  # Optional
```

### GitHub Integration
To enable GitHub integration:
1. Create a GitHub Personal Access Token with `repo` permissions
2. Add it to your `.env` file as `VITE_GITHUB_TOKEN`
3. Restart the development server

## 🔄 Development Workflow

1. **Development Server**: `npm run dev`
2. **Hosting Server**: `npm run server`
3. **Build for Production**: `npm run build`
4. **Lint Code**: `npm run lint`

## 🤖 AI Agent Process

The AI generation follows a multi-step process:
1. **Requirements Analysis**: Understand user requirements
2. **Code Generation**: Create initial HTML/CSS/JS implementation
3. **Code Review**: Quality assurance and optimization
4. **Iteration**: Repeat generation and review until satisfied
5. **Final Delivery**: Present polished website to user

## 📤 Deployment Options

### Local Development
- Frontend runs on `http://localhost:8080`
- Hosting server runs on `http://localhost:3003`

### Public Sharing
- Use Ngrok hosting for temporary public URLs
- Use GitHub integration for permanent repository storage

## 🔒 Security Notes

- GitHub tokens are stored in environment variables
- All API communications use secure protocols
- User data is stored locally in browser storage
- Ngrok tunnels can be secured with auth tokens

## 🐛 Troubleshooting

### Common Issues

1. **Ngrok Connection Failures**:
   - Check Ngrok auth token in environment variables
   - Ensure port 3003 is available
   - Restart the hosting server

2. **GitHub Integration Errors**:
   - Verify GitHub token permissions
   - Check repository name validity
   - Ensure internet connectivity

3. **AI Service Connection Issues**:
   - Confirm AI service endpoint is accessible
   - Check network connectivity
   - Verify request format

### Clearing Cache
- Clear browser localStorage if experiencing session issues
- Restart both frontend and backend servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to all AI services that power the website generation
- UI components powered by shadcn/ui
- Styling with Tailwind CSS
- Hosting capabilities through Ngrok