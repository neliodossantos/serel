import {AxiosHttpClient} from "@/services/AxiosHttpClient";

export class NewsletterService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async submitNewsletter (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/newsletter',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
}