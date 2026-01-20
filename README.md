# LMS Frontend

A Laboratory Management System (LMS) for Pathology Lab frontend built with React, TypeScript, Vite, and Tailwind CSS.

## 📦 Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/sauravsaran99/LMS-frontend.git
cd LMS-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file in root directory:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

### 4. Start Development Server

```bash
npm run dev
```

The app will run at `http://localhost:5173/`

## 📝 Available Commands

| Command           | Purpose                  |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Preview production build |
| `npm run lint`    | Check code quality       |

## 📁 Project Structure

```
src/
├── api/              # API calls & axios config
├── auth/             # Authentication components
├── components/       # Reusable components
├── context/          # Context API state management
├── layout/           # Layout components
├── pages/            # Page components
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **ApexCharts** - Charts & graphs

## ✨ Features

✅ User Authentication  
✅ Booking Management  
✅ Customer Management  
✅ Payment Processing  
✅ Analytics Dashboard  
✅ Calendar & Scheduling  
✅ Real-time Notifications

## 🐛 Troubleshooting

**Port already in use?**

```bash
npm run dev -- --port 3000
```

**Clear cache and reinstall:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**

```bash
npm run lint
npm run build
```

## 📄 License

See [LICENSE.md](LICENSE.md) for details.

---

**Ready to code? Start with `npm run dev` 🚀**
