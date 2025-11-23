# 🌐 Web/Desktop App

This is the **web/desktop version** - 100% separate from the mobile app.

## 🎯 What's This?

Your web/desktop app is a standard React + TypeScript + Tailwind application that:
- ✅ Runs in web browsers on desktop and laptop computers
- ✅ Can be deployed to any hosting platform (Vercel, Netlify, etc.)
- ✅ Uses responsive design for different screen sizes
- ✅ Works on all modern browsers

## 📁 File Structure

```
src/
├── components/    → Reusable UI components
├── pages/         → Web application pages
├── lib/           → Utility functions
├── integrations/  → Third-party integrations (Supabase, etc.)
├── App.tsx        → Root component
├── main.tsx       → Application entry point
└── index.css      → Global styles
```

**IMPORTANT:** Web files are completely separate from mobile files!

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Open http://localhost:8080 in your browser.

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 🌐 Live Deployment

Your app is automatically deployed and live at:
```
https://307fc9ab-5a91-4317-8386-c524ccfc0903.lovableproject.com
```

Changes you make in UR-DEV are automatically deployed!

## 🔧 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Supabase** - Backend and database (via Lovable Cloud)

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎨 Styling

This project uses Tailwind CSS. Global styles are in `src/index.css`.

Design tokens and theme configuration are in:
- `src/index.css` - CSS variables and design tokens
- `tailwind.config.ts` - Tailwind configuration

## 🔌 Backend Integration

Backend services are provided by Lovable Cloud (Supabase):
- **Database**: PostgreSQL database
- **Authentication**: User auth with email/OAuth
- **Storage**: File uploads and storage
- **Edge Functions**: Serverless functions

Access via:
```typescript
import { supabase } from "@/integrations/supabase/client";
```

## 🚢 Deployment Options

### Lovable Hosting (Default)
- Automatic deployment on every change
- Free SSL certificate
- Global CDN
- Custom domain support

### Self-Hosting
1. Export to GitHub
2. Connect to your preferred hosting:
   - Vercel: Import GitHub repo
   - Netlify: Import GitHub repo
   - Custom: Deploy `dist/` folder

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [UR-DEV Docs](https://docs.lovable.dev)

## 🆘 Need Help?

If you run into issues:
1. Check the browser console for errors
2. Review the documentation links above
3. Ask UR-DEV AI for help with specific issues

---

**Built with ❤️ using UR-DEV AI Builder**
