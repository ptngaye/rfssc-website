# Fellowship of Sub-Saharan Culture

A modern, internationalized website for the Fellowship of Sub-Saharan Culture, built with cutting-edge web technologies.

## 🚀 Features

- ⚡ **Lightning fast** - Built with Vite
- 🎨 **Modern UI** - Tailwind CSS + Custom design tokens
- 🌍 **Internationalization** - English & French support
- 📱 **Fully responsive** - Mobile-first design
- 🧪 **Well tested** - Unit tests with Vitest, E2E with Playwright
- 🎯 **TypeScript** - Full type safety
- ♿ **Accessible** - WCAG 2.1 compliant
- 🔧 **Developer Experience** - Hot reload, linting, formatting

## 🛠️ Tech Stack

- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **Deployment**: Ready for Vercel/Netlify

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── styles/           # Global styles & Tailwind
├── scripts/          # TypeScript modules
│   ├── components/   # UI components
│   ├── services/     # Business logic
│   └── utils/        # Helper functions
├── translations/     # i18n JSON files
└── types/           # TypeScript definitions
```

## 🌍 Internationalization

The site supports English and French with automatic language detection and localStorage persistence.

To add a new language:
1. Create `src/translations/{locale}.json`
2. Update `I18nService.ts` locales array
3. Add language selector button

## 🚀 Deployment

### Vercel
```bash
npm run build
# Upload dist/ folder
```

### Netlify
```bash
npm run build
# Drag & drop dist/ folder
```

### GitHub Pages
```bash
npm run build
# Commit dist/ folder to gh-pages branch
```

## 🎨 Design System

The project uses a comprehensive design system with:
- **Color tokens** - Semantic color variables
- **Typography scale** - Consistent font sizes
- **Spacing system** - Uniform margins/padding
- **Component patterns** - Reusable UI components

## 📋 TODO

- [ ] Add more languages (Spanish, Portuguese)
- [ ] Implement dark mode
- [ ] Add CMS integration
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rotary International for Fellowship guidelines
- Open source community for amazing tools
- Contributors and maintainers

---

Made with ❤️ for the Fellowship of Sub-Saharan Culture
