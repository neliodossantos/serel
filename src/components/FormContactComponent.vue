<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {validators} from "@/utils/validators/validators";
import {useUserStore} from "@/stores/users";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import type {DecodeUser} from "@/types/DecodeUser";
import { useContactStore } from "@/stores/contact";


const toast = useToast();
const isLoading = ref(false);
const userStore = useUserStore();
const contactStore = useContactStore();
const isSubmitted = ref(false);

const contact = reactive({
  name : '',
  email: '' ,
  subject: '',
  message: ''
});

const errors = reactive({
  name : { message : '' , valid : true },
  email: { message : '' , valid : true },
  subject: { message : '' , valid : true },
  message: { message : '' , valid : true }
});

watch(() => contact.name, () => { 
    if(!isSubmitted.value) errors.name = validators.validateName(contact.name); 
    },{ deep: false});
watch(() => contact.email, () => { 
    if(!isSubmitted.value) errors.email = validators.validateEmail(contact.email); 
    },{ deep: false }
);
watch(() => contact.subject, () => {  
    if(!isSubmitted.value) errors.subject = validators.validateSubject(contact.subject); 
    },{ deep: false }
);
watch(() => contact.message, () => {  
    if(!isSubmitted.value)errors.message = validators.validateMessage(contact.message); 
    },{ deep: false }
);

const validateForm = () => {
  errors.name = validators.validateName(contact.name);
  errors.email = validators.validateEmail(contact.email);
  errors.subject = validators.validateSubject(contact.subject);
  errors.message = validators.validateMessage(contact.message);
}


const handleSubmit = async () => {
    try{
        isLoading.value = true;
        validateForm();
        const success = Object.values(errors).every((error) => error.valid);
        if(!success) {
            toast.error('Preencha todos os campos');
            return;
        }
        const response = await contactStore.submitContact(contact);
        if(response.success === false){
            toast.error(response.message);
            return;
        }
        isSubmitted.value = true;
        Object.keys(contact).forEach(key => {
            contact[key as keyof typeof contact] = '';
        });
        Object.keys(errors).forEach(key => {
            const field = key as keyof typeof errors;
            errors[field].message = '';
            errors[field].valid = true;
        });
        toast.success(response.message);
    }catch (e) {
        toast.error("Ocorreu um erro!");
    }finally {
        isLoading.value = false;
    }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="py-5">
      <h2 class="text-xl md:text-3xl font-bold dark:text-white">Entre em Contato Conosco</h2>
      <p class="max-w-[800px] mt-3 text-lg md:text-xl dark:text-gray-300">Tem alguma dúvida, sugestão ou precisa de suporte? Nossa equipe está pronta para ajudar!</p>
      <p class="mb-6 max-w-[800px] text-lg md:text-xl dark:text-gray-300">Preencha o formulário abaixo. Responderemos o mais breve possível.</p>  
      <div class="md:rounded-lg md:border-2 md:border-[#C3C6E5] flex flex-col gap-12 md:px-8 md:py-10">
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Nome</h3>
          <input v-model="contact.name" placeholder="Digite o nome" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.name.valid">{{errors.name.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Email</h3>
          <input v-model="contact.email" placeholder="Digite o email" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.email.valid">{{errors.email.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Assunto</h3>
          <input v-model="contact.subject" placeholder="Digite o assunto..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.subject.valid">{{errors.subject.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Mensagem</h3>
          <textarea v-model="contact.message" placeholder="Escreva sua avaliação detalhada aqui..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent" />
          <span class="text-red-400 mt-1" v-if="!errors.message.valid">{{errors.message.message}}</span>
        </div>
      </div>
      <div class="mt-6 w-full">
        <button type="submit" class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-md font-bold" :class="{'disable' : isLoading }" :disabled="isLoading">
          {{ isLoading ? 'Processando...' : 'Enviar'}}
          <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
        </button>
      </div>
    </div>
  </form>
  <ToastContainer />
</template>
<style scoped>
.disable{
  background-color: #D1E9FF !important;
  color: #98A2B3;
}
</style>