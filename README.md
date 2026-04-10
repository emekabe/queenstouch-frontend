# Queenstouch — Modern Career Tools Platform (Frontend)

✨ **Empowering Professionals with AI-Generated Career Assets.**

Queenstouch is a sleek, modern web application designed to help job seekers build high-impact CVs, Cover Letters, and LinkedIn profiles using the power of Google Gemini AI.

---

## 🚀 Features

### 📄 Smart CV Builder
- **Multi-step Interactive Form**: Seamlessly navigate through personal info, experience, education, and skills.
- **AI Summary Generator**: Draft a professional summary in seconds based on your target role.
- **AI Achievement Builder**: Transform basic tasks into high-impact achievements using the XYZ formula.
- **AI CV Scoring**: Get real-time feedback on your CV strength and impact.
- **Job Match Analysis**: Compare your CV against a job description to see percentage match and keyword gaps.

### ✉️ AI Cover Letter Generator
- Generate tailored cover letters for specific job roles and companies.
- Tone and style adjustments to match the company culture.

### 🔗 LinkedIn Profile Optimizer
- AI-generated headlines and "About" sections to boost your profile's searchability.

### 💎 Premium Services
- System for requesting human-expert career coaching and premium CV writing services.

### 🛠 Admin Dashboard
- Comprehensive management of users, orders, and platform configurations.
- Real-time statistics and service request tracking.

---

## 💻 Tech Stack

- **Framework**: [Angular 19+](https://angular.dev/) (Modern Standalone Components)
- **Logic**: TypeScript
- **Styling**: Vanilla CSS (Modern design system with HSL variables)
- **State Management**: Reactive RxJS streams
- **Testing**: [Vitest](https://vitest.dev/) (Fast unit and integration testing)
- **Environment**: ESM & Vite-driven build process

---

## 🛠 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/queenstouch-frontend.git
    cd queenstouch-frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Development Server

Run the development server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

## 📂 Project Structure

```bash
src/app/
├── core/                # Core services, guards, and interceptors
│   ├── guards/          # AuthGuard, AdminGuard
│   ├── interceptors/    # Token handling
│   └── services/        # API communication (CvService, AuthService, etc.)
├── features/            # Feature-based lazy-loaded modules
│   ├── auth/            # Login, Sign-up, Password Recovery
│   ├── cv/              # CV Builder & List management
│   ├── cover-letter/    # AI Cover Letter engine
│   ├── dashboard/       # User landing area
│   └── admin/           # Platform management tools
├── shared/              # Reusable UI components
│   ├── components/      # Navbar, Toast, Spinner, ScoreRing
│   └── pipes/           # Formatting utilities
└── app.css              # Global design system & variable definitions
```

---

## 🧪 Testing

Execute unit tests using Vitest:
```bash
npm test
```

---

## 🎨 Design System

The project uses a custom design system defined in `src/app/app.css`, using HSL color tokens for:
- `--qt-navy`: Deep corporate blue
- `--qt-orange`: Vibrant action color
- `--qt-bg-secondary`: Soft interface backgrounds
- Glassmorphism effects and smooth transitions across all interactive elements.

---

## 📝 License

This project is open-source and free for anyone to contribute to. We welcome community contributions to help improve the platform for job seekers everywhere!
