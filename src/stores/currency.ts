import {defineStore} from "pinia";
import {CurrencyService} from "@/services/CurrencyService";

export const useCurrencyStore  = defineStore('currency', () => {
    const currencyService = new CurrencyService();

    async function convertCurrency( valueAOA: number, value: number = 0, from: string, to: string) {
        try {
            const response = await currencyService.getCurrency(from);
            if(from !== 'AOA' && to === 'AOA'){
                return { value: valueAOA, from: from, currency: to };
            }else{
                if (response.conversion_rates) {
                    const rates = response.conversion_rates;
                    if (rates[to]) {
                        const conversion = value * rates[to];
                        return { value: conversion, from: from, currency: to };
                    }
                }    
            }
            return { error : 'Ocorreu um erro ao converter' };
        } catch (e) {
            return { error: 'Ocorreu um erro ao converter' + e };
        }
    }

    return {convertCurrency}
});