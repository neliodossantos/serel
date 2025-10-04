import {defineStore} from "pinia";
import {AreaPositionService} from "@/services/AreaPositionService";

export const useAreaPositionStore = defineStore('areaPosition', () =>{
    const areaPositionService = new AreaPositionService();

    async function getAll(data : any){
        try {
            const response = await areaPositionService.findAll(data);
            if(response.status === 400){
                return { data : null , success : false };
            }
            console.log(response);
            return { data : response , success : true };
        }catch (e) {
            const error = e as ApiError;
            return { data : null , success : false };
        }
    }

    async function getOne(data:any){
        try {
            const response = await areaPositionService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    return { getAll , getOne  };
});
