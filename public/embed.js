// public/embed.js

(function() {
  // Crear un namespace aislado para el widget
  window.BitflowWidget = window.BitflowWidget || {};
  
  // Función para cargar un script con reintentos y fallback
  const loadScript = (src, retries = 3) => {
    return new Promise((resolve, reject) => {
      const tryLoad = (attemptsLeft) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.crossOrigin = "anonymous";
        
        // Limpiar script en caso de error
        const cleanup = () => {
          script.onerror = script.onload = null;
          script.remove();
        };

        script.onload = () => {
          cleanup();
          resolve();
        };

        script.onerror = () => {
          cleanup();
          if (attemptsLeft > 0) {
            console.log(`Reintentando cargar ${src}, ${attemptsLeft} intentos restantes`);
            setTimeout(() => tryLoad(attemptsLeft - 1), 1000);
          } else {
            // Intentar CDN alternativo
            const fallbackSrc = getFallbackUrl(src);
            if (fallbackSrc && fallbackSrc !== src) {
              console.log(`Intentando CDN alternativo: ${fallbackSrc}`);
              loadScript(fallbackSrc, 1)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error(`No se pudo cargar ${src}`));
            }
          }
        };

        // Insertar script al inicio del head para mejor rendimiento
        const head = document.getElementsByTagName('head')[0];
        head.insertBefore(script, head.firstChild);
      };

      tryLoad(retries);
    });
  };

  // Función para obtener URL alternativa de CDN
  const getFallbackUrl = (url) => {
    const FALLBACKS = {
      'unpkg.com': 'cdnjs.cloudflare.com/ajax/libs',
      'cdnjs.cloudflare.com': 'jsdelivr.net/npm'
    };

    for (const [current, fallback] of Object.entries(FALLBACKS)) {
      if (url.includes(current)) {
        return url.replace(current, fallback);
      }
    }
    return null;
  };

  // Función para verificar si una variable global está disponible
  const waitForGlobal = (name, maxAttempts = 20) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        if (window[name]) {
          clearInterval(interval);
          resolve(window[name]);
        } else if (++attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error(`Timeout esperando por ${name}`));
        }
      }, 250);
    });
  };

  // Función principal de inicialización
  const init = async () => {
    try {
      // Verificar si ya está inicializado
      if (window.BitflowWidget.initialized) {
        console.log('Widget ya inicializado');
        return;
      }

      const CDNS = {
        react: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
        reactDom: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
        widget: 'https://www.bitflow.site/widget.bundle.js'
      };

      // Cargar React si no está disponible
      if (!window.React) {
        console.log('Cargando React...');
        await loadScript(CDNS.react);
        await waitForGlobal('React');
      }

      // Cargar ReactDOM si no está disponible
      if (!window.ReactDOM) {
        console.log('Cargando ReactDOM...');
        await loadScript(CDNS.reactDom);
        await waitForGlobal('ReactDOM');
      }

      // Cargar el widget
      console.log('Cargando widget...');
      await loadScript(CDNS.widget);
      await waitForGlobal('WebLNBoostButton');

      // Inicializar todos los widgets en la página
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      widgets.forEach((target, index) => {
        try {
          if (!target.dataset.initialized) {
            const props = {
              receiverType: target.getAttribute('data-receiver-type') || 'lightning',
              receiver: target.getAttribute('data-receiver'),
              amounts: (target.getAttribute('data-amounts') || '21,100,1000').split(',').map(Number),
              labels: (target.getAttribute('data-labels') || 'Café,Propina,Boost').split(','),
              theme: target.getAttribute('data-theme') || 'orange',
              avatarSeed: target.getAttribute('data-avatar-seed'),
              avatarSet: target.getAttribute('data-avatar-set'),
              image: target.getAttribute('data-image'),
              hideWebLNGuide: true
            };

            if (!props.receiver) {
              throw new Error('Receptor no especificado');
            }

            window.renderBitflowWidget(target, props);
            target.dataset.initialized = 'true';
            console.log(`Widget ${index + 1} inicializado correctamente`);
          }
        } catch (error) {
          console.error(`Error al inicializar widget ${index + 1}:`, error);
          target.innerHTML = `<div style="color: red; padding: 20px; text-align: center; border: 1px solid red; border-radius: 8px; margin: 10px;">
            Error al cargar el widget: ${error.message}
          </div>`;
        }
      });

      window.BitflowWidget.initialized = true;
      console.log('Inicialización completada');

    } catch (error) {
      console.error('Error durante la inicialización:', error);
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      widgets.forEach(target => {
        if (!target.dataset.initialized) {
          target.innerHTML = `<div style="color: red; padding: 20px; text-align: center; border: 1px solid red; border-radius: 8px; margin: 10px;">
            Error al cargar el widget: ${error.message}
          </div>`;
        }
      });
    }
  };

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();