# AI-Powered Chess App

Ready to revolutionize your chess game? Castle.ai brings the power of artificial intelligence to your fingertips

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Demo

🚀 [Live Demo](https://castle-ai.vercel.app/)

## Features

- **🤖 Play vs AI**

  Challenge our dynamic AI opponent that adapts to your style! Whether you're a beginner looking for friendly matches or an experienced player seeking tough competition, our AI offers multiple difficulty levels and even mimics the playing styles of chess legends. Watch as it thinks in real-time and responds to your moves with tactical brilliance!

- **📚 Learn a wide array of 11,493 Openings**

  Transform your opening game with our interactive AI tutor! Step-by-step, our AI guides you through classic openings, explaining each move's purpose in simple terms. Get instant feedback, strategic insights, and helpful tips while the AI demonstrates responses. It's like having a grandmaster coach in your pocket!

- **🧩 Brainstorm solutions for Chess Puzzles**

  Sharpen your tactical vision with our curated puzzle collection! Each puzzle comes with AI-powered hints that guide you towards the solution without spoiling the "aha!" moment. Get encouraging feedback on your moves and watch as the AI explains the brilliant tactics hiding in each position.

All wrapped in a sleek, modern interface with:

- Real-time move analysis
- Dynamic board animations
- Light/Dark themes
- Seamless user experience
- Friendly chat-style interactions

Castle.ai combines the ancient art of chess with cutting-edge AI to create a learning experience that's both fun and powerful. Whether you're taking your first steps in chess or aiming to improve your game, Castle.ai is your perfect companion on the journey to chess mastery! ♟️✨

## Tech Stack

- **Frontend**

  - Nextjs 15
  - Tailwind CSS
  - ShadCN UI
  - Framer Motion

- **Backend**

  - MongoDB Atlas
  - OpenAI GPT-4 API

- **Authentication**
  - JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key
- Git

### Installation

1. **Clone the repository**

```bash
git clone
cd
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:

```env
MONGO_URI=
MONGO_DB=castleAI
OPENAI_API_KEY=
JWT_SECRET=

```

4. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## Usage

1. **Registration & Login**

   - Create a new account or sign in
   - Complete the financial profile setup

2. **Dashboard Navigation**

   - View financial snapshot
   - Set and track goals
   - Access AI chat assistant

3. **AI Interaction**
   - Ask financial questions
   - Receive personalized advice
   - Review recommended strategies

## API Reference

| Endpoint                  | Method              | Description                |
| ------------------------- | ------------------- | -------------------------- |
| `/api/auth/register`      | POST                | Create new user account    |
| `/api/auth/login`         | POST                | Authenticate existing user |
| `/api/financial-snapshot` | GET/PUT             | Manage financial data      |
| `/api/financial-advice`   | POST                | Get AI-powered advice      |
| `/api/goals`              | GET/POST/PUT/DELETE | Manage financial goals     |
| `/api/chat`               | POST                | Interact with AI assistant |

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 API access
- Chakra UI team for the component library
- All our contributors and supporters

## Contact

- GitHub Issues: [Report a bug](https://github.com/0xmetaschool/ai-finance-advisor/issues)
- Email: support@financeguru.com
- Twitter: [@FinanceGuru](https://twitter.com/FinanceGuru)
