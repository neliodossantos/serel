export interface Salary {
    userId: string;
    companyId: string;
    positionRoleId: string;
    positionLevel: "Junior" | "Medium" | "Senior";
    totalExperience: number;
    companyExperience: number;
    employeeType: "Ex-employee" | "Employee";
    salaryAmount: number;
    period: {
        from: string;
        to: string;
    };
    createdAt: string;
    updatedAt: string;
}