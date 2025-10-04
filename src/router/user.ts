// Importações com Lazy Loading usando importação dinâmica
const Login = () => import("@/pages/auth/Login.vue");
const SignUp = () => import("@/pages/auth/SignUp.vue");
const ForgotPassword = () => import("@/pages/auth/ForgotPassword.vue");
const ConfirmAccount = () => import("@/pages/auth/ConfirmAccount.vue");
const ResetPassword = () => import("@/pages/auth/ResetPassword.vue");

export default [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUp,
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: ForgotPassword,
    },
    {
        path: '/confirm-account',
        name: 'confirmAccount',
        component: ConfirmAccount,
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: ResetPassword,
    },
];
