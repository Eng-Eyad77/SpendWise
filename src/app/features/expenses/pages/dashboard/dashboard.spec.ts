import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard';
import { ExpenseStateService } from '../../../../core/services/expense-state';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockExpenseStateService: jasmine.SpyObj<ExpenseStateService>;

  beforeEach(async () => {
    mockExpenseStateService = jasmine.createSpyObj('ExpenseStateService', ['getTotalExpenses'], {
      expenses$: of([])
    });
    mockExpenseStateService.getTotalExpenses.and.returnValue(of(0));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: ExpenseStateService, useValue: mockExpenseStateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
