# 💰 SpendWise - Personal Expense Tracker

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat-square&logo=chartdotjs)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex)
![Cypress](https://img.shields.io/badge/Cypress-14.5-17202C?style=flat-square&logo=cypress)

A modern, responsive personal expense tracking application built with Angular 20. SpendWise helps users manage their finances with an intuitive dashboard, interactive charts, and comprehensive expense management features.

## 📌 Project Overview

**SpendWise** is a full-featured expense tracking application designed to help users monitor their spending habits and manage their personal finances effectively. The application features a clean, modern interface with real-time data visualization and responsive design.

### 🎯 Key Features

- **📊 Interactive Dashboard** - Comprehensive overview with total expenses, distribution charts, and recent activity
- **📈 Visual Analytics** - Dynamic donut charts showing expense distribution by category
- **🏷️ Category Management** - 8 predefined expense categories with color-coded organization
- **🔍 Advanced Filtering** - Filter expenses by category, date range, and search text
- **📱 Responsive Design** - Fully responsive layout optimized for desktop, tablet, and mobile
- **⚡ Real-time Updates** - Reactive state management with instant UI updates
- **🎨 Modern UI/UX** - Clean card-based design with smooth animations and hover effects

### 🛠️ Technologies Used

- **Frontend Framework**: Angular 20.0
- **Language**: TypeScript 5.8
- **Styling**: SCSS with Flexbox/CSS Grid
- **Charts**: Chart.js 4.5 with ng2-charts
- **State Management**: RxJS 7.8 with BehaviorSubject
- **Testing**: Jasmine, Karma, Cypress 14.5
- **Build Tool**: Angular CLI 20.0
- **Package Manager**: npm

## 🧱 Project Architecture

### Module Structure

The application follows Angular's modular architecture with feature-based organization:

```
src/app/
├── core/                    # Core functionality and services
│   ├── layout/             # Application shell components
│   │   └── navbar/         # Navigation component
│   ├── models/             # TypeScript interfaces and enums
│   │   └── expense.interface.ts
│   └── services/           # Business logic and state management
│       ├── expense.ts      # Expense operations service
│       └── expense-state.ts # Reactive state management
├── features/               # Feature modules
│   └── expenses/          # Expense management feature
│       ├── pages/         # Page components
│       │   ├── dashboard/     # Main dashboard
│       │   ├── add-expense/   # Add new expense form
│       │   └── expense-list/  # Expense listing and filtering
│       ├── expenses-module.ts
│       └── expenses-routing-module.ts
├── shared/                # Shared components and services
│   ├── components/        # Reusable UI components
│   │   ├── expense-item/      # Individual expense display
│   │   └── confirmation-dialog/ # Modal confirmations
│   └── services/          # Shared utility services
└── app-routing-module.ts  # Main application routing
```

### Component Architecture

- **Lazy Loading**: Expenses module is lazy-loaded for optimal performance
- **Smart/Dumb Components**: Clear separation between container and presentation components
- **Reactive Forms**: Form validation and state management using Angular Reactive Forms
- **Service Layer**: Business logic separated into dedicated services

### Routing Configuration

```typescript
// Main routes with lazy loading
{
  path: 'expenses',
  loadChildren: () => import('./features/expenses/expenses-module').then(m => m.ExpensesModule)
}

// Feature routes
{ path: 'dashboard', component: DashboardComponent }
{ path: 'add', component: AddExpenseComponent }
{ path: 'list', component: ExpenseListComponent }
```

## 📊 Dashboard Features

### 🎯 Total Expenses Card
- **Real-time Calculation**: Automatically updates as expenses are added/removed
- **Beautiful Gradient Design**: Eye-catching purple gradient background
- **Quick Actions**: Direct "Add New Expense" button for easy access
- **Currency Formatting**: Professional monetary display with proper formatting

### 📈 Expense Distribution Chart
- **Interactive Donut Chart**: Built with Chart.js for smooth animations
- **Category-based Visualization**: Shows spending distribution across 8 categories
- **Clickable Legend Filtering**: Click legend items to hide/show categories
- **Hover Tooltips**: Detailed information on hover with amount and percentage
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Chart automatically refreshes when data changes

### 🏷️ Category Summary Section
- **Progress Bars**: Visual representation of spending by category
- **Percentage Breakdown**: Shows each category's share of total expenses
- **Color-coded Categories**: Consistent color scheme throughout the application
- **Scrollable List**: Accommodates any number of expense categories

### 📋 Recent Expenses
- **Latest Activity**: Shows the 5 most recent expenses
- **Category Badges**: Color-coded tags for easy category identification
- **Formatted Dates**: User-friendly date display
- **Quick Navigation**: "View All Expenses" button for full expense list

## 🧠 State Management

### ExpenseStateService Architecture

The application uses a reactive state management approach with RxJS:

```typescript
@Injectable({ providedIn: 'root' })
export class ExpenseStateService {
  private expensesSubject = new BehaviorSubject<Expense[]>(this.getSampleData());
  public expenses$ = this.expensesSubject.asObservable();

  // Reactive total calculation
  getTotalExpenses(): Observable<number> {
    return this.expenses$.pipe(
      map(expenses => expenses.reduce((total, expense) => total + expense.amount, 0))
    );
  }
}
```

### Key Features:
- **BehaviorSubject**: Maintains current state and emits to new subscribers
- **Observable Streams**: All components react to state changes automatically
- **Immutable Updates**: State changes create new state objects
- **Memory Efficient**: Proper subscription management prevents memory leaks
- **Real-time Sync**: All UI components update simultaneously when data changes

### Reactive Filtering System

```typescript
// Dynamic filtering with multiple criteria
this.filteredExpenses$ = combineLatest([
  this.expenses$,
  this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
]).pipe(
  map(([expenses, filters]) => this.applyFilters(expenses, filters))
);
```

## 💅 UI & Styling

### Design System

#### Color Palette
- **Primary Colors**: Purple gradients (#667eea, #764ba2)
- **Category Colors**: 
  - 🥘 Food: `#16a34a` (Green)
  - 🚗 Transportation: `#2563eb` (Blue)
  - 🏠 Housing: `#dc2626` (Red)
  - ⚡ Utilities: `#ca8a04` (Yellow)
  - 🎬 Entertainment: `#8b5cf6` (Purple)
  - 🛍️ Shopping: `#ec4899` (Pink)
  - 🏥 Healthcare: `#14b8a6` (Teal)
  - 📦 Other: `#6b7280` (Gray)

#### Layout Strategy
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **Card-based Design**: Clean, organized content presentation
- **Mobile-first Approach**: Responsive breakpoints at 768px and 480px
- **3-Column Dashboard**: Horizontal layout on desktop, stacked on mobile

#### Component Styling
```scss
// Modern card design with hover effects
.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
```

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility for forms and buttons
- **Color Contrast**: WCAG 2.1 AA compliant color combinations
- **Focus Indicators**: Clear visual focus states for all interactive elements

## 🧪 Testing Overview

### Unit Testing (Jasmine + Karma)
- **Component Tests**: Testing component logic and user interactions
- **Service Tests**: Comprehensive testing of business logic and state management
- **Form Validation**: Testing reactive form validation and error handling
- **Coverage**: High test coverage across critical application features

### Key Test Examples:
```typescript
// Testing reactive state management
it('should add new expense to the beginning of the list', (done) => {
  const newExpense: Expense = { /* test data */ };
  service.addExpense(newExpense);
  
  service.expenses$.subscribe(expenses => {
    expect(expenses[0]).toEqual(newExpense);
    done();
  });
});

// Testing component filtering
it('should filter expenses by category', (done) => {
  component.filterForm.patchValue({ category: ExpenseCategory.FOOD });
  
  component.filteredExpenses$.subscribe(filtered => {
    expect(filtered.every(e => e.category === ExpenseCategory.FOOD)).toBeTruthy();
    done();
  });
});
```

### End-to-End Testing (Cypress)
- **Complete User Flows**: Testing entire user journeys from start to finish
- **Form Submission**: Testing add expense flow with validation
- **Navigation**: Testing routing and page transitions
- **Data Persistence**: Verifying data appears correctly after operations

### E2E Test Coverage:
- ✅ Add expense flow with form validation
- ✅ Expense list filtering and search
- ✅ Dashboard data display and chart interactions
- ✅ Navigation between different pages
- ✅ Responsive layout testing

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Angular CLI**: Version 20.x

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd spendwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:4200
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build the project for production |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests with Karma |
| `npm run e2e` | Run E2E tests with Cypress |
| `npm run e2e:open` | Open Cypress test runner GUI |

### Production Build
```bash
npm run build
# Output will be in the dist/ directory
```

### Testing Commands
```bash
# Unit tests
npm test

# E2E tests headless
npm run e2e

# E2E tests with GUI
npm run e2e:open

# Run both dev server and E2E tests
npm run start:e2e
```

## 📁 Project Structure Deep Dive

### Core Module (`/core`)
- **Purpose**: Contains singleton services and core application functionality
- **Layout Components**: Navigation and shell components
- **Models**: TypeScript interfaces and enums for type safety
- **Services**: Business logic and state management

### Features Module (`/features/expenses`)
- **Purpose**: Contains all expense-related functionality
- **Page Components**: Dashboard, Add Expense, Expense List
- **Lazy Loading**: Module is loaded on-demand for better performance
- **Routing**: Feature-specific routing configuration

### Shared Module (`/shared`)
- **Purpose**: Reusable components and services used across features
- **Components**: Expense item display, confirmation dialogs
- **Services**: Utility services like confirmation dialog service

## 🎨 Design Philosophy

### Modern Material Design
- **Card-based Layout**: Clean separation of content areas
- **Subtle Shadows**: Depth and hierarchy through elevation
- **Smooth Animations**: Enhances user experience without being distracting
- **Consistent Spacing**: 8px grid system for visual harmony

### Color Psychology
- **Purple Gradients**: Conveys trust and sophistication for financial data
- **Category Colors**: Intuitive color associations (green for food, blue for transport)
- **Neutral Backgrounds**: Ensures content readability and reduces eye strain

### User Experience Focus
- **Minimal Clicks**: Common actions are easily accessible
- **Visual Feedback**: Immediate response to user interactions
- **Progressive Disclosure**: Information is revealed as needed
- **Error Prevention**: Form validation prevents user mistakes

## 🔮 Future Enhancements

- **� User Authentication**: Multi-user support with secure login
- **☁️ Cloud Sync**: Synchronize data across devices
- **📊 Advanced Analytics**: Monthly/yearly spending trends and insights
- **🎯 Budget Goals**: Set and track spending limits by category
- **💾 Data Export**: Export expenses to CSV/PDF formats
- **🔔 Notifications**: Spending alerts and reminders
- **🌙 Dark Mode**: Theme toggle for better user preference support

---

## 👨‍💻 Developer

**Developed by Eyad Adnan Maccawy**

*A passionate full-stack developer with expertise in Angular, TypeScript, and modern web technologies. Focused on creating beautiful, functional applications that solve real-world problems.*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues) for ways to contribute.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**✨ Built with ❤️ using Angular 20 and modern web technologies**

SpendWise is a production-ready expense tracking application that allows users to efficiently manage their personal finances. The app provides intuitive expense entry, powerful filtering capabilities, and insightful dashboard analytics with a modern, responsive user interface.

## ✨ Key Features

### 💰 **Expense Management**
- **Add Expenses**: Reactive form with real-time validation for amount, category, date, and notes
- **View All Expenses**: Comprehensive list display with expense details and actions
- **Delete Functionality**: Remove unwanted expenses with confirmation
- **Sample Data**: Pre-loaded with 10 diverse expenses for immediate testing

### 🔍 **Advanced Filtering & Search**
- **Real-time Search**: Filter expenses by description or notes
- **Category Filtering**: Filter by expense categories (Food, Transport, Entertainment, etc.)
- **Date Range Filtering**: Filter expenses by start and end dates
- **Reactive Updates**: All filters work together with instant results

### 📊 **Dashboard Analytics**
- **Expense Statistics**: Total expenses and category breakdowns
- **Visual Charts**: Pie chart integration with Chart.js for category analysis
- **Recent Expenses**: Quick view of latest transactions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 **Modern UI/UX**
- **Responsive Layout**: Mobile-first design with flexbox and CSS Grid
- **Professional Styling**: Modern SCSS with CSS custom properties
- **Form Validation**: Visual feedback with user-friendly error messages
- **Loading States**: Smooth animations and state transitions

## 🛠️ Technical Stack

### **Frontend Framework**
- **Angular 20** - Latest version with enhanced performance and features
- **TypeScript 5.0+** - Type-safe development with modern ES features
- **RxJS 7.0+** - Reactive programming for state management

### **Architecture & Patterns**
- **Angular Modules** - Modular architecture (NgModules, not standalone components)
- **Lazy Loading** - Feature modules loaded on demand for performance
- **Reactive Forms** - Type-safe form handling with validation
- **BehaviorSubject** - Centralized state management pattern

### **Styling & UI**
- **SCSS** - Advanced CSS with variables, mixins, and modern features
- **Chart.js** - Interactive charts and data visualization
- **Responsive Design** - Mobile-first approach with breakpoints

### **Testing Framework**
- **Jasmine + Karma** - Unit testing with Angular testing utilities
- **Cypress** - End-to-end testing for user workflows
- **42+ Test Cases** - Comprehensive coverage across components and services

## 🏗️ Architecture Overview

### **Modular Structure**
```
src/app/
├── core/                 # CoreModule - Singleton services
│   ├── services/
│   │   ├── expense.service.ts
│   │   └── expense-state.service.ts
│   └── core.module.ts
├── shared/               # SharedModule - Reusable components
│   ├── components/
│   └── shared.module.ts
├── expenses/             # ExpensesModule - Lazy-loaded feature
│   ├── components/
│   │   ├── add-expense/
│   │   ├── expense-list/
│   │   ├── expense-item/
│   │   └── expense-chart/
│   └── expenses.module.ts
├── dashboard/            # Dashboard components
└── app.module.ts         # Root module
```

### **State Management**
- **ExpenseStateService**: Centralized state using BehaviorSubject
- **Reactive Data Flow**: Observable streams for real-time updates
- **Immutable Updates**: Proper state management patterns
- **Service Injection**: Dependency injection for loose coupling

### **Lazy Loading Configuration**
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule)
  }
];
```

## 🧪 Testing Strategy

### **Unit Tests (42 total)**
- **AddExpenseComponent**: 18 tests covering form validation, submission, and user interactions
- **ExpenseListComponent**: 17 tests covering filtering, display, and data management  
- **ExpenseStateService**: 7 tests covering state management and data operations
- **Angular Testing Utilities**: TestBed, ComponentFixture, and async testing

### **E2E Tests with Cypress**
- **Add Expense Flow**: Complete user journey from form to expense list
- **Form Validation**: Required fields, amount formatting, and error states
- **Navigation Testing**: Route transitions and deep linking
- **Filter Functionality**: Search, category, and date range filtering
- **Dashboard Integration**: Chart display and statistics verification

### **Test Commands**
```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (headless)
npm run e2e

