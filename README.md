# 💰 SpendWise - Personal Expense Tracker

![Angular](https://img.shields.io/badge/Angular-20.0-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat-square&logo=chartdotjs)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex)
![Cypress](https://img.shields.io/badge/Cypress-14.5-17202C?style=flat-square&logo=cypress)
![SCSS](https://img.shields.io/badge/SCSS-CSS3-CF649A?style=flat-square&logo=sass)

A modern, responsive personal expense tracking application built with Angular 20. SpendWise provides users with an intuitive interface to manage their finances, featuring interactive dashboards, real-time analytics, and comprehensive expense management tools.

## 🎯 Key Features

- **📊 Interactive Dashboard**: Real-time overview with total expenses, distribution charts, and recent activity
- **📈 Data Visualization**: Interactive donut charts powered by Chart.js showing expense distribution by category
- **💰 Expense Management**: Add, view, edit, and delete expenses with comprehensive form validation
- **🏷️ Category System**: 8 predefined expense categories (Food, Transportation, Housing, Utilities, Entertainment, Shopping, Healthcare, Other)
- **🔍 Advanced Filtering**: Filter expenses by category, date range, and search text with real-time results
- **📱 Responsive Design**: Mobile-first design optimized for desktop, tablet, and mobile devices
- **⚡ Real-time Updates**: Reactive state management with instant UI updates across all components
- **🎨 Modern UI/UX**: Clean card-based design with smooth animations and hover effects

## 🛠️ Technology Stack

**Frontend:**
- **Angular 20.0** - Latest Angular framework with enhanced performance
- **TypeScript 5.8** - Type-safe development with modern ECMAScript features
- **RxJS 7.8** - Reactive programming for state management and data streams
- **SCSS** - Advanced CSS preprocessing with variables and mixins
- **Chart.js 4.5** + **ng2-charts 8.0** - Interactive charts and data visualization

**Testing:**
- **Jasmine 5.7** + **Karma 6.4** - Unit testing framework and test runner
- **Cypress 14.5** - End-to-end testing framework
- **Angular Testing Utilities** - TestBed and component testing tools

**Build & Development:**
- **Angular CLI 20.0** - Project scaffolding and build system
- **Prettier** - Code formatting with Angular HTML parser

## 🏗️ Project Architecture

SpendWise follows Angular's modular architecture with feature-based organization and lazy loading:

```
src/app/
├── core/                           # Core singleton services and models
│   ├── layout/navbar/              # Navigation component
│   ├── models/expense.interface.ts # TypeScript interfaces and enums
│   └── services/
│       ├── expense.ts              # Expense CRUD operations
│       └── expense-state.ts        # Reactive state management with BehaviorSubject
├── features/expenses/              # Lazy-loaded expense feature module
│   └── pages/
│       ├── dashboard/              # Main dashboard with charts and analytics
│       ├── add-expense/            # Expense creation form with validation
│       └── expense-list/           # Expense listing with filtering
├── shared/                         # Reusable components and services
│   ├── components/
│   │   ├── expense-item/           # Individual expense display component
│   │   ├── expense-chart/          # Chart.js integration component
│   │   └── confirmation-dialog/    # Modal confirmation dialogs
│   └── services/
└── app-routing-module.ts           # Main application routing with lazy loading
```

### Core Components

**ExpenseStateService**: Centralized reactive state management using BehaviorSubject pattern
- Manages expense data with Observable streams for real-time updates
- Implements CRUD operations with immutable state updates
- Pre-populated with sample data for immediate testing

**Dashboard Component**: Interactive analytics dashboard featuring:
- Real-time expense totals calculation with Chart.js donut charts
- Clickable legend filtering to hide/show expense categories
- Recent expenses display with navigation to full list

**Expense Management**: Complete CRUD functionality with reactive forms
- Add Expense: Comprehensive form validation and real-time feedback
- Expense List: Advanced filtering by category, date range, and search text
- Delete functionality with confirmation dialogs

## 🧠 State Management

The application uses RxJS reactive patterns with centralized state management:

```typescript
@Injectable({ providedIn: 'root' })
export class ExpenseStateService {
  private expenses = new BehaviorSubject<Expense[]>(this.getSampleData());
  expenses$ = this.expenses.asObservable();

  // Immutable state updates
  addExpense(expense: Expense): void {
    const currentExpenses = this.expenses.value;
    this.expenses.next([expense, ...currentExpenses]);
  }

  // Reactive filtering
  getFilteredExpenses(filters: any): Observable<Expense[]> {
    return this.expenses$.pipe(
      map(expenses => this.applyFilters(expenses, filters))
    );
  }
}
```

**Key Features:**
- **BehaviorSubject Pattern**: Maintains current state and emits to new subscribers
- **Observable Streams**: All components react to state changes automatically
- **Immutable Updates**: State modifications create new state objects
- **Real-time Synchronization**: All UI components update simultaneously

## 📊 Dashboard & Charts

### Interactive Analytics Dashboard

**Chart.js Integration**: Interactive donut charts with advanced features:
- Visual representation of spending across 8 expense categories
- Clickable legend items to filter chart data (hide/show categories)
- Hover tooltips showing exact amounts and percentages
- Real-time updates when expense data changes
- Responsive design that scales with container

**Dashboard Layout**: 3-card horizontal layout featuring:
- **Total Expenses Card**: Real-time calculation with gradient design
- **Distribution Chart**: Interactive visualization of category spending
- **Recent Expenses**: Latest 5 transactions with category badges

**Color-coded Categories**:
- 🍔 Food: `#16a34a` (Green) | 🚗 Transportation: `#2563eb` (Blue)
- 🏠 Housing: `#dc2626` (Red) | ⚡ Utilities: `#ca8a04` (Yellow)
- 🎬 Entertainment: `#8b5cf6` (Purple) | 🛍️ Shopping: `#ec4899` (Pink)
- 🏥 Healthcare: `#14b8a6` (Teal) | 📦 Other: `#6b7280` (Gray)

## 🧪 Testing Strategy

### Unit Testing (Jasmine + Karma)
- **16 test files** covering all major components and services
- **Form validation testing** with reactive forms and error handling
- **State management testing** with Observable patterns and BehaviorSubject
- **Component interaction testing** using Angular TestBed utilities

### End-to-End Testing (Cypress)
**Test Coverage:**
- `add-expense.cy.ts` - Complete expense creation workflow with validation
- `dashboard.cy.ts` - Dashboard functionality and chart interactions
- `smoke.cy.ts` - Basic application loading and navigation

**E2E Test Scenarios:**
- ✅ Expense addition flow with form validation
- ✅ Navigation between dashboard, expense list, and add expense pages
- ✅ Expense filtering and search functionality
- ✅ Dashboard chart display and interaction
- ✅ Responsive layout verification

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Angular CLI**: Version 20.x (optional, but recommended)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Eng-Eyad77/SpendWise.git
cd SpendWise

# Install dependencies
npm install

# Start development server
npm start
# Application available at http://localhost:4200

# Build for production
npm run build
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Build the application for production |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests with Karma |
| `npm run e2e` | Run E2E tests with Cypress (headless) |
| `npm run e2e:open` | Open Cypress test runner GUI |
| `npm run e2e:headless` | Run E2E tests in headless mode |
| `npm run start:e2e` | Start dev server and open Cypress GUI |

## 🎨 Design & Styling

### Modern Design System
- **Card-based Layout**: Clean separation with subtle shadows and hover effects
- **Purple Gradients**: Professional color scheme (#667eea to #764ba2)
- **Responsive Design**: CSS Grid (3-column desktop) and Flexbox with mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### Component Styling
```scss
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


## 🔮 Future Enhancements

- **🔐 User Authentication**: Multi-user support with secure login system
- **☁️ Data Persistence**: Backend integration with API and database
- **📊 Advanced Analytics**: Monthly/yearly trends and spending insights
- **🎯 Budget Management**: Set and track spending limits by category
- **💾 Data Export**: Export expenses to CSV, Excel, and PDF formats
- **🔔 Smart Notifications**: Spending alerts and budget reminders
- **🌙 Dark Mode**: Theme switcher for enhanced user experience
- **📱 PWA Support**: Progressive Web App capabilities for mobile

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality Standards
- TypeScript strict mode enabled
- Angular best practices and style guide
- Comprehensive unit and E2E test coverage
- ESLint and Prettier for code formatting

## 🤖 AI-Assisted Development

This project was developed with assistance from AI tools to accelerate development and ensure best practices:

- **GitHub Copilot** - Code generation, autocomplete, and refactoring suggestions
- **AI Planning** - Architecture design, testing strategies, and documentation structure

All AI-generated code was manually reviewed, tested, and adapted to meet project requirements. Final architecture and implementation decisions were determined through human oversight and engineering judgment.

---

## 👨‍💻 Developer

**Developed by Eyad Adnan Maccawy**

*Passionate full-stack developer specializing in Angular, TypeScript, and modern web technologies. Focused on creating intuitive, performant applications that solve real-world problems.*

### Connect & Collaborate
- 🌐 **GitHub**: [Eng-Eyad77](https://github.com/Eng-Eyad77)
- 💼 **LinkedIn**: [Connect with me](https://linkedin.com/in/eyad-maccawy)
- 📧 **Email**: [eyad.maccawy@example.com](mailto:eyad.maccawy@example.com)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Angular team for the excellent framework and documentation
- RxJS community for reactive programming patterns
- Chart.js for beautiful data visualization
- Cypress team for robust E2E testing tools
- Open source community for inspiration and best practices

---

**✨ Built with ❤️ using Angular 20 and modern web development best practices**

*SpendWise - Take control of your expenses with modern web technology!* 💰✨
