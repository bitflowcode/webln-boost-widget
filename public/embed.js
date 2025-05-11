// public/embed.js

(async function() {
  // Cargar React y ReactDOM si no existen
  if (!window.React || !window.ReactDOM) {
    await Promise.all([
      new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/react@19/umd/react.production.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      }),
      new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/react-dom@19/umd/react-dom.production.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      })
    ]);
  }

  // Cargar el componente del widget (bundle UMD exportado)
  if (!window.WebLNBoostButton) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://www.bitflow.site/widget.bundle.js'; // Debes exportar tu componente como UMD
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  // Buscar el div objetivo
  const target = document.getElementById('bitflow-widget');
  if (!target) return;

  // Leer configuración desde data-attributes
  const props = {
    receiverType: target.getAttribute('data-receiver-type') || 'lightning',
    receiver: target.getAttribute('data-receiver') || '',
    amounts: (target.getAttribute('data-amounts') || '21,100,1000').split(',').map(Number),
    labels: (target.getAttribute('data-labels') || 'Café,Propina,Boost').split(','),
    theme: target.getAttribute('data-theme') || 'orange',
    avatarSeed: target.getAttribute('data-avatar-seed') || undefined,
    avatarSet: target.getAttribute('data-avatar-set') || undefined,
    image: target.getAttribute('data-image') || undefined,
    hideWebLNGuide: true
  };

  // Renderizar el widget
  window.ReactDOM.createRoot(target).render(
    window.React.createElement(window.WebLNBoostButton, props)
  );
})();