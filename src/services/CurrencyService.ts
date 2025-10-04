import {AxiosHttpClient} from "@/services/AxiosHttpClient";


interface ExchangeRatesResponse {
    result: string;
    documentation: string;
    terms_of_use: string;
    time_last_update_unix: number;
    time_last_update_utc: string;
    time_next_update_unix: number;
    time_next_update_utc: string;
    base_code: string;
    conversion_rates: Record<string, number>;
}
export class CurrencyService{
    private httpClient : AxiosHttpClient;
    constructor() {
        this.httpClient = new AxiosHttpClient();
    }
     async getCurrency(base = 'AOA'){
        try {
            return await this.httpClient.get(`https://v6.exchangerate-api.com/v6/5947ba66872e2aca2351805a/latest/${base}`) as ExchangeRatesResponse;
        } catch (e){
            console.log(e);
            throw e;
        }
    }
}