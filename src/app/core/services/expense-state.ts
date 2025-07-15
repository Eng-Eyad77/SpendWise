import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense, ExpenseCategory } from '../models/expense.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseStateService {
  private expenses = new BehaviorSubject<Expense[]>(this.getSampleData());
  expenses$ = this.expenses.asObservable();

  updateExpenses(expenses: Expense[]): void {
    this.expenses.next(expenses);
  }

  addExpense(expense: Expense): void {
    const currentExpenses = this.expenses.value;
    this.expenses.next([expense, ...currentExpenses]);
  }

  deleteExpense(expenseId: string): void {
    const currentExpenses = this.expenses.value;
    const updatedExpenses = currentExpenses.filter(expense => expense.id !== expenseId);
    this.expenses.next(updatedExpenses);
  }

  getTotalExpenses(): Observable<number> {
    return new Observable<number>(observer => {
      this.expenses$.subscribe(expenses => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        observer.next(total);
      });
    });
  }

  private getSampleData(): Expense[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return [
      {
        id: '1',
        amount: 45.99,
        category: ExpenseCategory.FOOD,
        date: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000), // Today
        note: 'Lunch at downtown restaurant',
        createdAt: new Date(today.getTime() - 0 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        amount: 85.50,
        category: ExpenseCategory.TRANSPORTATION,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        note: 'Gas for the car',
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        amount: 1200.00,
        category: ExpenseCategory.HOUSING,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        note: 'Monthly rent payment',
        createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        amount: 156.75,
        category: ExpenseCategory.UTILITIES,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        note: 'Electricity and water bill',
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        amount: 89.99,
        category: ExpenseCategory.SHOPPING,
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        note: 'New workout clothes',
        createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        amount: 28.50,
        category: ExpenseCategory.ENTERTAINMENT,
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        note: 'Movie tickets',
        createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '7',
        amount: 125.00,
        category: ExpenseCategory.HEALTHCARE,
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        note: 'Doctor visit copay',
        createdAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: '8',
        amount: 67.30,
        category: ExpenseCategory.FOOD,
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        note: 'Grocery shopping',
        createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '9',
        amount: 15.99,
        category: ExpenseCategory.OTHER,
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        note: 'Coffee shop',
        createdAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        id: '10',
        amount: 299.99,
        category: ExpenseCategory.SHOPPING,
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        note: 'New headphones for work',
        createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
      }
    ];
  }
}
