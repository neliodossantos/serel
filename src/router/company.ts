// Importações com Lazy Loading usando importação dinâmica
const ListCompanies = () => import("@/pages/companies/FilterCompany.vue");
const OverviewCompany = () => import("@/pages/companies/overview/OverviewCompany.vue");
const CompanyValuation = () => import("@/pages/companies/review/CompanyReviews.vue");
const CompanyReviewForm = () => import("@/pages/companies/review/CompanyReviewForm.vue");
const CompanySalaryForm = () => import("@/pages/companies/salary/CompanySalaryForm.vue");
const CompanySalary = () => import("@/pages/companies/salary/CompanySalary.vue");
const GeneralReviewCompany = () => import("@/pages/companies/GeneralReviewCompany.vue");
const OverviewDetailsReview = () => import("@/pages/companies/overview/OverviewDetailsReview.vue");
const CreateCompany = () => import("@/pages/companies/CreateCompany.vue");
const AddCompany = () => import("@/pages/companies/AddCompany.vue");

export default [
    {
        path: '/add/company',
        name: 'add-company',
        component: AddCompany,
        meta: {requiresAuth: true},
    },
    {
        path: '/company/create',
        name: 'create-company',
        component: CreateCompany,
        meta: {requiresAuth: true},
    },
    {
        path: '/companies/salaries/filter',
        name: 'list-companies-salaries',
        component: ListCompanies,
    },
    {
        path: '/overview/company/:companyId',
        name: 'company-overview',
        component: OverviewCompany,
        meta: {requiresAuth: true}
    },
    {
        path: '/reviews/company/:companyId',
        name: 'company-reviews',
        component: CompanyValuation,
        meta: {requiresAuth: true}
    },
    {
        path: '/company/:companyId/review',
        name: 'company-form-review',
        component: CompanyReviewForm,
        meta: {requiresAuth: true}
    },
    {
        path: '/company/review',
        name: 'company-general-review',
        component: GeneralReviewCompany,
        meta: {requiresAuth: true}
    },
    {
        path: '/overview/review/:id',
        name: 'company-review',
        component: GeneralReviewCompany,
        meta: {requiresAuth: true}
    },
    {
        path: '/overview/review/details/:reviewId',
        name: 'overview-review-details',
        component: OverviewDetailsReview,
    },
    {
        path: '/company/:companyId/salary',
        name: 'company-form-salary',
        component: CompanySalaryForm,
        meta: {requiresAuth: true}
    },
    {
        path: '/salaries/company/:companyId',
        name: 'company-salary',
        component: CompanySalary,
        meta: {requiresAuth: true}
    },
]