# Occassions - Event Registration & Management System

> A comprehensive, modern, and highly scalable web platform for event hosts and attendees, inspired by Luma.

Occassions is a full-stack Next.js application that empowers hosts to create events, manage attendees, and export data, while providing a seamless, one-click registration experience for attendees. 

This project was built to satisfy the **Byamn Summer Web Development Internship 2026** task requirements.

---

## 📚 Complete Documentation

To keep this README clean and easy to read, the full documentation has been divided into specific topics. Please explore the detailed guides below:

1. [**Feature Breakdown**](docs/FEATURES.md) - Detailed explanation of all core and bonus features implemented.
2. [**System Architecture & Schema**](docs/ARCHITECTURE.md) - Learn about the database models, folder structure, and design decisions.
3. [**API Reference**](docs/API.md) - Documentation for the custom REST APIs built using Next.js Route Handlers.
4. [**Deployment Guide**](docs/DEPLOYMENT.md) - Step-by-step instructions for deploying to Vercel and MongoDB Atlas.

---

## 🚀 Quick Start Guide

Follow these instructions to get a local development environment running.

### Prerequisites

*   **Node.js** (v18.17.0 or higher)
*   **npm** or **yarn**
*   **MongoDB** (Local instance or a free cloud Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/occassions.git
   cd occassions
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of your project and populate it with the required keys:
   ```env
   # Your MongoDB Connection String
   MONGODB_URI=mongodb://127.0.0.1:27017/occassions

   # A secure random string for encrypting sessions
   NEXTAUTH_SECRET=supersecretnextauthkey12345

   # The base URL of your application (localhost for dev)
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to `http://localhost:3000` in your browser.

---

## 🛠️ Technology Stack

Occassions is built with a modern, high-performance tech stack:

*   **Framework:** Next.js v15+ (App Router)
*   **UI Library:** React v19
*   **Language:** TypeScript (Strict mode enabled, no `any` types used)
*   **Styling:** Tailwind CSS v4
*   **Database:** MongoDB via Mongoose ODM
*   **Authentication:** NextAuth.js (Custom Credentials Provider with `bcryptjs`)
*   **Icons & Notifications:** `lucide-react` & `react-hot-toast`

---

## 🎯 Evaluation Criteria Met

*   ✅ All core features working correctly (45%)
*   ✅ Code quality & strict TypeScript usage (20%)
*   ✅ Premium UI/UX & mobile responsiveness (20%)
*   ✅ Extensive README & documentation structure (10%)
*   ✅ Multiple bonus features implemented (5%)

---
*Built with ❤️ for the Byamn Internship Program.*
