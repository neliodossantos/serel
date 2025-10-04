import {AxiosHttpClient} from "@/services/AxiosHttpClient";

export class AreaPositionService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async findAll (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/api/position/getMany',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findOne (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/api/position/getOne',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
}