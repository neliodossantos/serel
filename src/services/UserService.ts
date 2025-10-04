import {AxiosHttpClient} from "@/services/AxiosHttpClient";
import type {User} from "@/types/User";

export class UserService {
    private httpClient : AxiosHttpClient;

    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async login (user : User) : Promise<any>{
        try {
            return this.httpClient.post<User>('/api/login',user);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async signup (user : User) : Promise<any>{
        try {
            return this.httpClient.post<User>('/api/signup',user);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
    async forgetPassword (data : any) : Promise<any>{
        try {
            console.log(data);
            return this.httpClient.patch<any>('/api/user/forgotpassword',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
    async resetPassword (data : any) : Promise<any>{
        try {
            return this.httpClient.patch<any>('/api/user/resetpassword',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
    async isValidResetPasswordToken(data : any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/api/user/resetpassword/validate', data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
    async isValidToken(token: string) : Promise<any>{
        try {
            return this.httpClient.get<any>(`/user/auth/${token}`);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
}