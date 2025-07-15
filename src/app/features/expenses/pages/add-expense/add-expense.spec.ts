import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AddExpenseComponent } from './add-expense';
import { ExpenseService } from '../../../../core/services/expense';
import { ExpenseStateService } from '../../../../core/services/expense-state';
import { ExpenseCategory } from '../../../../core/models/expense.interface';

describe('AddExpenseComponent', () => {
  let component: AddExpenseComponent;
  let fixture: ComponentFixture<AddExpenseComponent>;
  let mockExpenseService: jasmine.SpyObj<ExpenseService>;
  let mockExpenseStateService: jasmine.SpyObj<ExpenseStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['addExpense']);
    const expenseStateServiceSpy = jasmine.createSpyObj('ExpenseStateService', ['addExpense']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AddExpenseComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: ExpenseStateService, useValue: expenseStateServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    mockExpenseService = TestBed.inject(ExpenseService) as jasmine.SpyObj<ExpenseService>;
    mockExpenseStateService = TestBed.inject(ExpenseStateService) as jasmine.SpyObj<ExpenseStateService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.expenseForm).toBeDefined();
    expect(component.expenseForm.get('amount')?.value).toBe('');
    expect(component.expenseForm.get('category')?.value).toBe('');
    expect(component.expenseForm.get('note')?.value).toBe('');
    expect(component.expenseForm.get('date')?.value).toBeTruthy(); // Should have today's date
  });

  it('should have all expense categories available', () => {
    expect(component.categories).toEqual(Object.values(ExpenseCategory));
    expect(component.categories.length).toBe(8);
  });

  it('should validate required fields', () => {
    const amountControl = component.expenseForm.get('amount');
    const categoryControl = component.expenseForm.get('category');

    // Test empty values
    amountControl?.setValue('');
    categoryControl?.setValue('');
    
    expect(amountControl?.hasError('required')).toBeTruthy();
    expect(categoryControl?.hasError('required')).toBeTruthy();
  });

  it('should validate amount minimum value', () => {
    const amountControl = component.expenseForm.get('amount');
    
    amountControl?.setValue('0');
    expect(amountControl?.hasError('min')).toBeTruthy();
    
    amountControl?.setValue('-5');
    expect(amountControl?.hasError('min')).toBeTruthy();
    
    amountControl?.setValue('10.50');
    expect(amountControl?.hasError('min')).toBeFalsy();
  });

  it('should validate amount pattern', () => {
    const amountControl = component.expenseForm.get('amount');
    
    amountControl?.setValue('abc');
    expect(amountControl?.hasError('pattern')).toBeTruthy();
    
    amountControl?.setValue('12.345'); // Too many decimal places
    expect(amountControl?.hasError('pattern')).toBeTruthy();
    
    amountControl?.setValue('12.34');
    expect(amountControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate note max length', () => {
    const noteControl = component.expenseForm.get('note');
    const longNote = 'a'.repeat(501); // 501 characters
    
    noteControl?.setValue(longNote);
    expect(noteControl?.hasError('maxlength')).toBeTruthy();
    
    noteControl?.setValue('Short note');
    expect(noteControl?.hasError('maxlength')).toBeFalsy();
  });

  it('should check if field is invalid correctly', () => {
    const amountControl = component.expenseForm.get('amount');
    
    // Initially untouched and invalid
    expect(component.isFieldInvalid('amount')).toBeFalsy();
    
    // Mark as touched and invalid
    amountControl?.markAsTouched();
    expect(component.isFieldInvalid('amount')).toBeTruthy();
    
    // Set valid value
    amountControl?.setValue('25.99');
    expect(component.isFieldInvalid('amount')).toBeFalsy();
  });

  it('should return correct error messages', () => {
    const amountControl = component.expenseForm.get('amount');
    
    // Required error
    amountControl?.markAsTouched();
    expect(component.getFieldError('amount')).toBe('Amount is required');
    
    // Min error
    amountControl?.setValue('0');
    expect(component.getFieldError('amount')).toBe('Amount must be greater than 0');
    
    // Pattern error
    amountControl?.setValue('abc');
    expect(component.getFieldError('amount')).toBe('Please enter a valid amount (e.g., 12.34)');
  });

  it('should submit form when valid', () => {
    const mockExpense = {
      id: 'test-id',
      amount: 25.99,
      category: ExpenseCategory.FOOD,
      date: new Date(),
      note: 'Test expense',
      createdAt: new Date()
    };

    mockExpenseService.addExpense.and.returnValue(of(mockExpense));

    // Set valid form values
    component.expenseForm.patchValue({
      amount: '25.99',
      category: ExpenseCategory.FOOD,
      date: '2025-07-14',
      note: 'Test expense'
    });

    component.onSubmit();

    expect(mockExpenseService.addExpense).toHaveBeenCalled();
    expect(mockExpenseStateService.addExpense).toHaveBeenCalledWith(mockExpense);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/expenses/list']);
  });

  it('should not submit when form is invalid', () => {
    component.expenseForm.patchValue({
      amount: '', // Invalid - required
      category: ExpenseCategory.FOOD,
      date: '2025-07-14',
      note: 'Test expense'
    });

    component.onSubmit();

    expect(mockExpenseService.addExpense).not.toHaveBeenCalled();
    expect(mockExpenseStateService.addExpense).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.expenseForm.patchValue({
      amount: '', // Invalid
      category: '',
      date: '2025-07-14',
      note: ''
    });

    component.onSubmit();

    expect(component.expenseForm.get('amount')?.touched).toBeTruthy();
    expect(component.expenseForm.get('category')?.touched).toBeTruthy();
  });

  it('should handle submission loading state', () => {
    expect(component.isSubmitting).toBeFalsy();

    const mockExpense = {
      id: 'test-id',
      amount: 25.99,
      category: ExpenseCategory.FOOD,
      date: new Date(),
      note: 'Test expense',
      createdAt: new Date()
    };

    mockExpenseService.addExpense.and.returnValue(of(mockExpense));

    component.expenseForm.patchValue({
      amount: '25.99',
      category: ExpenseCategory.FOOD,
      date: '2025-07-14',
      note: 'Test expense'
    });

    component.onSubmit();
    expect(component.isSubmitting).toBeFalsy(); // Should be reset after completion
  });

  it('should navigate to dashboard on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/expenses/dashboard']);
  });

  it('should format date correctly for input', () => {
    const testDate = new Date(2025, 6, 14); // July 14, 2025
    const formattedDate = component['formatDateForInput'](testDate);
    expect(formattedDate).toBe('2025-07-14');
  });
});
