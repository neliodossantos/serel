import {defineStore} from "pinia";
import {UploadService} from "@/services/UploadService";

export const useUploadStore = defineStore('uploadStore', () => {
    const uploadService = new UploadService();

    async function upload( id: string , file: File){
        try {
            const formData = new FormData();
            formData.append("logo", file);
            const response = await uploadService.uploadFile(id,formData);
            return { message:"Upload feito com sucesso!", success : true };
        }catch(e){
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    return {upload};
});