(() => {
  // Función para cargar React y ReactDOM
  const loadScript = (src) => {
    console.log('Cargando script:', src);
    return new Promise((resolve, reject) => {
      if (src.includes('react.production.min.js') && window.React) {
        console.log('React ya está cargado, omitiendo carga');
        resolve();
        return;
      }
      if (src.includes('react-dom.production.min.js') && window.ReactDOM) {
        console.log('ReactDOM ya está cargado, omitiendo carga');
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        console.log('Script cargado exitosamente:', src);
        resolve();
      };
      script.onerror = (error) => {
        console.error('Error cargando script:', src, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  // Función para cargar estilos
  const loadStyles = () => {
    console.log('Cargando estilos...');
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://www.bitflow.site/widget.css';
      link.onload = () => {
        console.log('Estilos cargados exitosamente');
        resolve();
      };
      link.onerror = (error) => {
        console.error('Error cargando estilos:', error);
        resolve(); // Resolvemos incluso con error para no bloquear
      };
      document.head.appendChild(link);
    });
  };

  // Función para inicializar el widget
  const initWidget = async () => {
    try {
      console.log('Iniciando carga de dependencias...');
      
      // Cargar React primero
      await loadScript('https://www.unpkg.com/react@18/umd/react.production.min.js');
      console.log('React cargado, verificando:', !!window.React);
      
      // Luego ReactDOM
      await loadScript('https://www.unpkg.com/react-dom@18/umd/react-dom.production.min.js');
      console.log('ReactDOM cargado, verificando:', !!window.ReactDOM);

      // Cargar el bundle del widget
      await loadScript('https://www.bitflow.site/widget.bundle.js');
      console.log('Bundle del widget cargado, verificando renderBitflowWidget:', !!window.renderBitflowWidget);
      
      // Cargar estilos
      await loadStyles();

      // Buscar todos los elementos widget
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      console.log('Widgets encontrados:', widgets.length);
      
      widgets.forEach((widget, index) => {
        try {
          console.log(`Procesando widget ${index + 1}/${widgets.length}`);
          const config = widget.dataset.config ? JSON.parse(widget.dataset.config) : {};
          console.log('Config del widget:', config);
          
          if (typeof window.renderBitflowWidget !== 'function') {
            throw new Error('renderBitflowWidget no está disponible');
          }
          
          // Limpiar el contenedor antes de renderizar
          widget.innerHTML = '';
          
          // Renderizar el widget usando la función global definida en widget.bundle.js
          window.renderBitflowWidget(widget, config);
          console.log(`Widget ${index + 1} renderizado exitosamente`);
        } catch (parseError) {
          console.error(`Error procesando widget ${index + 1}:`, parseError);
        }
      });

    } catch (error) {
      console.error('Error inicializando Bitflow Widget:', error);
    }
  };

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})(); 