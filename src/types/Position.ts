export interface Salary {
    numberOfReviews: number;
    salarySum: number;
    average: number | null;
    highestSalary: number;
    lowestSalary: number;
}

export interface Position {
    id: string;
    title: string;
    area: string;
    companyId: string;
    salary: Salary;
    createdAt: string;
    updatedAt: string;
}
