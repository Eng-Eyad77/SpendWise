import { TestBed } from '@angular/core/testing';
import { ExpenseStateService } from './expense-state';
import { Expense, ExpenseCategory } from '../models/expense.interface';

describe('ExpenseStateService', () => {
  let service: ExpenseStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with sample data', (done) => {
    service.expenses$.subscribe(expenses => {
      expect(expenses.length).toBeGreaterThan(0);
      expect(expenses[0].id).toBeDefined();
      expect(expenses[0].amount).toBeDefined();
      expect(expenses[0].category).toBeDefined();
      expect(expenses[0].date).toBeDefined();
      expect(expenses[0].createdAt).toBeDefined();
      done();
    });
  });

  it('should add new expense to the beginning of the list', (done) => {
    const newExpense: Expense = {
      id: 'test-id',
      amount: 99.99,
      category: ExpenseCategory.FOOD,
      date: new Date(),
      note: 'Test expense',
      createdAt: new Date()
    };

    let initialCount = 0;
    service.expenses$.subscribe(expenses => {
      if (initialCount === 0) {
        initialCount = expenses.length;
        service.addExpense(newExpense);
      } else {
        expect(expenses.length).toBe(initialCount + 1);
        expect(expenses[0]).toEqual(newExpense);
        done();
      }
    });
  });

  it('should update expenses list', (done) => {
    const newExpenses: Expense[] = [
      {
        id: '1',
        amount: 50.00,
        category: ExpenseCategory.ENTERTAINMENT,
        date: new Date(),
        note: 'Test',
        createdAt: new Date()
      }
    ];

    service.updateExpenses(newExpenses);

    service.expenses$.subscribe(expenses => {
      expect(expenses).toEqual(newExpenses);
      expect(expenses.length).toBe(1);
      done();
    });
  });

  it('should calculate total expenses correctly', (done) => {
    const testExpenses: Expense[] = [
      {
        id: '1',
        amount: 25.50,
        category: ExpenseCategory.FOOD,
        date: new Date(),
        createdAt: new Date()
      },
      {
        id: '2',
        amount: 74.50,
        category: ExpenseCategory.TRANSPORTATION,
        date: new Date(),
        createdAt: new Date()
      }
    ];

    service.updateExpenses(testExpenses);

    service.getTotalExpenses().subscribe(total => {
      expect(total).toBe(100.00);
      done();
    });
  });

  it('should return zero total for empty expenses', (done) => {
    service.updateExpenses([]);

    service.getTotalExpenses().subscribe(total => {
      expect(total).toBe(0);
      done();
    });
  });

  it('should emit updated total when expenses change', (done) => {
    const initialExpenses: Expense[] = [
      {
        id: '1',
        amount: 50.00,
        category: ExpenseCategory.FOOD,
        date: new Date(),
        createdAt: new Date()
      }
    ];

    service.updateExpenses(initialExpenses);

    let callCount = 0;
    service.getTotalExpenses().subscribe(total => {
      if (callCount === 0) {
        expect(total).toBe(50.00);
        
        // Add another expense
        const newExpense: Expense = {
          id: '2',
          amount: 30.00,
          category: ExpenseCategory.TRANSPORTATION,
          date: new Date(),
          createdAt: new Date()
        };
        service.addExpense(newExpense);
        callCount++;
      } else {
        expect(total).toBe(80.00);
        done();
      }
    });
  });

  it('should maintain chronological order when adding expenses', (done) => {
    const firstExpense: Expense = {
      id: '1',
      amount: 25.00,
      category: ExpenseCategory.FOOD,
      date: new Date('2025-07-13'),
      createdAt: new Date('2025-07-13')
    };

    const secondExpense: Expense = {
      id: '2',
      amount: 50.00,
      category: ExpenseCategory.TRANSPORTATION,
      date: new Date('2025-07-14'),
      createdAt: new Date('2025-07-14')
    };

    service.updateExpenses([firstExpense]);
    service.addExpense(secondExpense);

    service.expenses$.subscribe(expenses => {
      expect(expenses[0]).toEqual(secondExpense); // Newest first
      expect(expenses[1]).toEqual(firstExpense);
      done();
    });
  });

  it('should delete expense by id', (done) => {
    const expenseToDelete: Expense = {
      id: 'delete-test-id',
      amount: 50.00,
      category: ExpenseCategory.FOOD,
      date: new Date(),
      note: 'Expense to delete',
      createdAt: new Date()
    };

    let initialCount = 0;
    service.expenses$.subscribe(expenses => {
      if (initialCount === 0) {
        // First subscription - get initial count and add expense
        initialCount = expenses.length;
        service.addExpense(expenseToDelete);
      } else if (expenses.length === initialCount + 1) {
        // Second subscription - expense was added, now delete it
        expect(expenses.some(e => e.id === 'delete-test-id')).toBeTruthy();
        service.deleteExpense('delete-test-id');
      } else {
        // Third subscription - expense should be deleted
        expect(expenses.length).toBe(initialCount);
        expect(expenses.some(e => e.id === 'delete-test-id')).toBeFalsy();
        done();
      }
    });
  });

  it('should not affect expenses list when deleting non-existent id', (done) => {
    let initialExpenses: Expense[] = [];
    service.expenses$.subscribe(expenses => {
      if (initialExpenses.length === 0) {
        initialExpenses = [...expenses];
        service.deleteExpense('non-existent-id');
      } else {
        expect(expenses.length).toBe(initialExpenses.length);
        expect(expenses).toEqual(initialExpenses);
        done();
      }
    });
  });
});
