import {defineStore} from "pinia";
import {AreaService} from "@/services/AreaService";

export const useAreaStore = defineStore('area', () =>{
    const areaService = new AreaService();

    async function getAll(data : any){
        try {
            const response = await areaService.findAll(data);
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
            const response = await areaService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    return { getAll , getOne  };
});
