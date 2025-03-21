const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// Leer el componente WebLNBoostButton
const componentPath = path.join(__dirname, '../app/components/webln-boost-button.tsx');
const componentCode = fs.readFileSync(componentPath, 'utf8');

// Transformar el código con Babel
const transformedCode = babel.transformSync(componentCode, {
  configFile: path.join(__dirname, './babel.config.js'),
  filename: componentPath
}).code;

// Crear el bundle
const bundleCode = `
// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  const { useState, useEffect } = React;
  const requestProvider = window.WebLN?.requestProvider;
  
  ${transformedCode}

  // Renderizar el componente
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(WebLNBoostButton, config));
};`;

// Guardar el bundle
const bundlePath = path.join(__dirname, '../public/widget.bundle.js');
fs.writeFileSync(bundlePath, bundleCode);

console.log('Bundle generado exitosamente en:', bundlePath); 