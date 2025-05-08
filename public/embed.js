// public/embed.js

(async function() {
  // Función para cargar un script y esperar a que esté listo
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        // Verificar que el script se cargó correctamente
        if (src.includes('react') && !window.React) {
          reject(new Error(`React no se cargó correctamente desde ${src}`));
        } else if (src.includes('react-dom') && !window.ReactDOM) {
          reject(new Error(`ReactDOM no se cargó correctamente desde ${src}`));
        } else {
          resolve();
        }
      };
      script.onerror = () => reject(new Error(`Error al cargar ${src}`));
      document.head.appendChild(script);
    });
  };

  try {
    // Cargar React y ReactDOM en orden
    if (!window.React) {
      await loadScript('https://unpkg.com/react@18.3.1/umd/react.production.min.js');
      console.log('React cargado correctamente');
    }
    
    if (!window.ReactDOM) {
      await loadScript('https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js');
      console.log('ReactDOM cargado correctamente');
    }

    // Verificar que las dependencias estén disponibles
    if (!window.React || !window.ReactDOM) {
      throw new Error('Las dependencias de React no se cargaron correctamente');
    }

    // Cargar el componente del widget
    if (!window.WebLNBoostButton) {
      await loadScript('https://www.bitflow.site/widget.bundle.js');
      console.log('Widget bundle cargado correctamente');
    }

    // Verificar que el widget se cargó
    if (!window.WebLNBoostButton) {
      throw new Error('El componente del widget no se cargó correctamente');
    }

    // Buscar el div objetivo
    const target = document.getElementById('bitflow-widget');
    if (!target) {
      console.warn('No se encontró el elemento con id "bitflow-widget"');
      return;
    }

    // Leer configuración desde data-attributes
    const props = {
      receiverType: target.getAttribute('data-receiver-type') || 'lightning',
      receiver: target.getAttribute('data-receiver') || '',
      amounts: (target.getAttribute('data-amounts') || '21,100,1000').split(',').map(Number),
      labels: (target.getAttribute('data-labels') || 'Café,Propina,Boost').split(','),
      theme: target.getAttribute('data-theme') || 'orange',
      avatarSeed: target.getAttribute('data-avatar-seed') || undefined,
      avatarSet: target.getAttribute('data-avatar-set') || undefined,
      image: target.getAttribute('data-image') || undefined,
      hideWebLNGuide: true
    };

    // Renderizar el widget
    window.ReactDOM.createRoot(target).render(
      window.React.createElement(window.WebLNBoostButton, props)
    );

  } catch (error) {
    console.error('Error al inicializar el widget:', error);
    const target = document.getElementById('bitflow-widget');
    if (target) {
      target.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">
        Error al cargar el widget: ${error.message}
      </div>`;
    }
  }
})();