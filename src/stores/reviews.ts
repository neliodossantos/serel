import {defineStore} from "pinia";
import {ReviewService} from "@/services/ReviewService";

export const useReviewStore = defineStore('review', () =>{
    const reviewService = new ReviewService();

    async function createReview(data: any){
        try {
            const response = await reviewService.create(data);
            return { message: 'Avaliação criada com sucesso!' , success : true };
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    async function getAll(data : any){
        try {
            const response = await reviewService.findAll(data);
            if(response.status === 400){
                return { data : null , success : false };
            }
            return { data : response , success : true };
        }catch (e) {
            const error = e as ApiError;
            return { data : null , success : false };
        }
    }

    async function getOne(data:any){
        try {
            const response = await reviewService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    async function getRatingByCompanyId(data:any) {
        try {
            const response = await reviewService.findRatingByCompanyId(data);
            return { data : response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    async function usefulReview(data:any) {
        try {
            const response = await reviewService.usefulReview(data);
            return { data : response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    async function getfulReview(data:any) {
        try {
            const response = await reviewService.getfulReview(data);
            return { data : response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }
    
    async function findAllReviewByUser(data:any) {
        try {
            const response = await reviewService.findAll(data);
            return { data : response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    async function updateStatus(data:any) {
        try {
            const response = await reviewService.updateStatus(data);
            return { message: 'Status atualizado com sucesso!' , success : true };
        } catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Erro ao atualizar status!' , success : false };
        }
    }

    return { getAll , getOne , createReview , getRatingByCompanyId , usefulReview , getfulReview , findAllReviewByUser , updateStatus };
});
