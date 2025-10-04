import {defineStore} from "pinia";
import {SalaryService} from "@/services/SalaryService";

export const useSalaryStore = defineStore('salary', () =>{
    const salaryService = new SalaryService();

    async function getAll(data : any){
        try {
            const response = await salaryService.findAll(data);
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
            const response = await salaryService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    async function createSalary(data : any){
        try {
            const response = await salaryService.create(data);
            return { message: 'Avaliação de salário foi feita com sucesso!' , success : true };
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }

    return { getAll , getOne , createSalary };
});
