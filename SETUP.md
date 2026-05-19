# Tax Invoice Manager - Installation & Setup Guide

## 🚀 Quick Start

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: Minimum 4GB
- **Disk Space**: 500MB for installation
- **OS**: Windows 7+, macOS 10.12+, or Linux

### Step 1: Install Node.js
Download and install from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### Step 2: Project Setup

```bash
# Navigate to project directory
cd /Users/shehin/Work_Zone/Tax_Invoice_Manager

# Install all dependencies
npm install

# This will install:
# - Angular 21
# - Angular Material
# - Electron
# - All supporting libraries
```

### Step 3: Verify Installation

```bash
# Check Angular CLI
ng version

# List installed packages
npm list --depth=0
```

## 🎯 Running the Application

### Development Workflow

#### Option A: Development Server Only (Quick Testing)
```bash
npm start
```
- Opens http://localhost:4200
- Hot reload enabled
- Perfect for UI/component testing
- No Electron window

#### Option B: Full Electron Development (Recommended)
```bash
npm run electron-dev
```
- Runs Angular on localhost:4200
- Automatically opens Electron window
- Uses dev tools
- Full desktop app experience

#### Option C: Production Build
```bash
npm run build:prod
```
- Creates optimized build in `dist/` folder
- Smaller bundle size
- Faster performance

## 📦 Building Desktop Installers

### For Windows
```bash
npm run build-win
```
Creates:
- `release/Tax Invoice Manager Setup 1.0.0.exe` (Installer)
- `release/Tax Invoice Manager 1.0.0.exe` (Portable)

### For macOS
```bash
npm run build-mac
```
Creates:
- `release/Tax Invoice Manager-1.0.0.dmg` (Disk Image)

### For Linux
```bash
npm run build-linux
```
Creates:
- `release/tax-invoice-manager-1.0.0.AppImage`
- `release/tax-invoice-manager_1.0.0_amd64.deb`

## 📁 Project Structure Details

### `/electron`
- **main.js** - Electron main process
- **preload.js** - Security context bridge

