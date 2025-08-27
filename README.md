# Zeno App

A modern, secure study group management platform built with Next.js, featuring user authentication, group management, and progressive web app capabilities.

## 📋 Project Overview

**Zeno App** is a Next.js-based web application designed to provide a modern, scalable, and secure platform for managing study groups. The application offers a responsive user interface with comprehensive features for user authentication, profile management, and group collaboration.

### Core Problems Addressed
- **Study Group Discovery**: Easy-to-use platform for finding and joining study groups
- **Group Management**: Comprehensive tools for creating and managing study groups
- **Secure Authentication**: Robust user authentication with security best practices
- **Offline Access**: PWA features enable offline functionality
- **Cross-Platform**: Responsive design works on desktop and mobile devices

## 🚀 Key Features

### 🔐 Authentication System
- User registration and login
- Password reset functionality
- Email validation and uniqueness checking
- Protected routes and session management
- Rate limiting for security

### 👥 Group Management
- Create and discover study groups
- Join and leave groups
- Group member management
- Detailed group information and scheduling
- Tag-based categorization

### 👤 User Profiles
- Comprehensive user profiles
- Social contact management
- Course and year level tracking
- Avatar and bio customization

### 🛡️ Security Features
- CSRF protection
- Input sanitization
- Rate limiting
- Row Level Security (RLS)
- Secure database functions
- Leaked password protection

### 📱 Progressive Web App
- Offline functionality
- Install prompt for mobile/desktop
- Custom service worker
- Responsive design

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.x
- **Runtime**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Utilities**: clsx, class-variance-authority, tailwindcss-animate

### Backend & Integration
- **Backend**: Supabase (Authentication & Database)
- **Database**: PostgreSQL with Row Level Security
- **API**: Next.js API Routes
- **PWA**: next-pwa v5.6.0 with Workbox

### Additional Libraries
- **Date Handling**: date-fns v4.1.0
- **Validation**: Custom validation hooks
- **Security**: CSRF protection, rate limiting

## 🏗️ Project Structure

```
zeno-app/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/               # API endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/            # Authentication pages
│   │   ├── groups/           # Group-related pages
│   │   └── ...
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── Navbar.tsx       # Navigation component
│   │   ├── GroupCard.tsx    # Group display component
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useEmailValidation.ts
│   │   ├── useCSRFToken.ts
│   │   └── ...
│   └── lib/                 # Utility functions and configurations
│       ├── auth.tsx         # Authentication logic
│       ├── database.ts      # Database operations
│       ├── security.ts      # Security utilities
│       └── supabase.ts      # Supabase client
├── public/                  # Static assets
│   ├── icons/              # App icons
│   ├── manifest.json       # PWA manifest
│   └── sw-custom.js        # Custom service worker
└── database files/          # Database schema and migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zeno-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Run the database schema in your Supabase SQL Editor:
   ```bash
   # Use the secure schema file
   # Copy contents of database_schema_secure.sql to Supabase SQL Editor
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Auto-reload**
   
   The page auto-updates as you edit files. Start by modifying `src/app/page.tsx`.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🔧 Configuration

### Supabase Setup

1. **Authentication Settings**
   - Enable email authentication
   - Set OTP expiry to 1800 seconds (30 minutes)
   - Enable leaked password protection

2. **Database Configuration**
   - Enable Row Level Security
   - Use the provided secure schema
   - Set up proper policies for data access

### PWA Configuration

The app includes PWA configuration with:
- Custom service worker (`public/sw-custom.js`)
- Web app manifest (`public/manifest.json`)
- Install prompt component
- Offline page functionality

## 🛡️ Security Highlights

### Database Security
- **Row Level Security (RLS)**: Comprehensive policies for data access control
- **Secure Functions**: All database functions use explicit search paths
- **Input Sanitization**: Protection against XSS and injection attacks

### Authentication Security
- **Rate Limiting**: Protection against brute force attacks
- **CSRF Protection**: Token-based protection for forms
- **Email Validation**: Server-side email uniqueness checking
- **Password Security**: Integration with HaveIBeenPwned.org

### Application Security
- **Protected Routes**: Authentication-required pages
- **Secure Defaults**: Security-first configuration
- **Type Safety**: TypeScript for compile-time safety

## 📖 API Reference

### API Endpoints

- `GET/POST /api/check-email` - Email uniqueness validation

### Database Functions

- `handle_new_user()` - Handles new user registration
- `handle_updated_at()` - Updates timestamp columns
- `get_user_profile()` - Secure profile retrieval

## 🚀 Deployment

### Vercel (Recommended)

The easiest deployment option:

1. Connect your repository to [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app supports any Node.js hosting platform:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🔍 Troubleshooting

### Common Issues

**Connection Errors**
- Verify Supabase environment variables
- Check Supabase project status
- Ensure network connectivity

**Build Errors**
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check TypeScript errors

**Authentication Issues**
- Verify Supabase auth configuration
- Check rate limiting settings
- Ensure email provider is configured

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- Real-time chat functionality
- Calendar integration
- Advanced search and filtering
- Mobile app development
- Analytics dashboard
- Notification system
