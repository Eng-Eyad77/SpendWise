import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ExpenseStateService } from '../../../../core/services/expense-state';
import { Expense, ExpenseCategory } from '../../../../core/models/expense.interface';
import { Observable, map, Subscription } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

interface CategoryTotal {
  category: ExpenseCategory;
  total: number;
  percentage: number;
}

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 120px);
    }

    .top-section {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      width: 100%;
    }

    .dashboard-card {
      flex: 1;
      min-width: 0;
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .dashboard-card h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .total-expenses-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 280px;
    }

    .total-expenses-card h2 {
      color: white;
      border-bottom-color: rgba(255, 255, 255, 0.2);
    }

    .total-amount {
      font-size: 3rem;
      font-weight: 800;
      margin: 1.5rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .add-expense-btn {
      margin-top: 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .add-expense-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }

    .chart-card {
      min-height: 280px;
      display: flex;
      flex-direction: column;
    }

    .chart-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 200px;
      padding: 1rem;
    }

    .chart-container canvas {
      max-width: 200px;
      max-height: 200px;
      margin-bottom: 1rem;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      max-width: 220px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s ease;
      user-select: none;
    }

    .legend-item:hover {
      background: #f8fafc;
    }

    .legend-item.legend-hidden {
      opacity: 0.5;
    }

    .legend-item.legend-hidden .legend-color {
      background: #d1d5db !important;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      flex-shrink: 0;
      transition: background 0.2s ease;
    }

    .legend-label {
      flex: 1;
      color: #374151;
      font-weight: 500;
    }

    .legend-item.legend-hidden .legend-label {
      color: #9ca3af;
      text-decoration: line-through;
    }

    .no-chart-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #f8fafc;
      border-radius: 8px;
      border: 2px dashed #cbd5e1;
      color: #64748b;
      text-align: center;
      padding: 2rem;
    }

    .no-chart-placeholder .chart-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .no-chart-placeholder .chart-text {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .no-chart-placeholder .chart-subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.4;
    }

    .category-card {
      min-height: 280px;
    }

    .categories-list {
      /* Removed max-height and overflow-y to eliminate scrollbar */
      padding-right: 0.5rem;
    }

    .category-item {
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .category-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .category-name {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .category-percentage {
      font-weight: 600;
      color: #6366f1;
      font-size: 0.9rem;
    }

    .category-progress {
      width: 100%;
      height: 6px;
      background: #f1f5f9;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      height: 100%;
      border-radius: 3px;
      transition: width 0.6s ease;
    }

    .category-amount {
      font-weight: 600;
      color: #059669;
      font-size: 0.85rem;
      text-align: right;
      display: block;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      font-style: italic;
    }

    .bottom-section {
      width: 100%;
    }

    .recent-expenses-card .expenses-list {
      margin-bottom: 2rem;
    }

    .expense-row {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f5f9;
      transition: all 0.2s ease;
    }

    .expense-row:hover {
      background: #f8fafc;
      margin: 0 -1rem;
      padding: 1rem;
      border-radius: 8px;
      border-bottom: 1px solid transparent;
    }

    .expense-row:last-child {
      border-bottom: none;
    }

    .expense-category {
      margin-right: 1rem;
    }

    .category-tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 80px;
      text-align: center;
    }

    .expense-details {
      flex: 1;
    }

    .expense-description {
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.25rem;
    }

    .expense-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .expense-amount {
      font-size: 1.125rem;
      font-weight: 700;
      color: #2563eb;
      margin-left: 1rem;
    }

    .no-expenses-message {
      text-align: center;
      padding: 3rem 2rem;
      color: #6b7280;
    }

    .no-expenses-message p {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }

    .add-first-expense-btn {
      background: #6366f1;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .add-first-expense-btn:hover {
      background: #5856eb;
      transform: translateY(-1px);
    }

    .view-all-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 1.5rem;
      text-align: center;
    }

    .view-all-expenses-btn {
      display: inline-block;
      padding: 1rem 2rem;
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      border: 2px solid #6366f1;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .view-all-expenses-btn:hover {
      background: #6366f1;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .top-section {
        flex-direction: column;
        gap: 1.5rem;
      }

      .dashboard-card {
        min-height: 200px;
      }

      .total-expenses-card {
        min-height: 200px;
      }

      .total-amount {
        font-size: 2.5rem;
      }
    }
  `],
  standalone: false
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  expenses$: Observable<Expense[]>;
  totalExpenses$: Observable<number>;
  categoryTotals$: Observable<CategoryTotal[]>;
  
  private chart: Chart | null = null;
  private subscription = new Subscription();
  private hiddenCategories = new Set<string>(); // Track hidden categories

  constructor(private expenseState: ExpenseStateService) {
    this.expenses$ = this.expenseState.expenses$;
    this.totalExpenses$ = this.expenseState.getTotalExpenses();
    this.categoryTotals$ = this.calculateCategoryTotals();
  }

  ngOnInit(): void {
    // Subscribe to category totals to update chart
    this.subscription.add(
      this.categoryTotals$.subscribe(categories => {
        if (this.chart && categories.length > 0) {
          this.updateChart(categories);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // Initialize chart after view is ready
    setTimeout(() => {
      this.initChart();
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.subscription.unsubscribe();
  }

  private initChart(): void {
    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.categoryTotals$.subscribe(categories => {
      if (categories.length > 0) {
        this.createChart(ctx, categories);
      }
    });
  }

  private createChart(ctx: CanvasRenderingContext2D, categories: CategoryTotal[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    // Filter out hidden categories
    const visibleCategories = categories.filter(cat => 
      !this.hiddenCategories.has(this.formatCategoryName(cat.category))
    );

    const colors = visibleCategories.map(cat => this.getCategoryColor(cat.category));
    const labels = visibleCategories.map(cat => this.formatCategoryName(cat.category));
    const data = visibleCategories.map(cat => cat.total);

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => this.darkenColor(color, 20)),
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // We'll use custom legend
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const category = visibleCategories[context.dataIndex];
                const amount = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(category.total);
                return `${context.label}: ${amount} (${category.percentage.toFixed(1)}%)`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#ffffff',
            borderWidth: 1
          }
        },
        cutout: '60%', // Creates the donut hole
        layout: {
          padding: 10
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(categories: CategoryTotal[]): void {
    if (!this.chart) return;

    // Filter out hidden categories
    const visibleCategories = categories.filter(cat => 
      !this.hiddenCategories.has(this.formatCategoryName(cat.category))
    );

    const colors = visibleCategories.map(cat => this.getCategoryColor(cat.category));
    const labels = visibleCategories.map(cat => this.formatCategoryName(cat.category));
    const data = visibleCategories.map(cat => cat.total);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = colors;
    this.chart.data.datasets[0].borderColor = colors.map(color => this.darkenColor(color, 20));
    
    this.chart.update();
  }

  // Method to toggle category visibility
  toggleCategoryVisibility(categoryName: string): void {
    if (this.hiddenCategories.has(categoryName)) {
      this.hiddenCategories.delete(categoryName);
    } else {
      this.hiddenCategories.add(categoryName);
    }
    
    // Update chart with current data
    this.categoryTotals$.subscribe(categories => {
      if (categories.length > 0) {
        this.updateChart(categories);
      }
    }).unsubscribe();
  }

  // Check if category is hidden
  isCategoryHidden(categoryName: string): boolean {
    return this.hiddenCategories.has(categoryName);
  }

  private darkenColor(color: string, percent: number): string {
    // Remove the '#' if present
    const hex = color.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken each component
    const darkenedR = Math.max(0, Math.floor(r * (100 - percent) / 100));
    const darkenedG = Math.max(0, Math.floor(g * (100 - percent) / 100));
    const darkenedB = Math.max(0, Math.floor(b * (100 - percent) / 100));
    
    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
  }

  private calculateCategoryTotals(): Observable<CategoryTotal[]> {
    return this.expenses$.pipe(
      map(expenses => {
        const totals = new Map<ExpenseCategory, number>();
        let grandTotal = 0;

        // Calculate totals per category
        expenses.forEach(expense => {
          const current = totals.get(expense.category) || 0;
          totals.set(expense.category, current + expense.amount);
          grandTotal += expense.amount;
        });

        // Convert to array with percentages
        return Array.from(totals.entries())
          .map(([category, total]) => ({
            category,
            total,
            percentage: (total / grandTotal) * 100
          }))
          .sort((a, b) => b.total - a.total);
      })
    );
  }

  getCategoryColor(category: ExpenseCategory): string {
    const colors: { [key in ExpenseCategory]: string } = {
      [ExpenseCategory.FOOD]: '#16a34a',
      [ExpenseCategory.TRANSPORTATION]: '#2563eb',
      [ExpenseCategory.HOUSING]: '#dc2626',
      [ExpenseCategory.UTILITIES]: '#ca8a04',
      [ExpenseCategory.ENTERTAINMENT]: '#8b5cf6',
      [ExpenseCategory.SHOPPING]: '#ec4899',
      [ExpenseCategory.HEALTHCARE]: '#14b8a6',
      [ExpenseCategory.OTHER]: '#6b7280'
    };
    return colors[category] || '#6b7280';
  }

  formatCategoryName(category: ExpenseCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}
