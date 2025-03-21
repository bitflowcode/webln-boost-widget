(() => {
  // Función para cargar React y ReactDOM
  const loadScript = (src) => {
    console.log('Cargando script:', src);
    return new Promise((resolve, reject) => {
      if (src.includes('react.development.js') && window.React) {
        console.log('React ya está cargado, omitiendo carga');
        resolve();
        return;
      }
      if (src.includes('react-dom.development.js') && window.ReactDOM) {
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

  // Función para verificar que una dependencia esté cargada
  const waitForDependency = (name, maxAttempts = 50) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        attempts++;
        if (window[name]) {
          resolve(window[name]);
        } else if (attempts >= maxAttempts) {
          reject(new Error(`Timeout esperando por ${name}`));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  };

  // Función para inicializar el widget
  const initWidget = async () => {
    try {
      console.log('Iniciando carga de dependencias...');
      
      // Cargar React primero
      await loadScript('https://www.unpkg.com/react@18/umd/react.development.js');
      await waitForDependency('React');
      console.log('React cargado y verificado');
      
      // Luego ReactDOM
      await loadScript('https://www.unpkg.com/react-dom@18/umd/react-dom.development.js');
      await waitForDependency('ReactDOM');
      console.log('ReactDOM cargado y verificado');

      // Cargar QRCode
      await loadScript('https://unpkg.com/qrcode.react@3.1.0/lib/index.umd.js');
      console.log('QRCode cargado');

      // Cargar bech32
      await loadScript('https://unpkg.com/bech32@2.0.0/dist/index.umd.js');
      console.log('bech32 cargado');

      // Cargar el bundle del widget
      await loadScript('https://www.bitflow.site/widget.bundle.js');
      await waitForDependency('renderBitflowWidget');
      console.log('Bundle del widget cargado y verificado');
      
      // Cargar estilos
      await loadStyles();

      // Buscar todos los elementos widget
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      console.log('Widgets encontrados:', widgets.length);
      
      widgets.forEach((widget, index) => {
        try {
          console.log(`Procesando widget ${index + 1}/${widgets.length}`);
          
          // Crear un contenedor para el widget
          const container = document.createElement('div');
          container.style.width = '100%';
          container.style.height = '100%';
          container.style.minHeight = '410px';
          widget.innerHTML = '';
          widget.appendChild(container);
          
          // Obtener configuración del widget
          let config = {};
          
          // Intentar obtener config del dataset
          if (widget.dataset.config) {
            try {
              config = JSON.parse(widget.dataset.config);
            } catch (parseError) {
              console.error('Error parseando config del dataset:', parseError);
            }
          }
          
          // Si no hay config en el dataset, intentar obtener de la URL (para iframe)
          if (Object.keys(config).length === 0 && window.location.search) {
            const params = new URLSearchParams(window.location.search);
            config = {
              receiverType: params.get('receiverType') || 'lightning',
              receiver: params.get('receiver'),
              amounts: (params.get('amounts') || '21,100,1000').split(',').map(Number),
              labels: (params.get('labels') || 'Café,Propina,Boost').split(','),
              theme: params.get('theme') || 'orange',
              useCustomImage: params.get('useCustomImage') === 'true',
              image: params.get('image'),
              avatarSeed: params.get('avatarSeed'),
              avatarSet: params.get('avatarSet') || 'set1'
            };
          }
          
          console.log('Config del widget:', config);
          
          try {
            window.renderBitflowWidget(container, config);
            console.log('Renderizado completado mediante renderBitflowWidget');
          } catch (renderError) {
            console.error('Error en el renderizado:', renderError);
            container.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #fee; color: #c00; font-family: Arial; padding: 20px; text-align: center;">Error renderizando el widget</div>';
          }
          
          console.log(`Widget ${index + 1} renderizado exitosamente`);
        } catch (error) {
          console.error(`Error procesando widget ${index + 1}:`, error);
          widget.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #fee; color: #c00; font-family: Arial; padding: 20px; text-align: center;">Error cargando el widget: ${error.message}</div>`;
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