// public/embed.js

(function() {
  // Crear un namespace aislado para el widget
  window.BitflowWidget = window.BitflowWidget || {};
  
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  // Función para cargar un script con reintentos y fallback
  const loadScript = (src, retries = 3) => {
    return new Promise((resolve, reject) => {
      const tryLoad = (attemptsLeft) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = false; // Cambiar a false para mantener el orden de carga
        script.crossOrigin = "anonymous";
        
        // Limpiar script en caso de error
        const cleanup = () => {
          script.onerror = script.onload = null;
          script.remove();
        };

        script.onload = () => {
          cleanup();
          // Esperar un momento después de cargar para asegurar que el script se ejecute
          setTimeout(resolve, 100);
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
  const waitForGlobal = (name, maxAttempts = 40) => { // Aumentar intentos y tiempo entre ellos
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        if (window[name]) {
          resolve(window[name]);
        } else if (++attempts >= maxAttempts) {
          reject(new Error(`Timeout esperando por ${name}`));
        } else {
          setTimeout(check, 250); // Aumentar el tiempo entre intentos
        }
      };
      check();
    });
  };

  // Función para verificar que todas las dependencias estén cargadas
  const verifyDependencies = () => {
    return new Promise((resolve, reject) => {
      const check = () => {
        try {
          if (!window.React || !window.ReactDOM) {
            throw new Error('React o ReactDOM no están disponibles');
          }
          
          const { useState, useEffect } = window.React;
          const { createRoot } = window.ReactDOM;
          
          if (!useState || !useEffect || !createRoot) {
            throw new Error('Funciones de React no están disponibles');
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      // Intentar verificar inmediatamente
      check();
    });
  };

  const loadScriptWithRetry = async (src, retries = MAX_RETRIES) => {
    try {
      await loadScript(src);
    } catch (error) {
      if (retries > 0) {
        console.log(`Error cargando script ${src}, reintentando... (${retries} intentos restantes)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return loadScriptWithRetry(src, retries - 1);
      }
      throw error;
    }
  };

  const waitForDependenciesWithTimeout = async (timeout = 10000) => {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      if (window.React && window.ReactDOM && window.WebLNBoostButton) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Timeout esperando dependencias');
  };

  // Función principal de inicialización
  const init = async () => {
    try {
      // Verificar si ya está inicializado
      if (window.BitflowWidget && window.BitflowWidget.initialized) {
        console.log('Widget ya inicializado');
        return;
      }

      const CDNS = {
        react: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
        reactDom: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
        widget: 'https://www.bitflow.site/widget.bundle.js'
      };

      // Inicializar namespace global
      window.BitflowWidget = window.BitflowWidget || {
        initialized: false,
        loadingPromise: null
      };

      // Si ya hay una carga en progreso, esperar a que termine
      if (window.BitflowWidget.loadingPromise) {
        await window.BitflowWidget.loadingPromise;
        return;
      }

      // Crear promesa de carga
      window.BitflowWidget.loadingPromise = (async () => {
        try {
          // Cargar React si no está disponible
          if (!window.React) {
            console.log('Cargando React...');
            await loadScriptWithRetry(CDNS.react);
            await waitForGlobal('React');
            console.log('React cargado correctamente');
          }

          // Cargar ReactDOM si no está disponible
          if (!window.ReactDOM) {
            console.log('Cargando ReactDOM...');
            await loadScriptWithRetry(CDNS.reactDom);
            await waitForGlobal('ReactDOM');
            console.log('ReactDOM cargado correctamente');
          }

          // Cargar el widget
          console.log('Cargando widget...');
          await loadScriptWithRetry(CDNS.widget);
          
          // Esperar a que todas las dependencias estén disponibles
          await waitForDependenciesWithTimeout();
          console.log('Todas las dependencias cargadas correctamente');

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
      })();

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

  // Cargar el loader si no está presente
  if (!window.BitflowWidget || !window.BitflowWidget.loader) {
    const loaderScript = document.createElement('script');
    loaderScript.src = 'https://www.bitflow.site/widget-loader.js';
    loaderScript.async = true;
    loaderScript.crossOrigin = 'anonymous'; // Agregar crossOrigin para mejor manejo CORS
    document.head.appendChild(loaderScript);
  }

  // Función para inicializar el widget cuando el loader esté disponible
  const initializeWithLoader = async () => {
    try {
      // Esperar a que el loader esté disponible
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!window.BitflowWidget?.loader && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (!window.BitflowWidget?.loader) {
        throw new Error('No se pudo cargar el widget loader');
      }
      
      // El loader se encargará de inicializar los widgets
      await window.BitflowWidget.loader.initialize();
      
    } catch (error) {
      console.error('Error al inicializar el widget:', error);
      const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
      widgets.forEach(target => {
        if (!target.dataset.initialized) {
          target.innerHTML = `
            <div style="
              color: red;
              padding: 20px;
              text-align: center;
              border: 1px solid red;
              border-radius: 8px;
              margin: 10px;
              font-family: system-ui, -apple-system, sans-serif;
            ">
              Error al cargar el widget: ${error.message}
            </div>
          `;
        }
      });
    }
  };

  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWithLoader);
  } else {
    initializeWithLoader();
  }
})();