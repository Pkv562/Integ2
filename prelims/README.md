# Pet Management System

A modern, responsive pet and user management system built with Next.js, featuring a beautiful dark theme with glassmorphism effects and purple accents.

## Features

- **Dark Theme**: Professional black/deep gray background with white/light gray text
- **Glassmorphism Effects**: Semi-transparent blurry overlays for a modern look
- **Purple Accents**: Vibrant purple highlights (#A020F0, #9B51E0) for buttons, icons, and borders
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Typography**: Inter and Poppins fonts with proper weight hierarchy
- **User Management**: Complete CRUD operations for user accounts
- **Pet Management**: Complete CRUD operations for pet profiles
- **Dashboard**: Overview with statistics and recent activity

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with dark theme
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication pages
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── dashboard/         # Dashboard pages
│       ├── page.tsx       # Main dashboard
│       ├── users/
│       │   └── page.tsx   # Users management
│       └── pets/
│           └── page.tsx   # Pets management
├── components/            # Reusable components
│   ├── Layout/           # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── Users/            # User-related components
│   │   ├── UserTable.tsx
│   │   └── UserForm.tsx
│   ├── Pets/             # Pet-related components
│   │   ├── PetTable.tsx
│   │   └── PetForm.tsx
│   └── UI/               # UI components
│       ├── LoadingSpinner.tsx
│       └── EmptyState.tsx
└── types/                # TypeScript type definitions
    └── index.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- **Landing Page** (`/`): Welcome page with features overview
- **Login** (`/login`): User authentication
- **Sign Up** (`/signup`): User registration
- **Dashboard** (`/dashboard`): Main dashboard with statistics
- **Users** (`/dashboard/users`): User management with CRUD operations
- **Pets** (`/dashboard/pets`): Pet management with CRUD operations

## Design System

### Colors
- **Primary Background**: #000000 (black)
- **Secondary Background**: #121212 (deep gray)
- **Glass Background**: rgba(255, 255, 255, 0.05)
- **Text Primary**: #ffffff (white)
- **Text Secondary**: #e0e0e0 (light gray)
- **Text Muted**: #a0a0a0 (muted gray)
- **Accent Primary**: #A020F0 (vibrant purple)
- **Accent Secondary**: #9B51E0 (purple)

### Typography
- **Headings**: Poppins font family
- **Body Text**: Inter font family
- **Font Weights**: 300-900 range

### Components
- **Glassmorphism**: Semi-transparent backgrounds with blur effects
- **Rounded Corners**: 10-20px border radius
- **Shadows**: Subtle glows on purple elements
- **Responsive**: Mobile-first design approach

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Glassmorphism effects and animations

## Backend Integration

This frontend is ready for backend integration. The components include:
- Mock data for demonstration
- Form validation
- Loading states
- Error handling
- TypeScript interfaces for API responses

Replace the mock data and setTimeout calls with actual API calls to your backend service.

## License

This project is private and proprietary.