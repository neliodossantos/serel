import axios from 'axios';
import { isConnected } from '@/utils/api';

/**
 * Configura interceptores globais para requisições e respostas Axios
 * Isso centraliza o tratamento de erros e a verificação de conectividade
 */
export const setupInterceptors = () => {
  // Interceptor de requisição
  axios.interceptors.request.use(
    (config) => {
      // Verificar conectividade antes de enviar requisição
      if (!isConnected()) {
        // Rejeitar a requisição se não houver conexão
        return Promise.reject({
          config,
          message: 'Sem conexão com a internet. Verifique sua rede e tente novamente.'
        });
      }

      // Configurações adicionais para as requisições podem ser feitas aqui
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta
  axios.interceptors.response.use(
    (response) => {
      // Processar respostas bem-sucedidas se necessário
      return response;
    },
    (error) => {
      // Detecção de timeout
      if (error.code === 'ECONNABORTED') {
        console.error('A requisição excedeu o tempo limite.');
        // Você pode implementar uma lógica de retry aqui
      }

      // Erros de rede
      if (error.message === 'Network Error') {
        console.error('Erro de rede. Verifique sua conexão.');
      }

      // Erros de servidor
      if (error.response) {
        const { status } = error.response;

        // Tratamento específico para diferentes códigos de status
        switch (status) {
          case 401:
            console.error('Não autorizado. Faça login novamente.');
            // Você pode redirecionar para a página de login aqui
            break;

          case 403:
            console.error('Acesso proibido.');
            break;

          case 404:
            console.error('Recurso não encontrado.');
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            console.error(`Erro de servidor: ${status}`);
            break;

          default:
            console.error(`Erro na requisição: ${status}`);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Inicializa os interceptores na inicialização da aplicação
 */
export const initializeInterceptors = () => {
  setupInterceptors();
  console.log('Interceptores Axios configurados.');
};
