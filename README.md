# Tax Invoice Manager

A professional offline desktop Tax Invoice application built with Angular 21 + Electron. Designed for GST invoice creation and management with a clean, modern UI.

## 📋 Project Features (Phase 1)

### ✅ Completed

- **Professional UI Layout** - Sidebar navigation, header, and content area
- **Dashboard** - Statistics cards, recent invoices table
- **Invoice Form** - Complete GST invoice structure with:
  - Business details section
  - Buyer details section
  - Consignee details section
  - Product/Items table with auto-calculation
  - Tax summary (CGST, SGST, IGST)
  - Amount in words and declaration fields
- **Customer Management** - View, search, and manage customers
- **Product Management** - View, search, and manage products
- **Settings Page** - Company details, bank information, general settings
- **Responsive Design** - Mobile and desktop-friendly layout
- **Angular Material UI** - Professional Material Design components
- **Electron Integration** - Desktop application wrapper
- **State Management** - Services with RxJS for data handling
- **TypeScript Models** - Well-structured interfaces and models

### 🚀 Phase 2 (Upcoming)

- Database integration (SQLite/Local storage)
- PDF invoice generation
- Invoice history and archiving
- Multi-user support
- Advanced reporting
- Batch invoice creation
- Email integration

## 🛠️ Tech Stack

- **Angular 21** - Standalone components, routing, reactive forms
- **TypeScript 5.2** - Type-safe development
- **Angular Material** - UI components and theming
- **RxJS** - Reactive programming
- **Electron 27** - Desktop application framework
- **Node.js** - Runtime environment

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Setup Steps

```bash
# 1. Clone or navigate to project directory
cd /path/to/Tax_Invoice_Manager

# 2. Install dependencies
npm install

# 3. Install Electron for development
npm install --save-dev electron electron-is-dev concurrently wait-on

# 4. Update package.json if needed with missing dependencies
npm install
```

## 🚀 Running the Application

### Development Mode

#### Option 1: Angular Development Server Only

```bash
npm start
# Runs Angular app on http://localhost:4200
```

#### Option 2: Electron + Angular (Recommended)

```bash
npm run electron-dev
# Automatically starts Angular on localhost:4200
# Then opens Electron window connecting to the Angular dev server
```

### Production Build

```bash
# Build Angular for production
npm run build:prod

# Run with Electron
npm run electron-build

# Build desktop installers
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

## 📁 Project Structure

```
Tax_Invoice_Manager/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Security bridge
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── layout/      # Main layout component
│   │   ├── pages/
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── invoice-form/# Invoice form page
│   │   │   ├── customers/   # Customers management
│   │   │   ├── products/    # Products management
│   │   │   └── settings/    # Settings page
│   │   ├── models/          # TypeScript interfaces
│   │   │   ├── invoice.model.ts
│   │   │   ├── customer.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── settings.model.ts
│   │   ├── services/        # Business logic services
│   │   │   ├── invoice.service.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── settings.service.ts
│   │   ├── shared/          # Shared components
│   │   ├── app.routes.ts    # Route configuration
│   │   └── app.component.ts # Root component
│   ├── assets/              # Images, logos, etc.
│   ├── styles/              # Global styles
│   ├── main.ts              # Angular bootstrap
│   ├── index.html           # HTML template
│   └── styles.scss          # Global SCSS
├── angular.json             # Angular CLI config
├── tsconfig.json            # TypeScript config
├── tsconfig.app.json        # App-specific TS config
├── package.json             # Dependencies and scripts
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🎯 Architecture Overview

### Component Hierarchy

```
AppComponent (Root)
└── LayoutComponent (Main Layout)
    ├── Header/Navbar
    ├── Sidebar Navigation
    └── RouterOutlet
        ├── DashboardComponent
        ├── InvoiceFormComponent
        ├── CustomersComponent
        ├── ProductsComponent
        └── SettingsComponent
```

### Data Flow

```
Components
    ↓
Services (RxJS Observables)
    ↓
Models (TypeScript Interfaces)
    ↓
Local State Management (BehaviorSubjects)
```

### Services Architecture

- **InvoiceService** - Manage invoices, tax calculations
- **CustomerService** - CRUD operations for customers
- **ProductService** - CRUD operations for products
- **SettingsService** - Company configuration management

## 🎨 UI Components Used

### Angular Material

- `mat-toolbar` - Top navigation bar
- `mat-sidenav` - Sidebar navigation
- `mat-card` - Content cards
- `mat-table` - Data tables
- `mat-form-field` - Form inputs
- `mat-button` - Action buttons
- `mat-icon` - Material icons
- `mat-tabs` - Tabbed interface
- `mat-divider` - Visual separators
- `mat-datepicker` - Date selection

