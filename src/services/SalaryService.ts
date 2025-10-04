import {AxiosHttpClient} from "@/services/AxiosHttpClient";
import type {Review} from "@/types/Review";

export class SalaryService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async create (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/salary/create',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findAll (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/salary/getMany',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findOne (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/salary/getOne',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
}