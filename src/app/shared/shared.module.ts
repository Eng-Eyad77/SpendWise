import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog';
import { ExpenseItemComponent } from './components/expense-item/expense-item';
// Temporarily removing chart component until Chart.js is properly configured
// import { ExpenseChartComponent } from './components/expense-chart/expense-chart';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    ExpenseItemComponent
    // ExpenseChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmationDialogComponent,
    ExpenseItemComponent
    // ExpenseChartComponent
  ]
})
export class SharedModule { }
