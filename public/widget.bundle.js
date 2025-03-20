// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  const WebLNBoostButton = ({ 
    receiverType = 'lightning',
    receiver = 'bitflowz@getalby.com',
    amounts = [21, 100, 1000],
    labels = ['Café', 'Propina', 'Boost'],
    theme = 'orange',
    useCustomImage = false,
    image,
    avatarSeed,
    avatarSet = 'set1'
  }) => {
    // Aquí va el código del componente WebLNBoostButton
    // (Se generará mediante el proceso de build)
  };

  // Renderizar el componente
  ReactDOM.render(
    React.createElement(WebLNBoostButton, config),
    container
  );
}; 