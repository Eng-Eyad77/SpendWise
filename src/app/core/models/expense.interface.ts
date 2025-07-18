export enum ExpenseCategory {
    FOOD = 'Food',
    TRANSPORTATION = 'Transportation',
    HOUSING = 'Housing',
    UTILITIES = 'Utilities',
    ENTERTAINMENT = 'Entertainment',
    SHOPPING = 'Shopping',
    HEALTHCARE = 'Healthcare',
    OTHER = 'Other'
}

export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    date: Date;
    note?: string;
    createdAt: Date;
}

