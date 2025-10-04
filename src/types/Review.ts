export interface Review {
    id: string;
    companyId: string;
    userId: string;
    status: "in_review" | "approved" | "rejected";
    score: number;
    recommend: boolean;
    employeeType: "Ex-employee" | "Employee";
    jobTitle: string;
    reviewTitle: string;
    usefulRate: {
        useful: number;
        notUseful : number;
    };
    comment: {
        comment: string;
        positiveAspects: string;
        negativeAspects: string;
    };
    period: {
        from: string;
        to: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface isRecommendReviewResponse {
    reviewId: string | undefined,
    userId: string | undefined,
    isRecommend: boolean 
}