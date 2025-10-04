import {AxiosHttpClient} from "@/services/AxiosHttpClient";
import type {Review} from "@/types/Review";

export class ReviewService {
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
    async create (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/review/create',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findAll (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/review/getMany',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findOne (data:any) : Promise<any>{
        try {
            return this.httpClient.post<Review>('/api/review/getOne',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async findRatingByCompanyId (data:any) : Promise<Rating>{
        try {
            return this.httpClient.post<Rating>('/api/review/getGroupedBy',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    };
    async usefulReview (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('api/review/recommend',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getfulReview (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('api/review/getRecommend',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }

    async updateStatus (data:any) : Promise<any>{
        try {
            return this.httpClient.post<any>('/api/review/updateStatus',data);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }

}