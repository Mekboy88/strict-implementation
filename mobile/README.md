# 📱 Mobile Native App (iOS & Android)

This is the **native mobile app version** - 100% separate from the desktop web app.

## 🎯 What's This?

Your mobile app uses **Capacitor** to create a true native app that can:
- ✅ Be published to Apple App Store and Google Play Store
- ✅ Access all phone features (camera, notifications, GPS, sensors, etc.)
- ✅ Work offline with full native performance
- ✅ Feel like a real native app (because it is!)

## 📁 Complete File Structure

```
mobile/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── baguette.jpg
│   │   ├── chocolate-cake.jpg
│   │   ├── cinnamon-rolls.jpg
│   │   ├── croissant.jpg
│   │   ├── hero-bread.jpg
│   │   ├── sourdough.jpg
│   │   └── whole-wheat.jpg
│   ├── components/
│   │   └── ui/
│   │       ├── CartDrawer.tsx
│   │       ├── CategoryFilter.tsx
│   │       ├── NavLink.tsx
│   │       └── ProductCard.tsx
│   ├── data/
│   │   └── products.ts
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   └── ProductDetail.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── capacitor.config.ts
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

**CRITICAL:** Mobile files are 100% separate from desktop files. Never mix them!

## 🚀 Setup Instructions

### 1️⃣ Export to GitHub
Click the "Export to GitHub" button in UR-DEV to transfer your project

### 2️⃣ Clone and Install
```bash
git clone your-repo-url
cd your-project
npm install
```

### 3️⃣ Add Native Platforms
```bash
# For iOS (requires Mac + Xcode)
npx cap add ios

# For Android (requires Android Studio)
npx cap add android
```

### 4️⃣ Update Platforms
```bash
npx cap update ios
# or
npx cap update android
```

### 5️⃣ Build Your App
```bash
npm run build
```

### 6️⃣ Sync to Native Projects
```bash
npx cap sync
```

### 7️⃣ Run on Device/Emulator
```bash
# For Android
npx cap run android

# For iOS (Mac only)
npx cap run ios
```

## 📋 Requirements

### For iOS Development:
- Mac computer
- Xcode installed (from Mac App Store)
- iOS Simulator or physical iPhone

### For Android Development:
- Android Studio installed
- Android SDK configured
- Android Emulator or physical Android device

## 🔧 Development Workflow

After making changes:
1. Save your changes in UR-DEV
2. Git pull the latest code
3. Run `npm run build`
4. Run `npx cap sync`
5. Test on device: `npx cap run android` or `npx cap run ios`

## 🌐 Hot Reload

The capacitor.config.ts is configured to use hot reload from the UR-DEV sandbox:
```
url: https://307fc9ab-5a91-4317-8386-c524ccfc0903.lovableproject.com
```

This means changes in UR-DEV will update immediately on your device (while in development).

## 📚 Learn More

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://capacitorjs.com/docs/ios)
- [Android Development Guide](https://capacitorjs.com/docs/android)
- [UR-DEV Mobile Guide](https://docs.lovable.dev)

## 🆘 Need Help?

If you run into issues:
1. Make sure all prerequisites are installed
2. Check the Capacitor docs
3. Ask UR-DEV AI for help with specific errors

---

**Built with ❤️ using UR-DEV AI Builder**
