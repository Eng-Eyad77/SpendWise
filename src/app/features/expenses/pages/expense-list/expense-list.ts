import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpenseService } from '../../../../core/services/expense';
import { ExpenseStateService } from '../../../../core/services/expense-state';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
import { Expense, ExpenseCategory } from '../../../../core/models/expense.interface';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.scss'],
  standalone: false
})
export class ExpenseListComponent implements OnInit {
  expenses$: Observable<Expense[]>;
  filteredExpenses$: Observable<Expense[]>;
  filterForm: FormGroup;
  categories = Object.values(ExpenseCategory);
  totalAmount$: Observable<number>;
  expenseCount$: Observable<number>;

  constructor(
    private expenseService: ExpenseService,
    private expenseState: ExpenseStateService,
    private confirmationDialog: ConfirmationDialogService,
    private fb: FormBuilder
  ) {
    this.expenses$ = this.expenseState.expenses$;
    this.filterForm = this.createFilterForm();
    this.filteredExpenses$ = this.createFilteredExpenses();
    this.totalAmount$ = this.calculateTotalAmount();
    this.expenseCount$ = this.calculateExpenseCount();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      category: [''],
      startDate: [''],
      endDate: [''],
      searchText: ['']
    });
  }

  private createFilteredExpenses(): Observable<Expense[]> {
    return combineLatest([
      this.expenses$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([expenses, filters]) => {
        return expenses.filter(expense => {
          // Category filter
          if (filters.category && expense.category !== filters.category) {
            return false;
          }

          // Date range filter
          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            const expenseDate = new Date(expense.date);
            if (expenseDate < startDate) {
              return false;
            }
          }

          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // Include the entire end date
            const expenseDate = new Date(expense.date);
            if (expenseDate > endDate) {
              return false;
            }
          }

          // Search text filter (note and category)
          if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            const noteMatch = expense.note?.toLowerCase().includes(searchLower) || false;
            const categoryMatch = expense.category.toLowerCase().includes(searchLower);
            if (!noteMatch && !categoryMatch) {
              return false;
            }
          }

          return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    );
  }

  private calculateTotalAmount(): Observable<number> {
    return this.filteredExpenses$.pipe(
      map(expenses => expenses.reduce((total, expense) => total + expense.amount, 0))
    );
  }

  private calculateExpenseCount(): Observable<number> {
    return this.filteredExpenses$.pipe(
      map(expenses => expenses.length)
    );
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  onDeleteExpense(expenseId: string): void {
    this.confirmationDialog.confirm({
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.expenseService.deleteExpense(expenseId).subscribe({
          next: (success) => {
            if (success) {
              this.expenseState.deleteExpense(expenseId);
            }
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
            // Could show another dialog for errors, but for now just log
          }
        });
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  trackByExpenseId(index: number, expense: Expense): string {
    return expense.id;
  }
}