### `/src/app`
- **app.component.ts** - Root Angular component
- **app.routes.ts** - Route configuration
- **components/** - Reusable components
- **pages/** - Full page components
- **models/** - TypeScript interfaces
- **services/** - Business logic services
- **shared/** - Shared utilities

### Key Files
- `angular.json` - Angular build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `main.ts` - Angular bootstrap file

## 🔧 Configuration

### Angular Development Server
Edit `angular.json` to customize:
- Port: Default 4200
- Host: Default localhost
- Build options

### Electron
Edit `electron/main.js` to:
- Change window size (currently 1400x900)
- Set minimum window size
- Configure app icon
- Add menu items

### TypeScript
Edit `tsconfig.json` to:
- Change compilation target
- Add path aliases
- Configure strict mode

## 🌈 Customization

### Change App Title
Edit `src/index.html`:
```html
<title>Your App Name</title>
```

### Change Theme Colors
Edit `src/styles.scss`:
```scss
// Primary Color
--mdc-theme-primary: #2196f3;

// Accent Color
--mdc-theme-accent: #009688;

// Warn Color
--mdc-theme-warn: #f44336;
```

### Change Window Icon
Place your icon at:
- `src/assets/icon.png` (256x256)
- Update reference in `electron/main.js`

## 📝 Adding New Features

### Create New Page
```bash
# Create folder structure
mkdir src/app/pages/my-page

# Create component
cat > src/app/pages/my-page/my-page.component.ts << 'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [],
  template: `<h1>My Page</h1>`
})
export class MyPageComponent {}
EOF
```

Add to `app.routes.ts`:
```typescript
{ path: 'my-page', component: MyPageComponent }
```

### Create New Service
```bash
mkdir src/app/services
cat > src/app/services/my.service.ts << 'EOF'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  constructor() {}
}
EOF
```

## 🐛 Common Issues & Solutions

### Issue: Port 4200 already in use
```bash
# Find process using port 4200
lsof -i :4200

# Kill process (macOS/Linux)
kill -9 <PID>

# Or use different port
ng serve --port 4300
```

### Issue: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Rebuild packages
npm rebuild

# Try install again
npm install
```

### Issue: Electron won't open
```bash
# Install missing dependency
npm install electron-is-dev --save-dev

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Module not found errors
```bash
# Clear Angular cache
rm -rf .angular

# Clear node_modules
rm -rf node_modules

# Reinstall
npm install

# Rebuild
npm rebuild
```

### Issue: Build fails
```bash
# Clear dist folder
rm -rf dist

# Fresh build
npm run build:prod
```

## 🔐 Security Tips

1. Never commit sensitive data
2. Use .gitignore for private files
3. Keep dependencies updated: `npm update`
4. Check security vulnerabilities: `npm audit`
5. Fix vulnerabilities: `npm audit fix`

## 📊 Development Tools

### Chrome DevTools
Available when running in dev mode:
```bash
npm run electron-dev
```
Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)

### Angular DevTools Browser Extension
Install from Chrome Web Store for advanced debugging

### VS Code Extensions Recommended
- Angular Language Service
- Angular Snippets
- Material Icon Theme
- Prettier Code Formatter
- ES Lint

## 📚 File Descriptions

### TypeScript Files

#### `src/main.ts`
- Angular bootstrap file
- Configures providers
- Initializes application

#### `src/app/app.routes.ts`
- Central route configuration
- Maps URL paths to components
- Lazy loading setup (for Phase 2)

#### `src/app/app.component.ts`
- Root component
- Provides router outlet

#### `src/app/components/layout/layout.component.ts`
- Main layout wrapper
- Navigation menu
- Header/toolbar

#### `src/app/pages/*`
- Full page components
- Contains business logic
- Uses services for data

#### `src/app/services/*`
- Manage data and business logic
- RxJS observables
- State management

#### `src/app/models/*`
- TypeScript interfaces
- Type definitions
- Data contracts

### Configuration Files

#### `angular.json`
- Angular CLI configuration
- Build settings
- Development server config
- Assets, styles configuration

#### `tsconfig.json`
- TypeScript compilation settings
- Type checking rules
- Path aliases

#### `package.json`
- Project metadata
- Dependencies
- NPM scripts
- Build configuration

#### `electron/main.js`
- Electron main process
- Window creation
- App lifecycle
- IPC handlers

## 🚀 Performance Tips

1. **Use OnPush Change Detection** (for Phase 2)
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```

2. **Lazy Load Routes** (for Phase 2)
   ```typescript
   loadChildren: () => import('./module').then(m => m.Module)
   ```

3. **Unsubscribe from Observables**
   ```typescript
   private destroy$ = new Subject<void>();
   
   ngOnInit() {
     this.service.data$
       .pipe(takeUntil(this.destroy$))
       .subscribe(data => {});
   }
   
   ngOnDestroy() {
     this.destroy$.next();
   }
   ```

4. **Use TrackBy with ngFor**
   ```typescript
   trackByFn(index: number, item: Item) {
     return item.id;
   }
   ```

## 📖 Documentation Structure

This project includes:
- README.md - Project overview and features
- ARCHITECTURE.md - (To be created) - System design
- CONTRIBUTING.md - (To be created) - Development guidelines
- CHANGELOG.md - (To be created) - Version history

## 🎓 Learning Resources

### Official Documentation
- [Angular Docs](https://angular.io/docs)
- [Angular Material](https://material.angular.io)
- [Electron Docs](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [RxJS Documentation](https://rxjs.dev/)

### Recommended Tutorials
- Angular Getting Started Guide
- Material Design Principles
- Electron Security Best Practices
- TypeScript Advanced Types

## ✅ Pre-deployment Checklist

Before releasing to production:
- [ ] Update version in package.json
- [ ] Test on all target platforms
- [ ] Update README.md
- [ ] Create CHANGELOG entry
- [ ] Run security audit: `npm audit`
- [ ] Test installer creation
- [ ] Test offline functionality
- [ ] Clear console logs
- [ ] Remove debug code
- [ ] Test with real data
- [ ] Performance testing
- [ ] Accessibility testing

## 📞 Support & Help

### Getting Help
1. Check troubleshooting section
2. Review Angular documentation
3. Check GitHub issues
4. Search Stack Overflow
5. Contact support team

### Reporting Issues
Include:
- Node.js version
- npm version
- OS and version
- Error message (full)
- Steps to reproduce
- Expected behavior
- Actual behavior

---

**Happy Coding!** 🎉

For Phase 2 updates and advanced features, refer to the project roadmap.
