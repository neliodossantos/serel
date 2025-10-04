import {defineStore} from "pinia";
import {onMounted, ref, watchEffect} from "vue";
import {UserService} from "@/services/UserService";
import type {User} from "@/types/User";
import {jwtDecode} from "jwt-decode";
import {useRoute} from "vue-router";
import type {DecodeUser} from "@/types/DecodeUser";

export const useUserStore = defineStore('user', () =>{
    const userService = new UserService();
    const route = useRoute();
    const token = ref(<string>localStorage.getItem('token'));
    const resetPasswordToken = ref(<string>localStorage.getItem('resetPasswordToken') || '');
    const user = ref(<DecodeUser | null>decodeToken(token.value));

    watchEffect(() => {
        localStorage.setItem('token', token.value || '');
    });
    onMounted(() => {
        window.addEventListener("storage", () => {
            token.value = <string>localStorage.getItem('token');
        });
    });

    async function login(user: User){
        try {
            const data = {email: user.email , password: user.password };
            const response = await userService.login(data);
            localStorage.setItem('token', response.accessToken);
            token.value = response.accessToken;
            return { message: 'Logado com Sucesso!' , success : true };
        }catch (e) {
            console.log(e);
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    async function signup(user: User){
        try {
            const data = {email: user.email , password: user.password , role : 'enduser'};
            const response = await userService.signup(data);
            localStorage.setItem('token', response.accessToken);
            token.value = response.accessToken;
            return { message: response.data?.message || 'Conta criada com sucesso!' , success : true };
        }catch (e) {
            console.log(e);
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    function isLogged(){
        return !!token.value;
    }
    function decodeToken(token : string) : DecodeUser | null {
        try {
            return jwtDecode(token);
        }catch (e) {
            return null;
        }
    }
    async function forgetPassword(email:string){
        try {
            const serverDomain = 'https://www.serel.ao/reset-password/';
            const data = { email , serverDomain };
            const response = await userService.forgetPassword(data);
            localStorage.setItem('resetPasswordToken', response.resetPasswordToken);
            return { message: 'Enviamos um link no seu email para confirmar a conta!' , success : true };
        }catch (e) {
            console.log(e);
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    async function resetPassword( user : User ){
        try {
            const data = { password: user.password , confirmPassword : user.confirmPassword , resetPasswordToken : resetPasswordToken.value };
            const response = await userService.resetPassword(data);
            return { message: 'Conta recuperada com sucesso!' , success : true };
        }catch (e) {
            console.log(e);
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    function getUrlQueryToken(){
        if(route.query.token){
            return route.query.token;
        }
        return null;
    }
    function getUser(){
        return user.value;
    }
    async function isValidResetPasswordToken(){
        try {
            const urlResetTokenPassword = getUrlQueryToken() as string;
            if(urlResetTokenPassword !== null){
                setResetPasswordToken(urlResetTokenPassword);
            }
            const data = { resetPasswordToken: resetPasswordToken.value }
            const response = await userService.isValidResetPasswordToken(data);
            return response.isValid;
        }catch (e) {
            return false;
        }
    }
    function isValidToken(): boolean {
        const decode = decodeToken(token.value);
        if(decode){
            return decode.exp * 1000 > Date.now();
        }
        return false;
    }
    function setResetPasswordToken(value: string){
        resetPasswordToken.value = value;
        localStorage.setItem('resetPasswordToken', value);
    }
    function logout(){
        if(token){
            localStorage.removeItem('token');
			window.location.href = '/';
        }
    }
    return { login, signup , isLogged  , isValidToken,  logout , getUser , token , forgetPassword , getUrlQueryToken , resetPassword , isValidResetPasswordToken , setResetPasswordToken };
});
