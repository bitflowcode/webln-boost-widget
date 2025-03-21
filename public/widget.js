(() => {
  // Función para cargar React y ReactDOM
  const loadScript = (src) => {
    console.log('Cargando script:', src);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.bitflow.site/widget.css';
    link.onload = () => console.log('Estilos cargados exitosamente');
    link.onerror = (error) => console.error('Error cargando estilos:', error);
    document.head.appendChild(link);
  };

  // Función para inicializar el widget
  const initWidget = async () => {
    try {
      console.log('Iniciando carga de dependencias...');
      
      // Cargar React primero
      await loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
      console.log('React cargado, verificando:', !!window.React);
      
      // Luego ReactDOM
      await loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
      console.log('ReactDOM cargado, verificando:', !!window.ReactDOM);

      // Cargar el bundle del widget
      await loadScript('https://www.bitflow.site/widget.bundle.js');
      console.log('Bundle del widget cargado, verificando renderBitflowWidget:', !!window.renderBitflowWidget);
      
      // Cargar estilos
      loadStyles();

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