import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../../../../core/services/expense';
import { ExpenseStateService } from '../../../../core/services/expense-state';
import { ExpenseCategory } from '../../../../core/models/expense.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.scss'],
  standalone: false
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories = Object.values(ExpenseCategory);
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private expenseState: ExpenseStateService,
    private router: Router
  ) {
    this.expenseForm = this.createForm();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private createForm(): FormGroup {
    return this.fb.group({
      amount: ['', [
        Validators.required, 
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      category: ['', Validators.required],
      date: [this.formatDateForInput(new Date()), Validators.required],
      note: ['', Validators.maxLength(500)]
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.expenseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.expenseForm.value;
      const expenseData = {
        ...formValue,
        date: new Date(formValue.date),
        amount: parseFloat(formValue.amount)
      };

      this.expenseService.addExpense(expenseData)
        .subscribe({
          next: (newExpense) => {
            this.expenseState.addExpense(newExpense);
            this.router.navigate(['/expenses/list']);
          },
          error: (error) => {
            console.error('Error adding expense:', error);
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.expenseForm.controls).forEach(key => {
      const control = this.expenseForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return 'Amount must be greater than 0';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid amount (e.g., 12.34)';
      }
      if (field.errors['maxlength']) {
        return `Note cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      amount: 'Amount',
      category: 'Category',
      date: 'Date',
      note: 'Note'
    };
    return displayNames[fieldName] || fieldName;
  }

  onCancel(): void {
    this.router.navigate(['/expenses/dashboard']);
  }
}
