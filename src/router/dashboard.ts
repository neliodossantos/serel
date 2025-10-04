import UserDashboardIndex from "@/pages/dashboard/user/UserDashboardIndex.vue";

// Importações com Lazy Loading usando importação dinâmica
const ReviewsDashboard = () => import("@/pages/dashboard/ReviewsDashboard.vue");
const DetailsReviewDashboard = () => import("@/pages/dashboard/DetailsReviewDashboard.vue");

export default [
     {
        path: '/user/dashboard',
        name: 'user-dashboard',
        component: UserDashboardIndex,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: ReviewsDashboard,
    },
    {
        path: '/dashboard/review/1',
        name: 'dashboard-review',
        component: DetailsReviewDashboard,
    },
]