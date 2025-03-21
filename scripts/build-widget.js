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
      minify: true
    });

    // Crear el bundle
    const bundleCode = `
// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  const { useState, useEffect } = React;
  const requestProvider = window.WebLN?.requestProvider;
  const QRCodeSVG = window.QRCodeSVG;
  const bech32 = window.bech32;
  
  ${result.code}

  // Renderizar el componente
  const root = ReactDOM.createRoot(container);
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