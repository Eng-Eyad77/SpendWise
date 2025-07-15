import { Component, Input } from '@angular/core';
import { Expense, ExpenseCategory } from '../../../core/models/expense.interface';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.html',
  styleUrls: ['./expense-item.scss'],
  standalone: false
})
export class ExpenseItemComponent {
  @Input() expense!: Expense;

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
}
