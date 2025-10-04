import {AxiosHttpClient} from "@/services/AxiosHttpClient";
import type {Area} from "@/types/Area";

export class AreaService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async create (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Area>('/api/area/create',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findAll (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Area>('/api/area/getMany',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findOne (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Area>('/api/area/getOne',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
}