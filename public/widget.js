(() => {
  // Función para cargar React y ReactDOM
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Función para cargar estilos
  const loadStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.bitflow.site/widget.css';
    document.head.appendChild(link);
  };

  // Función para inicializar el widget
  const initWidget = async () => {
    try {
      // Cargar dependencias
      await Promise.all([
        loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
      ]);

      // Cargar el bundle del widget
      await loadScript('https://www.bitflow.site/widget.bundle.js');
      
      // Cargar estilos
      loadStyles();

      // Buscar todos los elementos widget
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      
      widgets.forEach(widget => {
        const config = widget.dataset.config ? JSON.parse(widget.config) : {};
        
        // Renderizar el widget usando la función global definida en widget.bundle.js
        window.renderBitflowWidget(widget, config);
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