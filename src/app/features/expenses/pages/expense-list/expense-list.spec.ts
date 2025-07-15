import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';

import { ExpenseListComponent } from './expense-list';
import { ExpenseService } from '../../../../core/services/expense';
import { ExpenseStateService } from '../../../../core/services/expense-state';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
import { Expense, ExpenseCategory } from '../../../../core/models/expense.interface';

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;
  let mockExpenseService: jasmine.SpyObj<ExpenseService>;
  let mockExpenseStateService: jasmine.SpyObj<ExpenseStateService>;
  let mockConfirmationDialogService: jasmine.SpyObj<ConfirmationDialogService>;
  let mockExpensesSubject: BehaviorSubject<Expense[]>;

  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 25.99,
      category: ExpenseCategory.FOOD,
      date: new Date('2025-07-14'),
      note: 'Lunch',
      createdAt: new Date('2025-07-14')
    },
    {
      id: '2',
      amount: 85.50,
      category: ExpenseCategory.TRANSPORTATION,
      date: new Date('2025-07-13'),
      note: 'Gas',
      createdAt: new Date('2025-07-13')
    },
    {
      id: '3',
      amount: 1200.00,
      category: ExpenseCategory.HOUSING,
      date: new Date('2025-07-12'),
      note: 'Rent',
      createdAt: new Date('2025-07-12')
    }
  ];

  beforeEach(async () => {
    mockExpensesSubject = new BehaviorSubject<Expense[]>(mockExpenses);
    const expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['deleteExpense']);
    const expenseStateServiceSpy = jasmine.createSpyObj('ExpenseStateService', ['getTotalExpenses', 'deleteExpense'], {
      expenses$: mockExpensesSubject.asObservable()
    });
    const confirmationDialogServiceSpy = jasmine.createSpyObj('ConfirmationDialogService', ['confirm']);

    await TestBed.configureTestingModule({
      declarations: [ExpenseListComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: ExpenseStateService, useValue: expenseStateServiceSpy },
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    mockExpenseService = TestBed.inject(ExpenseService) as jasmine.SpyObj<ExpenseService>;
    mockExpenseStateService = TestBed.inject(ExpenseStateService) as jasmine.SpyObj<ExpenseStateService>;
    mockConfirmationDialogService = TestBed.inject(ConfirmationDialogService) as jasmine.SpyObj<ConfirmationDialogService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all categories', () => {
    expect(component.categories).toEqual(Object.values(ExpenseCategory));
  });

  it('should initialize filter form with empty values', () => {
    expect(component.filterForm.get('category')?.value).toBe('');
    expect(component.filterForm.get('startDate')?.value).toBe('');
    expect(component.filterForm.get('endDate')?.value).toBe('');
    expect(component.filterForm.get('searchText')?.value).toBe('');
  });

  it('should filter expenses by category', (done) => {
    component.filterForm.patchValue({ category: ExpenseCategory.FOOD });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(1);
      expect(filteredExpenses[0].category).toBe(ExpenseCategory.FOOD);
      done();
    });
  });

  it('should filter expenses by search text in note', (done) => {
    component.filterForm.patchValue({ searchText: 'lunch' });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(1);
      expect(filteredExpenses[0].note).toContain('Lunch');
      done();
    });
  });

  it('should filter expenses by search text in category', (done) => {
    component.filterForm.patchValue({ searchText: 'food' });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(1);
      expect(filteredExpenses[0].category).toBe(ExpenseCategory.FOOD);
      done();
    });
  });

  it('should filter expenses by start date', (done) => {
    component.filterForm.patchValue({ startDate: '2025-07-13' });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(2); // Only expenses from 2025-07-13 onwards
      expect(filteredExpenses.every(exp => new Date(exp.date) >= new Date('2025-07-13'))).toBeTruthy();
      done();
    });
  });

  it('should filter expenses by end date', (done) => {
    component.filterForm.patchValue({ endDate: '2025-07-13' });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(2); // Only expenses up to 2025-07-13
      expect(filteredExpenses.every(exp => new Date(exp.date) <= new Date('2025-07-13'))).toBeTruthy();
      done();
    });
  });

  it('should filter expenses by date range', (done) => {
    component.filterForm.patchValue({ 
      startDate: '2025-07-13', 
      endDate: '2025-07-14' 
    });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(2); // Only expenses in range
      done();
    });
  });

  it('should combine multiple filters', (done) => {
    component.filterForm.patchValue({ 
      category: ExpenseCategory.FOOD,
      startDate: '2025-07-14'
    });

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(1);
      expect(filteredExpenses[0].category).toBe(ExpenseCategory.FOOD);
      expect(new Date(filteredExpenses[0].date) >= new Date('2025-07-14')).toBeTruthy();
      done();
    });
  });

  it('should sort expenses by date (newest first)', (done) => {
    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses[0].date >= filteredExpenses[1].date).toBeTruthy();
      expect(filteredExpenses[1].date >= filteredExpenses[2].date).toBeTruthy();
      done();
    });
  });

  it('should calculate total amount correctly', (done) => {
    component.totalAmount$.subscribe(total => {
      const expectedTotal = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      expect(total).toBe(expectedTotal);
      done();
    });
  });

  it('should calculate expense count correctly', (done) => {
    component.expenseCount$.subscribe(count => {
      expect(count).toBe(mockExpenses.length);
      done();
    });
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({
      category: ExpenseCategory.FOOD,
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      searchText: 'test'
    });

    component.clearFilters();

    expect(component.filterForm.get('category')?.value).toBeNull();
    expect(component.filterForm.get('startDate')?.value).toBeNull();
    expect(component.filterForm.get('endDate')?.value).toBeNull();
    expect(component.filterForm.get('searchText')?.value).toBeNull();
  });

  it('should format date correctly', () => {
    const testDate = new Date('2025-07-14');
    const formattedDate = component.formatDate(testDate);
    expect(formattedDate).toBe('Jul 14, 2025');
  });

  it('should return correct category colors', () => {
    expect(component.getCategoryColor(ExpenseCategory.FOOD)).toBe('#16a34a');
    expect(component.getCategoryColor(ExpenseCategory.TRANSPORTATION)).toBe('#2563eb');
    expect(component.getCategoryColor(ExpenseCategory.HOUSING)).toBe('#dc2626');
    expect(component.getCategoryColor(ExpenseCategory.UTILITIES)).toBe('#ca8a04');
    expect(component.getCategoryColor(ExpenseCategory.ENTERTAINMENT)).toBe('#8b5cf6');
    expect(component.getCategoryColor(ExpenseCategory.SHOPPING)).toBe('#ec4899');
    expect(component.getCategoryColor(ExpenseCategory.HEALTHCARE)).toBe('#14b8a6');
    expect(component.getCategoryColor(ExpenseCategory.OTHER)).toBe('#6b7280');
  });

  it('should track expenses by id', () => {
    const expense = mockExpenses[0];
    const trackResult = component.trackByExpenseId(0, expense);
    expect(trackResult).toBe(expense.id);
  });

  it('should handle empty expense list', () => {
    mockExpensesSubject.next([]);
    fixture.detectChanges();

    component.filteredExpenses$.subscribe(filteredExpenses => {
      expect(filteredExpenses.length).toBe(0);
    });

    component.totalAmount$.subscribe(total => {
      expect(total).toBe(0);
    });

    component.expenseCount$.subscribe(count => {
      expect(count).toBe(0);
    });
  });

  it('should handle delete expense with confirmation', () => {
    mockConfirmationDialogService.confirm.and.returnValue(of(true));
    mockExpenseService.deleteExpense.and.returnValue(of(true));

    component.onDeleteExpense('test-id');

    expect(mockConfirmationDialogService.confirm).toHaveBeenCalledWith({
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    expect(mockExpenseService.deleteExpense).toHaveBeenCalledWith('test-id');
    expect(mockExpenseStateService.deleteExpense).toHaveBeenCalledWith('test-id');
  });

  it('should not delete expense if user cancels confirmation', () => {
    mockConfirmationDialogService.confirm.and.returnValue(of(false));

    component.onDeleteExpense('test-id');

    expect(mockConfirmationDialogService.confirm).toHaveBeenCalled();
    expect(mockExpenseService.deleteExpense).not.toHaveBeenCalled();
    expect(mockExpenseStateService.deleteExpense).not.toHaveBeenCalled();
  });

  it('should handle delete expense error', () => {
    spyOn(console, 'error');
    mockConfirmationDialogService.confirm.and.returnValue(of(true));
    mockExpenseService.deleteExpense.and.returnValue(of(false));

    component.onDeleteExpense('test-id');

    expect(mockExpenseService.deleteExpense).toHaveBeenCalledWith('test-id');
    expect(mockExpenseStateService.deleteExpense).not.toHaveBeenCalled();
  });

  it('should update filtered expenses when expense list changes', (done) => {
    const newExpenses = [...mockExpenses, {
      id: '4',
      amount: 50.00,
      category: ExpenseCategory.ENTERTAINMENT,
      date: new Date('2025-07-15'),
      note: 'Movie',
      createdAt: new Date('2025-07-15')
    }];

    // Subscribe to filtered expenses
    component.filteredExpenses$.subscribe(filteredExpenses => {
      if (filteredExpenses.length === 4) {
        expect(filteredExpenses.length).toBe(4);
        done();
      }
    });

    // Update the expenses
    mockExpensesSubject.next(newExpenses);
  });
});
