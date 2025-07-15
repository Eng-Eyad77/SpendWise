import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ExpensesRoutingModule } from './expenses-routing-module';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AddExpenseComponent } from './pages/add-expense/add-expense';
import { ExpenseListComponent } from './pages/expense-list/expense-list';

@NgModule({
  declarations: [
    DashboardComponent,
    AddExpenseComponent,
    ExpenseListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
