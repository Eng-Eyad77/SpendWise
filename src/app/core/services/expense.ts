import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Expense } from '../models/expense.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private mockDelay = 300; // Simulate network delay

  // Mock API calls
  getExpenses(): Observable<Expense[]> {
    return of([]).pipe(delay(this.mockDelay));
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Observable<Expense> {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    return of(newExpense).pipe(delay(this.mockDelay));
  }

  deleteExpense(expenseId: string): Observable<boolean> {
    // Simulate API call to delete expense
    return of(true).pipe(delay(this.mockDelay));
  }
}
