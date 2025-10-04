import {defineStore} from "pinia";
import {RoleService} from "@/services/RoleService";

export const useRoleStore = defineStore('role', () =>{
    const roleService = new RoleService();

    async function getAll(data : any){
        try {
            const response = await roleService.findAll(data);
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
            const response = await roleService.findOne(data);
            return { data: response , success : true };
        } catch (e){
            return { data : null , success : false };
        }
    }

    return { getAll , getOne  };
});
