import {AxiosHttpClient} from "@/services/AxiosHttpClient";

export class ContactService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async submitContact (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/contact',data);
        }catch (e) {
            throw e;
        }
    };
}