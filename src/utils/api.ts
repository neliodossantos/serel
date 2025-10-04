/**
 * Utilitário para gerenciar erros de API e verificação de conectividade
 */

/**
 * Verifica se o dispositivo está conectado à internet
 */
export const isConnected = (): boolean => {
  return navigator.onLine;
};

/**
 * Interface para o objeto de erro da API
 */
export interface ApiError {
  code: number;
  message: string;
  isConnectivity: boolean;
}

/**
 * Processa um erro de API e retorna um objeto formatado
 * @param error Erro capturado
 * @param defaultMessage Mensagem padrão caso não haja mensagem no erro
 */
export const handleApiError = (error: any, defaultMessage: string = 'Ocorreu um erro ao processar sua solicitação.'): ApiError => {
  // Verificar se é um problema de conexão
  if (!navigator.onLine) {
    return {
      code: 0,
      message: 'Sem conexão com a internet. Verifique sua rede e tente novamente.',
      isConnectivity: true
    };
  }

  // Erros do Axios normalmente têm um objeto response
  if (error.response) {
    return {
      code: error.response.status,
      message: error.response.data?.message || defaultMessage,
      isConnectivity: false
    };
  }

  // Erro de timeout ou erro de rede
  if (error.request) {
    return {
      code: 0,
      message: 'Não foi possível conectar ao servidor. Tente novamente mais tarde.',
      isConnectivity: true
    };
  }

  // Outros erros
  return {
    code: 0,
    message: error.message || defaultMessage,
    isConnectivity: false
  };
};

/**
 * Verifica periodicamente a conectividade e executa callbacks quando o status muda
 * @param onOnline Callback executado quando a conexão é estabelecida
 * @param onOffline Callback executado quando a conexão é perdida
 * @param checkInterval Intervalo em milissegundos para verificar a conexão
 */
export const monitorConnectivity = (
  onOnline: () => void,
  onOffline: () => void,
  checkInterval: number = 5000
): () => void => {
  let wasOnline = navigator.onLine;

  const checkConnection = () => {
    const isOnline = navigator.onLine;

    if (isOnline && !wasOnline) {
      onOnline();
    } else if (!isOnline && wasOnline) {
      onOffline();
    }

    wasOnline = isOnline;
  };

  // Adicionar event listeners padrão
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Configurar verificação periódica
  const intervalId = setInterval(checkConnection, checkInterval);

  // Retornar função de limpeza
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
    clearInterval(intervalId);
  };
};
