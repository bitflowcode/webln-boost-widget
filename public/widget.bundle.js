
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
  "use client";(()=>{var de=Object.create;var Q=Object.defineProperty;var ue=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var be=Object.getPrototypeOf,ge=Object.prototype.hasOwnProperty;var fe=(n,o,r,p)=>{if(o&&typeof o=="object"||typeof o=="function")for(let l of pe(o))!ge.call(n,l)&&l!==r&&Q(n,l,{get:()=>o[l],enumerable:!(p=ue(o,l))||p.enumerable});return n};var Y=(n,o,r)=>(r=n!=null?de(be(n)):{},fe(o||!n||!n.__esModule?Q(r,"default",{value:n,enumerable:!0}):r,n));var L=(n,o,r)=>new Promise((p,l)=>{var P=b=>{try{w(r.next(b))}catch(u){l(u)}},_=b=>{try{w(r.throw(b))}catch(u){l(u)}},w=b=>b.done?p(b.value):Promise.resolve(b.value).then(P,_);w((r=r.apply(n,o)).next())});var a=require("react"),j=require("webln"),x=require("@/app/components/ui/button"),J=require("qrcode.react"),O=Y(require("./ui/robo-avatar")),X=Y(require("./ui/custom-avatar")),M=require("bech32");const me="bitflowz@getalby.com",he=n=>{try{const{words:o}=M.bech32.decode(n,2e3),r=M.bech32.fromWords(o);return new TextDecoder().decode(new Uint8Array(r))}catch(o){return n}},we=(n,o)=>Array.isArray(n)&&n[o]||"",xe=5,G=1e3,ve=(n=1e4)=>L(void 0,null,function*(){const o=Date.now();let r=0;for(;Date.now()-o<n&&r<xe;)try{if(typeof window!="undefined"&&(window.webln&&typeof window.webln.enable=="function"||window.alby&&typeof window.alby.enable=="function"))return!0;r++,yield new Promise(l=>setTimeout(l,G))}catch(p){console.error("Error al verificar WebLN:",p),r++,yield new Promise(l=>setTimeout(l,G))}return!1});function Ne({receiverType:n="lightning",receiver:o=me,amounts:r=[21,100,1e3],labels:p=["Caf\xE9","Propina","Boost"],theme:l="orange",incrementSpeed:P=50,incrementValue:_=10,avatarSeed:w,avatarSet:b="set1",image:u}){const[Z,f]=(0,a.useState)("initial"),[B,E]=(0,a.useState)(0),[R,T]=(0,a.useState)(""),[D,y]=(0,a.useState)(null),[Le,c]=(0,a.useState)(""),[I,A]=(0,a.useState)(""),[q,W]=(0,a.useState)(!1),[C,K]=(0,a.useState)(!1),[k,H]=(0,a.useState)(!1),[ee,oe]=(0,a.useState)(!1);(0,a.useEffect)(()=>{console.log("WebLNBoostButton props:",{receiverType:n,receiver:o,amounts:r,labels:p,theme:l,avatarSeed:w,avatarSet:b,image:u}),console.log("Avatar debug info:",{hasAvatarSeed:!!w,avatarSeedValue:w,avatarSetValue:b,hasImage:!!u,imageValue:u})},[n,o,r,p,l,w,b,u]),(0,a.useEffect)(()=>{const e=()=>{const t=/iPhone|iPad|Android/i.test(navigator.userAgent);K(t)};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]);const $=(0,a.useCallback)(e=>{var t,i,d,s;y(null),C||(e instanceof Error?(t=e.message)!=null&&t.toLowerCase().includes("not authorized")||(i=e.message)!=null&&i.toLowerCase().includes("permission denied")?c("Este sitio necesita autorizaci\xF3n en Alby. Por favor, autoriza el sitio en la extensi\xF3n y recarga la p\xE1gina."):(d=e.message)!=null&&d.toLowerCase().includes("no provider available")?c("No se detect\xF3 una billetera compatible con WebLN"):(s=e.message)!=null&&s.toLowerCase().includes("user rejected")?c("Pago cancelado por el usuario"):c("Error al inicializar WebLN"):c("Error desconocido al inicializar WebLN"))},[C]);(0,a.useEffect)(()=>{const e=()=>L(this,null,function*(){try{if(console.log("Iniciando initWebLN..."),!C)if(console.log("Verificando disponibilidad de WebLN..."),yield ve()){console.log("WebLN detectado, intentando habilitar...");try{const i=yield(0,j.requestProvider)();i&&(yield i.enable(),console.log("WebLN habilitado correctamente"),y(i),c(""))}catch(i){console.log("Error al habilitar WebLN:",i),c("Haz clic en 'Donate Sats' para habilitar el pago directo con Alby")}}else console.log("WebLN no detectado despu\xE9s de m\xFAltiples intentos"),c("No se detect\xF3 una billetera compatible con WebLN")}catch(t){console.error("Error al inicializar WebLN:",t),$(t)}});return y(null),c(""),e(),()=>{y(null),c("")}},[C,$]);const te=()=>L(this,null,function*(){try{console.log("Iniciando habilitaci\xF3n de WebLN...");const e=yield(0,j.requestProvider)();if(console.log("Provider obtenido:",e),!e)throw new Error("No se pudo obtener el proveedor WebLN");if(e._isEnabled){console.log("WebLN ya est\xE1 habilitado"),y(e),c("");return}yield e.enable(),console.log("WebLN habilitado correctamente"),y(e),c("")}catch(e){console.error("Error al habilitar WebLN:",e),$(e)}});(0,a.useEffect)(()=>{let e=null;return q&&(e=setInterval(()=>{E(t=>t+_)},P)),()=>{e&&clearInterval(e)}},[q,_,P]),(0,a.useEffect)(()=>{oe(!0)},[]);const ne=e=>{e<=0||E(e)},re=e=>{const t=parseInt(e.target.value);t<0?E(0):E(t)},ae=e=>{T(e.target.value)},F=()=>{E(0),T(""),f("initial")},se=()=>L(this,null,function*(){var i,d;const e=Math.round(B*1e3);let t;try{if(n==="lnurl")try{console.log("Procesando LNURL:",o);let v;o.toLowerCase().startsWith("lnurl")?v=he(o):v=o,console.log("URL decodificada o directa:",v);const S=yield fetch(v);if(!S.ok)throw console.error("Error en respuesta inicial:",S.status),new Error(`Error al obtener par\xE1metros LNURL: ${S.status}`);const g=yield S.json();if(console.log("Par\xE1metros LNURL recibidos:",g),!g.tag||g.tag!=="payRequest")throw console.error("Tag inv\xE1lido:",g.tag),new Error("El LNURL proporcionado no es un endpoint de pago v\xE1lido");if(console.log(`Verificando monto ${e} entre ${g.minSendable} y ${g.maxSendable}`),e<g.minSendable||e>g.maxSendable)throw new Error(`El monto debe estar entre ${g.minSendable/1e3} y ${g.maxSendable/1e3} sats`);const z=new URL(g.callback);z.searchParams.append("amount",e.toString());let N,h;try{if(R&&z.searchParams.append("comment",R),N=yield fetch(z.toString()),h=yield N.json(),h.status==="ERROR"&&((i=h.reason)!=null&&i.toLowerCase().includes("comment"))){console.log("El servicio no acepta comentarios, reintentando sin comentario");const U=new URL(g.callback);U.searchParams.append("amount",e.toString()),N=yield fetch(U.toString()),h=yield N.json()}}catch(U){throw console.error("Error al obtener la factura:",U),new Error("Error al generar la factura LNURL")}if(!N.ok)throw console.error("Error en respuesta de factura:",N.status),new Error(`Error al generar la factura LNURL: ${N.status}`);if(console.log("Datos de factura recibidos:",h),h.pr)return console.log("Factura encontrada en pr"),h.pr;if(h.invoice)return console.log("Factura encontrada en invoice"),h.invoice;throw console.error("No se encontr\xF3 factura en la respuesta:",h),new Error("No se pudo obtener la factura del servicio LNURL")}catch(v){throw console.error("Error detallado en el proceso LNURL:",v),new Error(`Error procesando LNURL: ${v instanceof Error?v.message:"Error desconocido"}`)}switch(n){case"lightning":t=yield fetch(`https://api.getalby.com/lnurl/generate-invoice?ln=${o}&amount=${e}&comment=${encodeURIComponent(R||"Boost con Bitflow")}`);break;case"node":t=yield fetch(`https://api.getalby.com/payments/keysend?node_id=${o}&amount=${e}&comment=${encodeURIComponent(R||"Boost con Bitflow")}`);break;default:throw new Error("Tipo de receptor no v\xE1lido")}if(!t.ok)throw new Error(`Error al generar factura: ${t.status}`);const s=yield t.json();if(console.log("Respuesta:",s),!((d=s.invoice)!=null&&d.pr)||typeof s.invoice.pr!="string")throw new Error("La factura no se gener\xF3 correctamente");return s.invoice.pr}catch(s){throw console.error("Error en generateInvoice:",s),s}}),ie=()=>ee?o?!0:(console.warn("Por favor, ingresa una direcci\xF3n de receptor"),!1):!0,le=()=>L(this,null,function*(){var e,t,i;if(!(k||!ie()))try{H(!0),console.log("Iniciando proceso de pago...");const d=yield se();if(console.log("Factura generada:",d),C||!D){console.log("Mostrando QR (m\xF3vil o sin WebLN)"),A(d),f("qr");return}try{console.log("Intentando pago con WebLN"),yield D.sendPayment(d),console.log("Pago completado con \xE9xito"),F()}catch(s){console.error("Error detallado en pago WebLN:",s),s instanceof Error?(e=s.message)!=null&&e.includes("User rejected")?(c("Pago cancelado por el usuario."),f("initial")):(t=s.message)!=null&&t.includes("not authorized")||(i=s.message)!=null&&i.includes("Permission denied")?(c("Este sitio necesita autorizaci\xF3n en Alby para pagar directamente. Por favor, autoriza el sitio en la extensi\xF3n Alby y vuelve a intentarlo."),f("qr")):(console.log("Mostrando QR despu\xE9s de error WebLN"),A(d),f("qr")):(console.log("Mostrando QR despu\xE9s de error WebLN"),A(d),f("qr"))}}catch(d){console.error("Error detallado en handleBoost:",d);const s=d instanceof Error?d.message:"Error desconocido";c(`Error al generar la factura: ${s}`),f("initial")}finally{H(!1)}}),V={orange:"#FF8C00",blue:"#3B81A2",green:"#2E7D32"},m=V[l]||V.orange,ce=()=>{if(u){let e=u;if(/^[A-Za-z0-9_-]+={0,2}$/.test(u))try{const t=u.replace(/-/g,"+").replace(/_/g,"/").padEnd(u.length+(4-u.length%4)%4,"="),i=atob(t);i.startsWith("http")&&(e=i)}catch(t){console.error("Error decodificando URL en renderAvatar:",t)}return React.createElement(X.default,{imageUrl:e,size:128})}return React.createElement(O.default,{seed:w||"default",set:b,size:128})};return React.createElement("div",{className:"flex flex-col items-center bg-transparent"},React.createElement("div",{className:"w-[460px] h-[420px] relative flex items-center justify-center bg-transparent"},React.createElement("div",{className:"w-[420px] h-[420px] rounded-2xl p-6 space-y-4 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center",style:{backgroundColor:m,minHeight:"420px",minWidth:"420px"}},(()=>{switch(Z){case"initial":return React.createElement("div",{className:"flex flex-col items-center gap-6"},React.createElement("div",{className:"w-32 h-32 relative"},ce()),React.createElement("h2",{className:"text-4xl font-bold text-white"},"Bitflow"),React.createElement(x.Button,{onClick:()=>L(this,null,function*(){yield te(),f("amount")}),className:"bg-white hover:bg-white/90 font-bold text-lg px-8 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",style:{color:m}},"Donate Sats"),n==="lightning"&&o&&React.createElement("div",{className:"mt-2 text-white/80 text-sm break-all text-center"},React.createElement("span",{className:"font-mono"},o)));case"amount":return React.createElement(React.Fragment,null,React.createElement("h1",{className:"text-3xl font-bold text-white mb-6"},"How many Sats?"),React.createElement("div",{className:"flex gap-4 mb-4 w-full max-w-[380px] justify-center"},r.map((e,t)=>React.createElement(x.Button,{key:e,onClick:()=>ne(e),className:`rounded-full w-[75px] h-[75px] text-xs flex flex-col items-center leading-tight justify-center ${B===e?"bg-white":"bg-transparent text-white border-2 border-white"}`,style:B===e?{color:m}:{}},React.createElement("span",{className:"font-medium text-[11px]"},we(p,t)||e),React.createElement("span",{className:"text-[10px] mt-0.5"},e," sats")))),React.createElement(x.Button,{onMouseDown:()=>W(!0),onMouseUp:()=>W(!1),onMouseLeave:()=>W(!1),onTouchStart:()=>W(!0),onTouchEnd:()=>W(!1),className:"w-22 h-22 mb-4 rounded-full bg-white hover:bg-white/90 font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform",style:{color:m}},React.createElement("div",{className:"flex flex-col items-center justify-center h-full text-xs font-bold"},React.createElement("span",null,"Press"),React.createElement("span",null,"to Boost"),React.createElement("span",{className:"text-lg mt-1 font-bold"},"\u26A1"))),React.createElement("div",{className:"w-full max-w-[300px] flex justify-center"},React.createElement("input",{type:"number",inputMode:"numeric",pattern:"[0-9]*",value:B||"",onChange:re,placeholder:"Enter an amount",className:"w-full px-4 py-2 mb-4 rounded-full text-center text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2",style:{color:m,"--tw-ring-color":m}})),React.createElement("div",{className:"flex gap-4"},React.createElement(x.Button,{onClick:()=>f("initial"),className:"bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"},"Back"),React.createElement(x.Button,{onClick:()=>f("note"),className:"bg-white hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",style:{color:m}},"Next")));case"note":return React.createElement(React.Fragment,null,React.createElement("h1",{className:"text-3xl font-bold text-white mb-8"},"Want to add a note?"),React.createElement("textarea",{value:R,onChange:ae,placeholder:"Enter your note here",className:"w-full max-w-[300px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2",style:{color:m,"--tw-ring-color":m}}),React.createElement("div",{className:"flex gap-4"},React.createElement(x.Button,{onClick:()=>f("amount"),className:"bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"},"Back"),React.createElement(x.Button,{onClick:le,disabled:k,className:`bg-white hover:bg-white/90 font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200
                  ${k?"opacity-50 cursor-not-allowed":""}`,style:{color:m}},k?"Processing...":"Next")));case"qr":return React.createElement("div",{className:"w-full h-full flex flex-col items-center justify-between gap-4"},React.createElement("div",{className:"flex flex-col items-center gap-4 overflow-y-auto max-h-[90%] w-full"},React.createElement("div",{className:"bg-white p-4 rounded-lg flex-shrink-0"},React.createElement(J.QRCodeSVG,{value:I,size:200})),React.createElement("div",{className:"w-full max-w-[320px] bg-[#2d2d2d] p-3 rounded-lg flex-shrink-0"},React.createElement("div",{className:"flex items-center justify-between mb-2"},React.createElement("p",{className:"text-xs text-white/70"},"Lightning Invoice:"),React.createElement("button",{onClick:()=>navigator.clipboard.writeText(I),className:"text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"},"Copiar")),React.createElement("p",{className:"text-[10px] text-white/90 font-mono break-all whitespace-pre-wrap"},I))),React.createElement(x.Button,{onClick:F,className:"bg-white hover:bg-white/90 font-bold text-lg px-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200 flex-shrink-0",style:{color:m}},"Done?"))}})())))}})();


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