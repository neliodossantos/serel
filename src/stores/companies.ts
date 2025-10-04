import {defineStore} from "pinia";
import {CompanyService} from "@/services/CompanyService";
import type {Company} from "@/types/Company";

export const useCompanyStore = defineStore('company', () =>{
    const companyService = new CompanyService();

    async function createCompany(company : any){
        try {
            const response = await companyService.create(company);
            return { message: 'Empresa adicionada com sucesso!' , success : true , data : response };
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    async function requestCompany(company: any){
        try {
            const response = await companyService.requestCompany(company);
            return { message: 'Empresa adicionada com sucesso!' , success : true , data : response };
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    async function getAll(data : any){
        try {
            const response = await companyService.findAll(data);
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
            const response = await companyService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    return { getAll , getOne, createCompany , requestCompany };
});
