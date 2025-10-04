import type {httpClient} from "@/services/httpClient";
import axios, {type AxiosRequestConfig, type AxiosResponse} from 'axios';

export class AxiosHttpClient implements httpClient {

    private axiosInstance  = axios.create({
        baseURL: 'https://serel-backend.onrender.com/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    constructor() {
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if(token){
                config.headers.Authorization = `Beared ${token}`;
            }
            return config;
        })
    }

    async get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.axiosInstance.get(url,options);
        return response.data;
    }

    async post<T>(url: string, body: any, options?: AxiosRequestConfig): Promise<T> {
        const response : AxiosResponse<T> = await this.axiosInstance.post(url, body, options);
        return response.data;
    }

    async put<T>(url: string, body: any, options?: AxiosRequestConfig): Promise<T> {
        const response : AxiosResponse = await this.axiosInstance.put(url, body, options);
        return response.data;
    }
    async delete<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
        const response : AxiosResponse = await this.axiosInstance.delete(url, options);
        return response.data;
    }
    async patch<T>(url: string , body : any , options? : AxiosRequestConfig): Promise<T> {
        const response : AxiosResponse = await this.axiosInstance.patch(url, body , options);
        return response.data;
    }
}
