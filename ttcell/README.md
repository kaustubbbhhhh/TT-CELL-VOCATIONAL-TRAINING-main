# TT Cell Vocational Training Management Portal
### Army Base Workshop — Enterprise-Grade React Application

---

## Overview

A production-ready, enterprise-grade portal for managing vocational training programs at Army Base Workshop TT Cell. Built with React.js, Material UI v5, and React Router v6.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React.js 19 |
| UI Library | Material UI (MUI) v5 |
| Routing | React Router DOM v6 |
| Styling | MUI sx prop + Emotion |
| State | React Context API |
| Build | Create React App |

---

## Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Start development server
```
npm start
```
Opens at http://localhost:3000

### 3. Build for production
```
npm run build
```

---

## Login (Demo)

Select your role on the Login page:

| Role | Redirects To |
|------|-------------|
| Admin | /admin — Full admin portal |
| Student | /student — Student portal (Rahul Verma, TT24-001) |
| Visitor | / — Public website |

Any username/password combination works for demo.

---

## Project Structure

```
src/
├── theme/theme.js                 # MUI design system (olive/steel/gold)
├── context/AuthContext.js         # Auth state + role management
├── data/mockData.js               # All mock data
├── components/
│   ├── UIComponents.js            # Shared components
│   └── Navigation.js              # PublicNav, PortalLayout, Sidebar
├── pages/
│   ├── public/                    # Home, About, Domains, Contact
│   ├── auth/                      # Login, ForgotPassword
│   ├── admin/                     # All admin pages
│   └── student/                   # All student pages
└── App.js                         # Root with all routes
```

---

## Pages & Routes

### Public: /, /about, /domains, /contact
### Auth: /login, /forgot-password
### Admin: /admin, /admin/students, /admin/projects, /admin/attendance, /admin/announcements, /admin/analytics, /admin/reports, /admin/repository, /admin/settings
### Student: /student, /student/profile, /student/attendance, /student/projects, /student/announcements

---

## Design System

Colors:
- Military Olive (Primary): #4A6331
- Steel Navy: #1A2332
- Gold (Accent): #B8960C
- Danger Red: #C0392B

Font: Inter (Google Fonts), weights 400-800
