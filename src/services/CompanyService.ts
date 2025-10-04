import {AxiosHttpClient} from "@/services/AxiosHttpClient";
import type {Company} from "@/types/Company";

export class CompanyService {
    private httpClient : AxiosHttpClient;

    constructor() {
        this.httpClient = new AxiosHttpClient();
    }

    async create(company: Company): Promise<any> {
        try {
            return this.httpClient.post("/api/company/create", company);
        }catch (e) {
            throw e;
        }
    }

    async requestCompany(company: Company): Promise<any> {
        try {
            return this.httpClient.post("/request/company", company);
        }catch (e) {
            throw e;
        }
    }

    async findAll (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Company>('/api/company/getMany',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findOne (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Company>('/api/company/getOne',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
}