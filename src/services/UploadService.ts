import {AxiosHttpClient} from "@/services/AxiosHttpClient";

export class UploadService {
    private httpClient : AxiosHttpClient;

    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async uploadFile(id: string, formData: FormData) : Promise<any> {
        return await this.httpClient.post<any>(`/api/company/upload/${id}`,formData , {
            headers: { "Content-Type": "multipart/form-data" }
        });
    }
}