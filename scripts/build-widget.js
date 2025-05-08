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
  // Configuración del entorno
  var process = { env: { NODE_ENV: 'production' } };
  var require = undefined;
  var module = undefined;
  var exports = undefined;

  // Función para verificar dependencias
  function checkDependencies() {
    if (!window.React || !window.ReactDOM) {
      console.error('Dependencias faltantes:', {
        'React': !!window.React,
        'ReactDOM': !!window.ReactDOM
      });
      throw new Error('Dependencias no cargadas correctamente');
    }

    const { useState, useEffect } = window.React;
    const { createRoot } = window.ReactDOM;

    if (!useState || !useEffect || !createRoot) {
      console.error('Funciones de React/ReactDOM faltantes:', {
        'useState': !!useState,
        'useEffect': !!useEffect,
        'createRoot': !!createRoot
      });
      throw new Error('Las funciones de React no están disponibles');
    }
  }

  // Código del componente
  ${result.code}

  // Exportar el componente y la función de renderizado
  try {
    checkDependencies();
    window.WebLNBoostButton = WebLNBoostButton;
    
    // Función de renderizado global
    window.renderBitflowWidget = function(container, config) {
      const root = window.ReactDOM.createRoot(container);
      root.render(window.React.createElement(window.WebLNBoostButton, config));
    };
  } catch (error) {
    console.error('Error al inicializar el componente:', error);
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