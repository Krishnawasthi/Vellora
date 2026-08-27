# Vellora — Personal Stories & Digital Journal

> *“यहाँ मैं अपने विचार, कहानियाँ और अनुभव साझा करता हूँ”*  
> *A quiet, warm corner of the internet for stories, thoughts, memories, and moments worth keeping.*

---
## ☕ About Vellora

**Vellora** is a personal digital journal and publishing space built for writers who value quiet attention over algorithmic feeds, likes, or metric counters. 

In a digital landscape filled with pop-ups and notifications, **Vellora** is designed as a peaceful antidote. It allows only the site owner to craft, publish, and manage stories while giving public visitors a clean, ad-free, distraction-free reading experience without requiring any sign-up or authentication.

---

## ✨ Features

- **Single-Owner Publishing**: Exclusive owner access for creating, editing, publishing, drafting, and deleting stories.
- **Accountless Public Reading**: Visitors browse and read public stories with zero registration or email prompts.
- **Bilingual & Multi-Language Support**: Optimized for English, Hindi (हिंदी), and Hinglish literature.
- **Bespoke Typography & Devanagari Fonts**: Seamless integration of Google Fonts (*Georgia, Merriweather, Inter, Playfair Display, Noto Serif Devanagari, Mukta, Hind*).
- **Rich Media Story Editor**: Integrated Quill editor with full formatting options, quotes, headers, and instant image uploads.
- **Privacy Granularity**: 3-level visibility controls:
  - 🟢 `PUBLIC`: Visible to all public visitors
  - 🟡 `DRAFT`: Saved exclusively in owner workspace
  - 🔒 `PRIVATE`: Stored privately for owner's eyes only
- **Warm Editorial Color Palette**: Milk chocolate, dark espresso, and soft light cream aesthetic with a full-window Dark Mode transition.
- **Hidden Admin Portal**: Completely invisible sign-in entry points on public views for privacy and security.
- **Live Sitemap & SEO**: Auto-generated `/sitemap.xml` for indexation of public stories.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Cream & Chocolate Extensions
- **Rich Text Editor**: Quill (`react-quill`)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js (TypeScript)
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt Password Hashing
- **Image Uploads**: Multer Storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI

### 1. Clone Repository
```bash
git clone https://github.com/Krishnawasthi/Vellora.git
cd Vellora
```

### 2. Install Dependencies

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Build & Run Project

```bash
# Start Backend Express Server (Port 5000)
cd server
npm run dev

# Start Frontend Vite Server (Port 3000)
cd client
npm run dev
```

Visit the application at:
- **Public Reader View**: https://vellora-teal.vercel.app/
- **Owner Admin Login**: `http://localhost:3000/admin/login`

---

## 📜 License

Created with ❤️ by **Krishna Awasthi**. All rights reserved.
