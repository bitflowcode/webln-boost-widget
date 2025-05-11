const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function buildWidget() {
  try {
    // Leer el componente WebLNBoostButton
    const componentPath = path.join(__dirname, '../app/components/webln-boost-button.tsx');
    
    // Transformar el código con esbuild
    const result = await esbuild.transform(fs.readFileSync(componentPath, 'utf8'), {
      loader: 'tsx',
      jsx: 'transform',
      target: 'es2015',
      format: 'iife',
      minify: true,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    // Crear el bundle con manejo mejorado de dependencias
    const bundleCode = `
// Función global para renderizar el widget
(function() {
  // Crear namespace aislado
  window.BitflowWidget = window.BitflowWidget || {};

  // Configuración del entorno
  var process = { env: { NODE_ENV: 'production' } };
  var require = undefined;
  var module = undefined;
  var exports = undefined;

  // Esperar a que las dependencias estén disponibles
  function waitForDependencies(callback) {
    const interval = setInterval(() => {
      try {
        if (window.React && window.ReactDOM) {
  const { useState, useEffect } = window.React;
  const { createRoot } = window.ReactDOM;
          
          if (useState && useEffect && createRoot) {
            clearInterval(interval);
            callback();
          }
        }
      } catch (error) {
        // Ignorar errores durante la espera
      }
    }, 100);

    // Timeout después de 10 segundos
    setTimeout(() => {
      clearInterval(interval);
      console.error('Timeout esperando dependencias');
    }, 10000);
  }

  // Código del componente
  ${result.code}

  // Exportar el componente inmediatamente
  window.WebLNBoostButton = WebLNBoostButton;
  console.log('Componente WebLNBoostButton exportado');

  // Configurar el renderizado cuando las dependencias estén listas
  waitForDependencies(() => {
    try {
      // Función de renderizado global con manejo de errores mejorado
      window.renderBitflowWidget = function(container, config) {
        try {
          // Validar el contenedor
          if (!container || !(container instanceof HTMLElement)) {
            throw new Error('Contenedor no válido');
          }

          // Validar configuración mínima
          if (!config || typeof config !== 'object') {
            throw new Error('Configuración inválida');
          }

          if (!config.receiver) {
            throw new Error('Dirección de receptor no especificada');
          }

          // Validar montos
          if (config.amounts && Array.isArray(config.amounts)) {
            config.amounts = config.amounts.map(Number).filter(amount => !isNaN(amount) && amount > 0);
            if (config.amounts.length === 0) {
              config.amounts = [21, 100, 1000]; // Valores por defecto
            }
          }

          // Validar etiquetas
          if (config.labels && Array.isArray(config.labels)) {
            config.labels = config.labels.map(String);
            if (config.labels.length === 0) {
              config.labels = ['Café', 'Propina', 'Boost']; // Valores por defecto
            }
          }

          // Crear root y renderizar
          const root = window.ReactDOM.createRoot(container);
          root.render(window.React.createElement(window.WebLNBoostButton, config));
          console.log('Widget renderizado exitosamente');
        } catch (error) {
          console.error('Error al renderizar:', error);
          container.innerHTML = \`
            <div style="
              color: #721c24;
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              border-radius: 8px;
              padding: 20px;
              margin: 10px;
              text-align: center;
              font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            ">
              <div style="font-weight: bold; margin-bottom: 8px;">Error al cargar el widget</div>
              <div style="font-size: 14px;">\${error.message}</div>
            </div>
          \`;
        }
      };

      // Marcar como inicializado
      window.BitflowWidget.widgetLoaded = true;
      console.log('Widget inicializado correctamente');

      // Inicializar widgets existentes
      document.querySelectorAll('[id^="bitflow-widget"]').forEach((target) => {
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

          if (props.receiver) {
            window.renderBitflowWidget(target, props);
            target.dataset.initialized = 'true';
          }
        }
      });
    } catch (error) {
      console.error('Error al inicializar el widget:', error);
      window.BitflowWidget.error = error;
    }
  });
})();`;

    // Guardar el bundle
    const bundlePath = path.join(__dirname, '../public/widget.bundle.js');
    fs.writeFileSync(bundlePath, bundleCode);

    console.log('Bundle generado exitosamente en:', bundlePath);
  } catch (error) {
    console.error('Error generando el bundle:', error);
    process.exit(1);
  }
}

buildWidget(); 