## 💾 Data Storage (Current)

Currently uses **mock data** stored in services:

- Data persists during the session
- All data reset on application restart
- Ready for Phase 2 database integration

### Mock Data Included

- 5 sample customers
- 6 sample products
- 2 sample invoices
- Company settings template

## 🔄 Key Features Explanation

### Invoice Form

- **Auto-calculation** - Amount automatically calculated from quantity × rate
- **Tax Summary** - CGST + SGST calculated automatically
- **Dynamic Rows** - Add/remove product items
- **Form Validation** - Required field validation
- **Professional Layout** - Matches GST invoice structure

### Dashboard

- **Statistics Cards** - Key metrics visualization
- **Recent Invoices** - Quick access to latest invoices
- **Responsive Layout** - Works on all screen sizes

### Search Functionality

- Real-time search in customers and products
- Search by name, GSTIN, email, etc.
- Case-insensitive matching

## ⚙️ Configuration

### Environment Variables

Create `.env` file in root directory:

```
ANGULAR_ENVIRONMENT=development
ELECTRON_DEV=true
```

### Theming

Global Material theme configured in `styles.scss`:

- Primary: Blue (#2196F3)
- Accent: Teal (#009688)
- Warn: Red (#F44336)

## 📝 Usage Guide

### Creating an Invoice

1. Navigate to **New Invoice** from sidebar
2. Fill Business Details section
3. Enter Buyer and Consignee information
4. Add invoice items in the table
5. System automatically calculates taxes
6. Click **Save Invoice**

### Managing Customers

1. Go to **Customers** page
2. View all customers in the table
3. Use search bar to find specific customers
4. Click **Add Customer** to create new
5. Use action buttons to edit or delete

### Managing Products

1. Navigate to **Products**
2. View product catalog
3. Search by name or HSN/SAC
4. Click **Add Product** to create new
5. Edit or delete existing products

### Updating Settings

1. Go to **Settings** page
2. Switch between tabs (Company, Bank, General)
3. Update company information
4. Enter bank details
5. Configure general preferences

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
rm -rf .angular
```

### Electron Not Starting

```bash
# Check if port 4200 is available
lsof -i :4200

# Install required dependency
npm install electron-is-dev --save-dev
```

### Module Not Found Errors

```bash
# Rebuild node-gyp dependencies
npm rebuild

# Clear package cache
npm cache clean --force
```

## 📊 Performance Optimizations

- Lazy loading for routes (in Phase 2)
- Change detection strategy: `OnPush`
- RxJS unsubscribe patterns
- Material tree-shaking
- Production build optimization

## 🔐 Security Considerations

- Electron context isolation enabled
- No direct Node.js access from renderer
- Secure IPC communication
- Input validation on forms
- No sensitive data in source

## 📚 Learning Resources

- [Angular Documentation](https://angular.io)
- [Angular Material](https://material.angular.io)
- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🚀 Next Steps (Phase 2)

1. **Database Integration**
   - Implement SQLite for persistent storage
   - Create database service layer
   - Add data sync functionality

2. **PDF Generation**
   - Integrate PDF library (e.g., jsPDF, pdfkit)
   - Create invoice PDF templates
   - Add download/print functionality

3. **Advanced Features**
   - Invoice history and status tracking
   - Tax report generation
   - Customer and product analytics
   - Batch invoice creation

4. **UI Improvements**
   - Dark mode support
   - Advanced filtering options
   - Invoice preview functionality
   - File management system

5. **Testing**
   - Unit tests with Jasmine/Karma
   - E2E tests with Cypress/Playwright
   - Component testing
   - Service testing

## 📄 License

MIT License - Feel free to use this template for personal and commercial projects.

## 👨‍💻 Development Tips

### Adding New Routes

Edit `src/app/app.routes.ts` and add new route configuration.

### Creating New Services

Use Angular service pattern:

```bash
# Services are in src/app/services/
# Implement with RxJS BehaviorSubject for state
```

### Adding Material Components

Import required modules in component `imports` array and use in template.

### Styling

- Use SCSS for nested styles
- Follow Material Design guidelines
- Keep mobile-first responsive design

## 📞 Support

For issues, bugs, or feature requests, please create an issue or contact the development team.

---

**Tax Invoice Manager v1.0.0** - Phase 1 Complete ✅

Built with ❤️ using Angular 21 + Electron
