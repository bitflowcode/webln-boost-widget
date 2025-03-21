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
          
          // Añadir un borde temporal para debugging
          widget.style.border = '2px solid red';
          
          // Añadir un mensaje de carga
          widget.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #333; font-family: Arial;">Cargando Bitflow Widget...</div>';
          
          const config = widget.dataset.config ? JSON.parse(widget.dataset.config) : {};
          console.log('Config del widget:', config);
          
          if (typeof window.renderBitflowWidget !== 'function') {
            throw new Error('renderBitflowWidget no está disponible');
          }
          
          // Intentar renderizar usando ReactDOM.render
          try {
            const WidgetComponent = window.renderBitflowWidget(config);
            console.log('Componente creado:', !!WidgetComponent);
            
            ReactDOM.render(
              WidgetComponent,
              widget,
              () => {
                console.log('Renderizado completado mediante ReactDOM.render');
                // Verificar el contenido después del renderizado
                console.log('Contenido del widget después del renderizado:', widget.innerHTML);
              }
            );
          } catch (renderError) {
            console.error('Error en el renderizado:', renderError);
            
            // Intentar renderizar usando la función directamente como fallback
            try {
              window.renderBitflowWidget(widget, config);
              console.log('Renderizado completado mediante función directa');
              // Verificar el contenido después del renderizado
              console.log('Contenido del widget después del renderizado directo:', widget.innerHTML);
            } catch (fallbackError) {
              console.error('Error en el renderizado fallback:', fallbackError);
            }
          }
          
          console.log(`Widget ${index + 1} renderizado exitosamente`);
        } catch (parseError) {
          console.error(`Error procesando widget ${index + 1}:`, parseError);
          // Mostrar el error en el widget
          widget.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #fee; color: #c00; font-family: Arial; padding: 20px; text-align: center;">Error cargando el widget: ${parseError.message}</div>`;
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