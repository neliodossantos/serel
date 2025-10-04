import {defineStore} from "pinia";
import {NewsletterService} from "@/services/NewsletterService";

export const useNewsletterStore = defineStore('newsletter', () =>{
    const newsletter = new NewsletterService();

    async function submitNewsletter(data: any){
        try {
            const response = await newsletter.submitNewsletter(data);
            return { message: 'Obrigado por se inscrever! Você receberá as últimas novidades diretamente no seu e-mail.' , success : true };
        }catch (e) {
            const error = e as ApiError;
            return { message: error.response?.data?.error || 'Ocorreu um erro!' , success : false };
        }
    }

    return {submitNewsletter}
});
