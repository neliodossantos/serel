export const validators = {
    validateName(name: string) {
        if(name === ''){
            return { message: 'Preencha o campo nome ' , valid: false}
        }
        if(name.length < 5){
            return { message: 'O nome deve ter pelo menos 5 caracteres ' , valid: false}
        }
        return { message: '' , valid: true}
    },
    validatePhone(phone: string) {
        if (phone === '') {
            return { message: 'Preencha o campo número de telefone.', valid: false };
        }
        const phoneRegex = /^(\+244)?\s?9\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return { message: 'O número de telefone é inválido. Use o formato correto (ex.: +244 912345678 ou 912345678).', valid: false};
        }
        return { message: '', valid: true };
    },
    validateNIF(nif: string) {
        if (nif === '') {
            return { message: 'Preencha o campo NIF.', valid: false };
        }
        const nifRegex = /^\d{9}$/;
        if (!nifRegex.test(nif)) {
            return { message: 'O NIF deve conter exatamente 9 dígitos numéricos.', valid: false };
        }
        return { message: '', valid: true };
    },
    validateCompanyName(name: string) {
        if (name === '') {
            return { message: 'Preencha o campo nome da empresa.', valid: false };
        }
        const nameRegex = /^[a-zA-ZÀ-ú\s\-\&\.\,\(\)]+$/;
        if (!nameRegex.test(name)) {
            return { message: 'O nome da empresa contém caracteres inválidos.', valid: false };
        }
        if(name.length < 3){
            return { message: 'O nome da empresa deve possuir no mínimo 3 caracteres.', valid: false };
        }
        return { message: '', valid: true };
    },
    validateReviewTitle(title: string) {
        if(title === ''){
            return { message: 'Preencha o campo Título da Avaliação' , valid: false}
        }
        if(title.length > 60){
            return { message: 'No máximo 60 caracteres.' , valid: false}
        }
        return { message: '' , valid: true}
    },
    validateField(value: any , field : string) {
        if(value === ''){
            return { message: `Preencha o campo ${field}` , valid: false}
        }
        if(value === null){
            return { message: `Preencha o campo ${field}` , valid: false}
        }
        return { message: '' , valid: true}
    },
    validateSubject(value: any ) {
        if(value === '' || value === null){
            return { message: `Preencha o campo Assunto` , valid: false}
        }
        if(value.length < 5 ){
            return { message: `O Assunto deve ter pelo menos 5 caracteres ` , valid: false}
        }
        return { message: '' , valid: true}
    },
    validateMessage(value: any ) {
        if(value === '' || value === null){
            return { message: `Preencha o campo Mensagem ` , valid: false}
        }
        if(value.length < 5 ){
            return { message: `A Mensagem deve ter pelo menos 5 caracteres ` , valid: false}
        }
        return { message: '' , valid: true}
    },
    validateNumber(value: any , field : string) {
        if(value === null){
            return { message: `Preencha o campo ${field}` , valid: false}
        }
        if(value <= 0){
            return { message: `O valor do campo ${field} deve ser maior que 0` , valid: false}
        }
        return { message: '' , valid: true}
    },
    validateDate(date: string, field: string){
        if (!date) {
            return { message: `Preencha o campo ${field} no formato (DD/MM/YYYY).`, valid: false };
        }
        const [year, month, day] = date.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        if (inputDate >= today) {
            return { message: `A data no campo ${field} não pode ser futura.`, valid: false };
        }
        return { message: '', valid: true };
    },
    validateRating(value: number) {
        if(value === 0){
            return { message: "Preencha o campo Avaliação da empresa." , valid: false}
        };
        return { message: '' , valid: true}
    },
    validateTypeBoolean(value: any , field : string) {
        if(value === null){
            return { message: `Preencha o campo ${field}` , valid: false}
        };
        return { message: '' , valid: true}
    },
    validatePassword(password: string) {
        if(password === ''){
            return { message: 'Preencha o campo palavra-passe ' , valid: false }
        }
        return { message: '' , valid: true }
    },
    validateConfirmPassword(password: string ,  confirmPassword: string) {
        if(password !== confirmPassword){
            return {message: 'As senhas não coincidem!' , valid: false}
        }
        return {message: '' , valid: true};
    },
    validateDateRange(startDate: string, endDate: string) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        if (start >= end) {
            return { message: 'A data de início não deve ser anterior ou igual à data de fim.' , valid: false }
        }
        if (end > today) {
            return { message: 'A data de termino não pode ser superior à data atual.', valid: false };
        }
        return { message: '' , valid: true }
    },
    validateEmail(email: string) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const isValid = regex.test(email);
        if(email === ''){
            return {message: 'Preencha o campo email' , valid : false};
        }
        if(!isValid){
            return {message: 'Email invalido' , valid : false};
        }
        return {message: '' , valid : true};
    }
}