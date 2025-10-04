import {defineStore} from "pinia";
import {ContactService} from "@/services/ContactService";

export const useContactStore = defineStore('contact', () =>{
    const contactService = new ContactService();

    async function submitContact(data: any){
        try {
            const response = await contactService.submitContact(data);
            if(response.id !== null){
                return { message: 'Obrigado por contactar , iremos responder em breve!' , success : true };
            }else{
                return { message: 'Ocorreu um erro, tente mais tarde.' , success : false };
            }
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }
    return { submitContact }
});