# Run E2E tests (interactive)
npm run e2e:open

# Run app and E2E tests together
npm run start:e2e
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Angular CLI 20+

### **Installation & Setup**
```bash
# Clone the repository
git clone <repository-url>
cd spendwise

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build for production in `dist/` folder |
| `npm test` | Run unit tests with Karma |
| `npm run test:watch` | Run tests in watch mode |
| `npm run e2e` | Run Cypress E2E tests (headless) |
| `npm run e2e:open` | Open Cypress GUI for interactive testing |
| `npm run lint` | Run ESLint for code quality |

### **Production Build**
```bash
# Build optimized production bundle
npm run build

# Serve production build locally
npx http-server dist/spendwise -p 8080
```

## 📁 Project Structure

```
spendwise/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services and utilities
│   │   ├── shared/                  # Reusable components
│   │   ├── expenses/                # Expense feature module
│   │   ├── dashboard/               # Dashboard components
│   │   └── app.module.ts            # Root module
│   ├── assets/                      # Static assets
│   ├── styles.scss                  # Global styles
│   └── main.ts                      # Application bootstrap
├── cypress/                         # E2E tests
│   ├── e2e/
│   │   ├── add-expense.cy.ts
│   │   ├── dashboard.cy.ts
│   │   └── smoke.cy.ts
│   └── cypress.config.ts
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## 🔄 Development Workflow

