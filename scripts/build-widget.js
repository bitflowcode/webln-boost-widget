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
      },
      banner: `
        var process = { env: { NODE_ENV: 'production' } };
        var require = undefined;
        var module = undefined;
        var exports = undefined;
      `
    });

    // Crear el bundle
    const bundleCode = `
// Asegurarnos de que las dependencias estén disponibles
if (!window.React || !window.ReactDOM || !window.qrcode || !window.bech32) {
  throw new Error('Dependencias no cargadas correctamente');
}

// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  const { useState, useEffect } = window.React;
  const { createRoot } = window.ReactDOM;
  const { QRCodeSVG } = window.qrcode;
  const { bech32 } = window.bech32;
  
  ${result.code}

  // Renderizar el componente usando createRoot
  const root = createRoot(container);
  root.render(React.createElement(WebLNBoostButton, config));
};`;

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