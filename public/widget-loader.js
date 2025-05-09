// Namespace global para el widget
window.BitflowWidget = window.BitflowWidget || {
  initialized: false,
  loadingPromise: null,
  instances: new Map(),
  config: {
    cdnBase: 'https://www.bitflow.site',
    dependencies: {
      react: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
      reactDom: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'
    },
    retryConfig: {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 10000
    }
  }
};

// Utilidades
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const loadScript = (src, { timeout = 10000, retries = 3, retryDelay = 1000 } = {}) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    let timeoutId;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      script.onload = script.onerror = null;
    };

    script.onload = () => {
      cleanup();
      resolve();
    };

    script.onerror = async () => {
      cleanup();
      if (retries > 0) {
        await delay(retryDelay);
        try {
          await loadScript(src, { timeout, retries: retries - 1, retryDelay });
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`Failed to load script: ${src}`));
      }
    };

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout loading script: ${src}`));
    }, timeout);

    document.head.appendChild(script);
  });
};

const waitForGlobal = (name, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    
    const check = () => {
      const global = window[name];
      if (global) {
        resolve(global);
        return;
      }
      
      if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for ${name}`));
        return;
      }
      
      setTimeout(check, 100);
    };
    
    check();
  });
};

// Cargador principal
class WidgetLoader {
  constructor(config = {}) {
    this.config = { ...window.BitflowWidget.config, ...config };
    this.loadingPromise = null;
  }

  async loadDependencies() {
    const { dependencies, retryConfig } = this.config;
    
    // Cargar React si no está disponible
    if (!window.React) {
      await loadScript(dependencies.react, retryConfig);
      await waitForGlobal('React', retryConfig.timeout);
    }
    
    // Cargar ReactDOM si no está disponible
    if (!window.ReactDOM) {
      await loadScript(dependencies.reactDom, retryConfig);
      await waitForGlobal('ReactDOM', retryConfig.timeout);
    }
  }

  async loadWidget() {
    const { cdnBase, retryConfig } = this.config;
    const widgetUrl = `${cdnBase}/widget.bundle.js`;
    
    await loadScript(widgetUrl, retryConfig);
    await waitForGlobal('WebLNBoostButton', retryConfig.timeout);
  }

  async initialize() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      try {
        await this.loadDependencies();
        await this.loadWidget();
        
        // Inicializar widgets existentes
        const widgets = document.querySelectorAll('[id^="bitflow-widget"]');
        widgets.forEach(target => {
          if (!target.dataset.initialized) {
            this.initializeWidget(target);
          }
        });

        window.BitflowWidget.initialized = true;
        
        // Observar nuevos widgets
        this.observeNewWidgets();
        
      } catch (error) {
        console.error('Error initializing widget:', error);
        this.handleError(error);
      }
    })();

    return this.loadingPromise;
  }

  initializeWidget(target) {
    try {
      const props = this.extractProps(target);
      const root = window.ReactDOM.createRoot(target);
      root.render(window.React.createElement(window.WebLNBoostButton, props));
      target.dataset.initialized = 'true';
      window.BitflowWidget.instances.set(target.id, { root, props });
    } catch (error) {
      console.error('Error initializing widget instance:', error);
      this.handleError(error, target);
    }
  }

  extractProps(target) {
    const props = {};
    for (const attr of target.attributes) {
      if (attr.name.startsWith('data-')) {
        const key = attr.name.slice(5).replace(/-([a-z])/g, g => g[1].toUpperCase());
        let value = attr.value;
        
        // Convertir valores especiales
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (/^\d+$/.test(value)) value = parseInt(value);
        else if (/^\[.*\]$/.test(value)) value = JSON.parse(value);
        
        props[key] = value;
      }
    }
    return props;
  }

  observeNewWidgets() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.id?.startsWith('bitflow-widget') && !node.dataset.initialized) {
            this.initializeWidget(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handleError(error, target = null) {
    const errorMessage = error.message || 'Unknown error';
    
    if (target) {
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
          Error al cargar el widget: ${errorMessage}
        </div>
      `;
    }
    
    // Emitir evento de error
    const errorEvent = new CustomEvent('bitflow-widget-error', {
      detail: { error, targetId: target?.id }
    });
    window.dispatchEvent(errorEvent);
  }
}

// Inicializar el loader
const loader = new WidgetLoader();
loader.initialize().catch(console.error);

// Exponer API pública
window.BitflowWidget.loader = loader; 