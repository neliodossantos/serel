import { type App } from 'vue';
import { initializeInterceptors } from '@/services/interceptors';
import { handleApiError, isConnected, monitorConnectivity } from '@/utils/api';

/**
 * Plugin Vue para gerenciamento de erros e conectividade
 */
export default {
  install: (app: App) => {
    // Inicializar interceptores Axios
    initializeInterceptors();
    // Fornecer métodos globais para componentes Vue
    app.config.globalProperties.$isConnected = isConnected;
    app.config.globalProperties.$handleApiError = handleApiError;

    // Configurar manipulador de erros global
    app.config.errorHandler = (err: unknown, instance: any, info: string) => {
      // Registrar erro no console
      // Aqui você pode implementar um serviço de log de erros
      // ou enviar o erro para um serviço de monitoramento
    };
    // Monitorar conectividade e emitir eventos
    const eventBus = app.config.globalProperties.$eventBus;
    if (eventBus) {
      const cleanupMonitor = monitorConnectivity(
        // Callback quando ficar online
        () => {
          eventBus.emit('connectivity:online');
        },
        // Callback quando ficar offline
        () => {
          eventBus.emit('connectivity:offline');
        }
      );
      // Limpar monitoramento quando a aplicação for desmontada
      // Isso não é facilmente acessível em um plugin, mas é uma boa prática mencionar
      // Em um componente real, você chamaria cleanupMonitor() no hook onUnmounted
    }
  }
};
