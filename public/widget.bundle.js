
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
  "use client";(()=>{var be=Object.create;var Y=Object.defineProperty;var fe=Object.getOwnPropertyDescriptor;var ge=Object.getOwnPropertyNames;var we=Object.getPrototypeOf,me=Object.prototype.hasOwnProperty;var he=(n,t,a,b)=>{if(t&&typeof t=="object"||typeof t=="function")for(let u of ge(t))!me.call(n,u)&&u!==a&&Y(n,u,{get:()=>t[u],enumerable:!(b=fe(t,u))||b.enumerable});return n};var j=(n,t,a)=>(a=n!=null?be(we(n)):{},he(t||!n||!n.__esModule?Y(a,"default",{value:n,enumerable:!0}):a,n));var R=(n,t,a)=>new Promise((b,u)=>{var v=c=>{try{f(a.next(c))}catch(p){u(p)}},N=c=>{try{f(a.throw(c))}catch(p){u(p)}},f=c=>c.done?b(c.value):Promise.resolve(c.value).then(v,N);f((a=a.apply(n,t)).next())});var i=require("react"),T=require("webln"),x=require("@/app/components/ui/button"),X=require("qrcode.react"),Z=j(require("./widget-info-tooltip")),K=j(require("./ui/robo-avatar")),G=j(require("./ui/custom-avatar")),M=require("bech32");const xe="bitflowz@getalby.com",ve=n=>{try{const{words:t}=M.bech32.decode(n,2e3),a=M.bech32.fromWords(t);return new TextDecoder().decode(new Uint8Array(a))}catch(t){return n}},Ne=(n,t)=>Array.isArray(n)&&n[t]||"",ye=5,J=1e3,Le=(n=1e4)=>R(void 0,null,function*(){var b,u;const t=Date.now();let a=0;for(;Date.now()-t<n&&a<ye;)try{const v=window!==window.parent,N=typeof window!="undefined"&&(window.webln&&typeof window.webln.enable=="function"||window.alby&&typeof window.alby.enable=="function");let f=!1;if(v)try{f=!!((b=window.parent.webln)!=null&&b.enable||(u=window.parent.alby)!=null&&u.enable)}catch(c){console.log("Error al acceder al contexto padre:",c)}if(N||f)return!0;a++,yield new Promise(c=>setTimeout(c,J))}catch(v){console.error("Error al verificar WebLN:",v),a++,yield new Promise(N=>setTimeout(N,J))}return!1});function Ee({receiverType:n="lightning",receiver:t=xe,amounts:a=[21,100,1e3],labels:b=["Caf\xE9","Propina","Boost"],theme:u="orange",incrementSpeed:v=50,incrementValue:N=10,avatarSeed:f,avatarSet:c="set1",image:p,hideWebLNGuide:L=!1}){const[ee,w]=(0,i.useState)("initial"),[I,C]=(0,i.useState)(0),[P,D]=(0,i.useState)(""),[H,W]=(0,i.useState)(null),[oe,d]=(0,i.useState)(""),[A,z]=(0,i.useState)(""),[q,_]=(0,i.useState)(!1),[B,te]=(0,i.useState)(!1),[S,F]=(0,i.useState)(!1),[ne,re]=(0,i.useState)(!1);(0,i.useEffect)(()=>{console.log("WebLNBoostButton props:",{receiverType:n,receiver:t,amounts:a,labels:b,theme:u,avatarSeed:f,avatarSet:c,image:p}),console.log("Avatar debug info:",{hasAvatarSeed:!!f,avatarSeedValue:f,avatarSetValue:c,hasImage:!!p,imageValue:p})},[n,t,a,b,u,f,c,p]),(0,i.useEffect)(()=>{const e=()=>{const o=/iPhone|iPad|Android/i.test(navigator.userAgent);te(o),(o||L)&&d("")};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[L]),(0,i.useEffect)(()=>{const e=()=>R(this,null,function*(){try{if(console.log("Iniciando initWebLN..."),!B&&!L)if(console.log("Verificando disponibilidad de WebLN..."),yield Le()){console.log("WebLN detectado, intentando habilitar...");try{const s=window!==window.parent;let r;s&&window.parent.webln?r=window.parent.webln:s&&window.parent.alby?r=window.parent.alby:r=yield(0,T.requestProvider)(),r&&(yield r.enable(),console.log("WebLN habilitado correctamente"),W(r),d(""))}catch(s){console.log("Error al habilitar WebLN:",s),d("Haz clic en 'Donate Sats' para habilitar el pago directo con Alby")}}else console.log("WebLN no detectado despu\xE9s de m\xFAltiples intentos"),d("No se detect\xF3 una billetera compatible con WebLN")}catch(o){console.error("Error al inicializar WebLN:",o),V(o)}});return W(null),d(""),e(),()=>{W(null),d("")}},[B,L]);const ae=()=>R(this,null,function*(){try{console.log("Iniciando habilitaci\xF3n de WebLN...");const e=window!==window.parent;console.log("\xBFEstamos en iframe? (handleUserConsent):",e);let o;try{e&&window.parent&&(window.parent.webln||window.parent.alby)?(console.log("Usando WebLN del contexto padre"),o=window.parent.webln||window.parent.alby):(console.log("Obteniendo proveedor WebLN del contexto actual"),o=yield(0,T.requestProvider)())}catch(s){throw console.error("Error al obtener el proveedor:",s),s}if(console.log("Provider obtenido:",o),!o)throw new Error("No se pudo obtener el proveedor WebLN");if(o._isEnabled){console.log("WebLN ya est\xE1 habilitado"),W(o),d("");return}yield o.enable(),console.log("WebLN habilitado correctamente"),W(o),d("")}catch(e){console.error("Error al habilitar WebLN:",e),V(e)}}),V=e=>{var o,s,r,l;W(null),!B&&!L&&(e instanceof Error?(o=e.message)!=null&&o.toLowerCase().includes("not authorized")||(s=e.message)!=null&&s.toLowerCase().includes("permission denied")?d("Este sitio necesita autorizaci\xF3n en Alby. Por favor, autoriza el sitio en la extensi\xF3n y recarga la p\xE1gina."):(r=e.message)!=null&&r.toLowerCase().includes("no provider available")?d("No se detect\xF3 una billetera compatible con WebLN"):(l=e.message)!=null&&l.toLowerCase().includes("user rejected")?d("Pago cancelado por el usuario"):d("Error al inicializar WebLN"):d("Error desconocido al inicializar WebLN"))};(0,i.useEffect)(()=>{let e=null;return q&&(e=setInterval(()=>{C(o=>o+N)},v)),()=>{e&&clearInterval(e)}},[q,N,v]),(0,i.useEffect)(()=>{re(!0)},[]);const se=e=>{e<=0||C(e)},le=e=>{const o=parseInt(e.target.value);o<0?C(0):C(o)},ie=e=>{D(e.target.value)},Q=()=>{C(0),D(""),w("initial")},ce=()=>R(this,null,function*(){var s,r;const e=Math.round(I*1e3);let o;try{if(n==="lnurl")try{console.log("Procesando LNURL:",t);let y;t.toLowerCase().startsWith("lnurl")?y=ve(t):y=t,console.log("URL decodificada o directa:",y);const U=yield fetch(y);if(!U.ok)throw console.error("Error en respuesta inicial:",U.status),new Error(`Error al obtener par\xE1metros LNURL: ${U.status}`);const g=yield U.json();if(console.log("Par\xE1metros LNURL recibidos:",g),!g.tag||g.tag!=="payRequest")throw console.error("Tag inv\xE1lido:",g.tag),new Error("El LNURL proporcionado no es un endpoint de pago v\xE1lido");if(console.log(`Verificando monto ${e} entre ${g.minSendable} y ${g.maxSendable}`),e<g.minSendable||e>g.maxSendable)throw new Error(`El monto debe estar entre ${g.minSendable/1e3} y ${g.maxSendable/1e3} sats`);const $=new URL(g.callback);$.searchParams.append("amount",e.toString());let E,h;try{if(P&&$.searchParams.append("comment",P),E=yield fetch($.toString()),h=yield E.json(),h.status==="ERROR"&&((s=h.reason)!=null&&s.toLowerCase().includes("comment"))){console.log("El servicio no acepta comentarios, reintentando sin comentario");const k=new URL(g.callback);k.searchParams.append("amount",e.toString()),E=yield fetch(k.toString()),h=yield E.json()}}catch(k){throw console.error("Error al obtener la factura:",k),new Error("Error al generar la factura LNURL")}if(!E.ok)throw console.error("Error en respuesta de factura:",E.status),new Error(`Error al generar la factura LNURL: ${E.status}`);if(console.log("Datos de factura recibidos:",h),h.pr)return console.log("Factura encontrada en pr"),h.pr;if(h.invoice)return console.log("Factura encontrada en invoice"),h.invoice;throw console.error("No se encontr\xF3 factura en la respuesta:",h),new Error("No se pudo obtener la factura del servicio LNURL")}catch(y){throw console.error("Error detallado en el proceso LNURL:",y),new Error(`Error procesando LNURL: ${y instanceof Error?y.message:"Error desconocido"}`)}switch(n){case"lightning":o=yield fetch(`https://api.getalby.com/lnurl/generate-invoice?ln=${t}&amount=${e}&comment=${encodeURIComponent(P||"Boost con Bitflow")}`);break;case"node":o=yield fetch(`https://api.getalby.com/payments/keysend?node_id=${t}&amount=${e}&comment=${encodeURIComponent(P||"Boost con Bitflow")}`);break;default:throw new Error("Tipo de receptor no v\xE1lido")}if(!o.ok)throw new Error(`Error al generar factura: ${o.status}`);const l=yield o.json();if(console.log("Respuesta:",l),!((r=l.invoice)!=null&&r.pr)||typeof l.invoice.pr!="string")throw new Error("La factura no se gener\xF3 correctamente");return l.invoice.pr}catch(l){throw console.error("Error en generateInvoice:",l),l}}),de=()=>ne?t?!0:(console.warn("Por favor, ingresa una direcci\xF3n de receptor"),!1):!0,ue=()=>R(this,null,function*(){var e,o,s;if(!(S||!de()))try{F(!0),console.log("Iniciando proceso de pago...");const r=yield ce();if(console.log("Factura generada:",r),B||!H){console.log("Mostrando QR (m\xF3vil o sin WebLN)"),z(r),w("qr");return}try{console.log("Intentando pago con WebLN"),yield H.sendPayment(r),console.log("Pago completado con \xE9xito"),Q()}catch(l){console.error("Error detallado en pago WebLN:",l),l instanceof Error?(e=l.message)!=null&&e.includes("User rejected")?(d("Pago cancelado por el usuario."),w("initial")):(o=l.message)!=null&&o.includes("not authorized")||(s=l.message)!=null&&s.includes("Permission denied")?(d("Este sitio necesita autorizaci\xF3n en Alby para pagar directamente. Por favor, autoriza el sitio en la extensi\xF3n Alby y vuelve a intentarlo."),w("qr")):(console.log("Mostrando QR despu\xE9s de error WebLN"),z(r),w("qr")):(console.log("Mostrando QR despu\xE9s de error WebLN"),z(r),w("qr"))}}catch(r){console.error("Error detallado en handleBoost:",r);const l=r instanceof Error?r.message:"Error desconocido";d(`Error al generar la factura: ${l}`),w("initial")}finally{F(!1)}}),O={orange:"#FF8C00",blue:"#3B81A2",green:"#2E7D32"},m=O[u]||O.orange,pe=()=>{if(p){let e=p;if(/^[A-Za-z0-9_-]+={0,2}$/.test(p))try{const o=p.replace(/-/g,"+").replace(/_/g,"/").padEnd(p.length+(4-p.length%4)%4,"="),s=atob(o);s.startsWith("http")&&(e=s)}catch(o){console.error("Error decodificando URL en renderAvatar:",o)}return React.createElement(G.default,{imageUrl:e,size:128})}return React.createElement(K.default,{seed:f||"default",set:c,size:128})};return React.createElement("div",{className:"flex flex-col items-center bg-transparent"},React.createElement("div",{className:"w-[460px] h-[420px] relative flex items-center justify-center bg-transparent"},React.createElement("div",{className:"w-[420px] h-[420px] rounded-2xl p-6 space-y-4 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center",style:{backgroundColor:m,minHeight:"420px",minWidth:"420px"}},(()=>{switch(ee){case"initial":return React.createElement("div",{className:"flex flex-col items-center gap-6"},React.createElement("div",{className:"w-32 h-32 relative"},pe()),React.createElement("h2",{className:"text-4xl font-bold text-white"},"Bitflow"),React.createElement(x.Button,{onClick:()=>R(this,null,function*(){!B&&!L&&(yield ae()),w("amount")}),className:"bg-white hover:bg-white/90 font-bold text-lg px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",style:{color:m}},"Donate Sats"));case"amount":return React.createElement(React.Fragment,null,React.createElement("h1",{className:"text-3xl font-bold text-white mb-6"},"How many Sats?"),React.createElement("div",{className:"flex gap-3 mb-4 w-full max-w-[360px] justify-center"},a.map((e,o)=>React.createElement(x.Button,{key:e,onClick:()=>se(e),className:`rounded-full px-4 py-3 flex-1 text-sm flex flex-col items-center leading-tight h-[70px] justify-center ${I===e?"bg-white":"bg-transparent text-white border-2 border-white"}`,style:I===e?{color:m}:{}},React.createElement("span",{className:"font-medium"},Ne(b,o)||e),React.createElement("span",{className:"text-xs mt-1"},e," sats")))),React.createElement(x.Button,{onMouseDown:()=>_(!0),onMouseUp:()=>_(!1),onMouseLeave:()=>_(!1),onTouchStart:()=>_(!0),onTouchEnd:()=>_(!1),className:"w-22 h-22 mb-4 rounded-full bg-white hover:bg-white/90 font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform",style:{color:m}},React.createElement("div",{className:"flex flex-col items-center justify-center h-full text-xs font-bold"},React.createElement("span",null,"Press"),React.createElement("span",null,"to Boost"),React.createElement("span",{className:"text-lg mt-1 font-bold"},"\u26A1"))),React.createElement("div",{className:"w-full max-w-[360px] flex justify-center"},React.createElement("input",{type:"number",inputMode:"numeric",pattern:"[0-9]*",value:I||"",onChange:le,placeholder:"Enter an amount",className:"w-full px-4 py-2 mb-4 rounded-full text-center text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2",style:{color:m,"--tw-ring-color":m}})),React.createElement("div",{className:"flex gap-4"},React.createElement(x.Button,{onClick:()=>w("initial"),className:"bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"},"Back"),React.createElement(x.Button,{onClick:()=>w("note"),className:"bg-white hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",style:{color:m}},"Next")));case"note":return React.createElement(React.Fragment,null,React.createElement("h1",{className:"text-3xl font-bold text-white mb-8"},"Want to add a note?"),React.createElement("textarea",{value:P,onChange:ie,placeholder:"Enter your note",className:"w-full max-w-[360px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2",style:{color:m,"--tw-ring-color":m}}),React.createElement("div",{className:"flex gap-4"},React.createElement(x.Button,{onClick:()=>w("amount"),className:"bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"},"Back"),React.createElement(x.Button,{onClick:ue,disabled:S,className:`bg-white hover:bg-white/90 font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200
                  ${S?"opacity-50 cursor-not-allowed":""}`,style:{color:m}},S?"Processing...":"Next")));case"qr":return React.createElement("div",{className:"w-full h-full flex flex-col items-center justify-between gap-4"},React.createElement("div",{className:"flex flex-col items-center gap-4 overflow-y-auto max-h-[90%] w-full"},React.createElement("div",{className:"bg-white p-4 rounded-lg flex-shrink-0"},React.createElement(X.QRCodeSVG,{value:A,size:200})),React.createElement("div",{className:"w-full bg-[#2d2d2d] p-3 rounded-lg flex-shrink-0"},React.createElement("div",{className:"flex items-center justify-between mb-2"},React.createElement("p",{className:"text-xs text-white/70"},"Lightning Invoice:"),React.createElement("button",{onClick:()=>navigator.clipboard.writeText(A),className:"text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"},"Copiar")),React.createElement("p",{className:"text-[10px] text-white/90 font-mono break-all whitespace-pre-wrap"},A))),React.createElement(x.Button,{onClick:Q,className:"bg-white hover:bg-white/90 font-bold text-lg px-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200 flex-shrink-0",style:{color:m}},"Done?"))}})()),oe&&!L&&React.createElement("div",{className:"absolute -bottom-2 left-0 right-0 transform translate-y-full pt-2 z-10 flex justify-center bg-transparent"},React.createElement("div",{className:"p-0 bg-transparent"},React.createElement(Z.default,null)))))}})();


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
          container.innerHTML = `
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
              <div style="font-size: 14px;">${error.message}</div>
            </div>
          `;
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
})();