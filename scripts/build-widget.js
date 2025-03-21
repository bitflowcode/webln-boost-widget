const fs = require('fs');
const path = require('path');

// Leer el componente WebLNBoostButton
const componentPath = path.join(__dirname, '../app/components/webln-boost-button.tsx');
const componentCode = fs.readFileSync(componentPath, 'utf8');

// Crear el bundle
const bundleCode = `
// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  ${componentCode}

  // Renderizar el componente
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(WebLNBoostButton, config));
};
`;

// Guardar el bundle
const bundlePath = path.join(__dirname, '../public/widget.bundle.js');
fs.writeFileSync(bundlePath, bundleCode);

console.log('Bundle generado exitosamente en:', bundlePath); 