### **Feature Development**
1. Create feature branch from `main`
2. Implement components with unit tests
3. Add E2E tests for user workflows
4. Run full test suite: `npm test && npm run e2e`
5. Build and verify: `npm run build`

### **Code Quality**
- **TypeScript strict mode** for type safety
- **ESLint rules** for consistent code style  
- **Angular best practices** with OnPush change detection
- **RxJS patterns** for reactive programming
- **SCSS organization** with variables and mixins

## 🤖 AI Development Acknowledgement

This project was developed with assistance from AI tools to accelerate development and ensure best practices:

- **GitHub Copilot** - Code generation, autocomplete, and refactoring suggestions
- **ChatGPT** - Architecture planning, testing strategies, and documentation structure
- **AI-Assisted Development** - Component logic, service patterns, and testing scenarios

All AI-generated code was manually reviewed, tested, and adapted to meet project requirements. The final architecture, implementation decisions, and code quality standards were determined through human oversight and engineering judgment.

## 👨‍💻 Developer

> **Developed by [Eyad Adnan Maccawy](#)**  
> Passionate software engineer focused on building clean, maintainable front-end applications using Angular and modern web development best practices.

### **Connect & Collaborate**
- 🔗 LinkedIn: [Connect with me](#)
- 💼 Portfolio: [View my work](#)
- 📧 Email: [Get in touch](#)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework and documentation
- RxJS community for reactive programming patterns
- Chart.js for beautiful data visualization
- Cypress team for robust E2E testing tools
- Open source community for inspiration and best practices

---

**SpendWise** - Take control of your expenses with modern web technology! 💰✨


