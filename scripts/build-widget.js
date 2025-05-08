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

  // Función para verificar dependencias
  function checkDependencies() {
    try {
      // Verificar React
      if (typeof window.React === 'undefined') {
        throw new Error('React no está disponible');
      }

      // Verificar ReactDOM
      if (typeof window.ReactDOM === 'undefined') {
        throw new Error('ReactDOM no está disponible');
      }

      // Verificar funciones específicas de React
      const { useState, useEffect } = window.React;
      const { createRoot } = window.ReactDOM;

      if (!useState || !useEffect || !createRoot) {
        throw new Error('Las funciones de React no están disponibles');
      }

      return true;
    } catch (error) {
      console.error('Error en verificación de dependencias:', error);
      throw error;
    }
  }

  // Código del componente
  ${result.code}

  // Exportar el componente y la función de renderizado
  try {
    // Verificar dependencias antes de exportar
    if (checkDependencies()) {
      // Exportar el componente
      window.WebLNBoostButton = WebLNBoostButton;
      
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
    }
  } catch (error) {
    console.error('Error al inicializar el componente:', error);
    window.BitflowWidget.error = error;
    throw error;
  }
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