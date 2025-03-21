
// Función global para renderizar el widget
window.renderBitflowWidget = (container, config) => {
  const { useState, useEffect } = React;
  const requestProvider = window.WebLN?.requestProvider;
  
  "use strict";
"use client";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = WebLNBoostButton;
var _react = require("react");
var _webln = require("webln");
var _button = require("@/app/components/ui/button");
var _qrcode = require("qrcode.react");
var _weblnGuide = require("./webln-guide");
var _roboAvatar = _interopRequireDefault(require("./ui/robo-avatar"));
var _customAvatar = _interopRequireDefault(require("./ui/custom-avatar"));
var _bech = require("bech32");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var RECIPIENT_ADDRESS = "bitflowz@getalby.com";
// Función para decodificar LNURL
var decodeLNURL = function decodeLNURL(lnurl) {
  try {
    var _bech32$decode = _bech.bech32.decode(lnurl, 2000),
      words = _bech32$decode.words;
    var data = _bech.bech32.fromWords(words);
    var url = new TextDecoder().decode(new Uint8Array(data));
    return url;
  } catch (_unused) {
    // Si falla el decode, asumimos que es una URL directa
    return lnurl;
  }
};
var getLabel = function getLabel(labels, index) {
  if (Array.isArray(labels)) {
    return labels[index] || '';
  }
  return '';
};
function WebLNBoostButton(_ref) {
  var _ref$receiverType = _ref.receiverType,
    receiverType = _ref$receiverType === void 0 ? 'lightning' : _ref$receiverType,
    _ref$receiver = _ref.receiver,
    receiver = _ref$receiver === void 0 ? RECIPIENT_ADDRESS : _ref$receiver,
    _ref$amounts = _ref.amounts,
    amounts = _ref$amounts === void 0 ? [21, 100, 1000] : _ref$amounts,
    _ref$labels = _ref.labels,
    labels = _ref$labels === void 0 ? ['Café', 'Propina', 'Boost'] : _ref$labels,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? 'orange' : _ref$theme,
    _ref$incrementSpeed = _ref.incrementSpeed,
    incrementSpeed = _ref$incrementSpeed === void 0 ? 50 : _ref$incrementSpeed,
    _ref$incrementValue = _ref.incrementValue,
    incrementValue = _ref$incrementValue === void 0 ? 10 : _ref$incrementValue,
    avatarSeed = _ref.avatarSeed,
    _ref$avatarSet = _ref.avatarSet,
    avatarSet = _ref$avatarSet === void 0 ? 'set1' : _ref$avatarSet,
    image = _ref.image;
  var _useState = (0, _react.useState)("initial"),
    _useState2 = _slicedToArray(_useState, 2),
    step = _useState2[0],
    setStep = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    amount = _useState4[0],
    setAmount = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    note = _useState6[0],
    setNote = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    webln = _useState8[0],
    setWebln = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState10 = _slicedToArray(_useState9, 2),
    weblnError = _useState10[0],
    setWeblnError = _useState10[1];
  var _useState11 = (0, _react.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    invoice = _useState12[0],
    setInvoice = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    isHolding = _useState14[0],
    setIsHolding = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    isMobile = _useState16[0],
    setIsMobile = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    isProcessing = _useState18[0],
    setIsProcessing = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    isClient = _useState20[0],
    setIsClient = _useState20[1];
  (0, _react.useEffect)(function () {
    console.log('WebLNBoostButton props:', {
      receiverType: receiverType,
      receiver: receiver,
      amounts: amounts,
      labels: labels,
      theme: theme,
      avatarSeed: avatarSeed,
      avatarSet: avatarSet,
      image: image
    });

    // Reset imageError when image url changes
    if (image) {
      // Precargar la imagen para detectar errores temprano
      var img = new window.Image();
      img.src = image;
      img.onerror = function () {
        console.error('Error precargando imagen:', image);
      };
    }

    // Log more detailed information about the avatar values
    console.log('Avatar debug info:', {
      hasAvatarSeed: Boolean(avatarSeed),
      avatarSeedValue: avatarSeed,
      avatarSetValue: avatarSet,
      hasImage: Boolean(image),
      imageValue: image
    });
  }, [receiverType, receiver, amounts, labels, theme, avatarSeed, avatarSet, image]);
  (0, _react.useEffect)(function () {
    // Detectar si es dispositivo móvil
    var checkMobile = function checkMobile() {
      var mobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
      if (mobile) {
        setWeblnError(""); // No mostrar error de WebLN en móvil
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return function () {
      return window.removeEventListener('resize', checkMobile);
    };
  }, []);
  (0, _react.useEffect)(function () {
    var initWebLN = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var provider;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              if (isMobile) {
                _context.next = 9;
                break;
              }
              _context.next = 4;
              return (0, _webln.requestProvider)();
            case 4:
              provider = _context.sent;
              _context.next = 7;
              return provider.enable();
            case 7:
              // Intentar habilitar inmediatamente
              setWebln(provider);
              setWeblnError("");
            case 9:
              _context.next = 16;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](0);
              console.error("WebLN no está disponible:", _context.t0);
              setWebln(null);
              if (!isMobile) {
                setWeblnError("No se detectó una billetera compatible con WebLN");
              }
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 11]]);
      }));
      return function initWebLN() {
        return _ref2.apply(this, arguments);
      };
    }();
    initWebLN();
  }, [isMobile]);
  (0, _react.useEffect)(function () {
    var intervalId = null;
    if (isHolding) {
      intervalId = setInterval(function () {
        setAmount(function (prev) {
          return prev + incrementValue;
        });
      }, incrementSpeed);
    }
    return function () {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isHolding, incrementValue, incrementSpeed]);
  (0, _react.useEffect)(function () {
    setIsClient(true);
  }, []);
  var handleAmountSelect = function handleAmountSelect(selectedAmount) {
    if (selectedAmount <= 0) return;
    setAmount(selectedAmount);
  };
  var handleCustomAmount = function handleCustomAmount(e) {
    var value = parseInt(e.target.value);
    if (value < 0) {
      setAmount(0);
    } else {
      setAmount(value);
    }
  };
  var handleNoteChange = function handleNoteChange(event) {
    setNote(event.target.value);
  };
  var resetToInitialState = function resetToInitialState() {
    setAmount(0);
    setNote("");
    setStep("initial");
  };
  var generateInvoice = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var msatsAmount, response, _data$invoice, decodedUrl, initialResponse, lnurlPayParams, callbackUrl, invoiceResponse, invoiceData, _invoiceData$reason, retryUrl, data;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            msatsAmount = Math.round(amount * 1000);
            _context2.prev = 1;
            if (!(receiverType === 'lnurl')) {
              _context2.next = 71;
              break;
            }
            _context2.prev = 3;
            console.log('Procesando LNURL:', receiver);
            if (receiver.toLowerCase().startsWith('lnurl')) {
              decodedUrl = decodeLNURL(receiver);
            } else {
              decodedUrl = receiver;
            }
            console.log('URL decodificada o directa:', decodedUrl);
            _context2.next = 9;
            return fetch(decodedUrl);
          case 9:
            initialResponse = _context2.sent;
            if (initialResponse.ok) {
              _context2.next = 13;
              break;
            }
            console.error('Error en respuesta inicial:', initialResponse.status);
            throw new Error("Error al obtener par\xE1metros LNURL: ".concat(initialResponse.status));
          case 13:
            _context2.next = 15;
            return initialResponse.json();
          case 15:
            lnurlPayParams = _context2.sent;
            console.log('Parámetros LNURL recibidos:', lnurlPayParams);
            if (!(!lnurlPayParams.tag || lnurlPayParams.tag !== 'payRequest')) {
              _context2.next = 20;
              break;
            }
            console.error('Tag inválido:', lnurlPayParams.tag);
            throw new Error('El LNURL proporcionado no es un endpoint de pago válido');
          case 20:
            console.log("Verificando monto ".concat(msatsAmount, " entre ").concat(lnurlPayParams.minSendable, " y ").concat(lnurlPayParams.maxSendable));
            if (!(msatsAmount < lnurlPayParams.minSendable || msatsAmount > lnurlPayParams.maxSendable)) {
              _context2.next = 23;
              break;
            }
            throw new Error("El monto debe estar entre ".concat(lnurlPayParams.minSendable / 1000, " y ").concat(lnurlPayParams.maxSendable / 1000, " sats"));
          case 23:
            callbackUrl = new URL(lnurlPayParams.callback);
            callbackUrl.searchParams.append('amount', msatsAmount.toString());
            _context2.prev = 25;
            if (note) {
              callbackUrl.searchParams.append('comment', note);
            }
            _context2.next = 29;
            return fetch(callbackUrl.toString());
          case 29:
            invoiceResponse = _context2.sent;
            _context2.next = 32;
            return invoiceResponse.json();
          case 32:
            invoiceData = _context2.sent;
            if (!(invoiceData.status === 'ERROR' && (_invoiceData$reason = invoiceData.reason) !== null && _invoiceData$reason !== void 0 && _invoiceData$reason.toLowerCase().includes('comment'))) {
              _context2.next = 43;
              break;
            }
            console.log('El servicio no acepta comentarios, reintentando sin comentario');
            retryUrl = new URL(lnurlPayParams.callback);
            retryUrl.searchParams.append('amount', msatsAmount.toString());
            _context2.next = 39;
            return fetch(retryUrl.toString());
          case 39:
            invoiceResponse = _context2.sent;
            _context2.next = 42;
            return invoiceResponse.json();
          case 42:
            invoiceData = _context2.sent;
          case 43:
            _context2.next = 49;
            break;
          case 45:
            _context2.prev = 45;
            _context2.t0 = _context2["catch"](25);
            console.error('Error al obtener la factura:', _context2.t0);
            throw new Error('Error al generar la factura LNURL');
          case 49:
            if (invoiceResponse.ok) {
              _context2.next = 52;
              break;
            }
            console.error('Error en respuesta de factura:', invoiceResponse.status);
            throw new Error("Error al generar la factura LNURL: ".concat(invoiceResponse.status));
          case 52:
            console.log('Datos de factura recibidos:', invoiceData);
            if (!invoiceData.pr) {
              _context2.next = 58;
              break;
            }
            console.log('Factura encontrada en pr');
            return _context2.abrupt("return", invoiceData.pr);
          case 58:
            if (!invoiceData.invoice) {
              _context2.next = 63;
              break;
            }
            console.log('Factura encontrada en invoice');
            return _context2.abrupt("return", invoiceData.invoice);
          case 63:
            console.error('No se encontró factura en la respuesta:', invoiceData);
            throw new Error('No se pudo obtener la factura del servicio LNURL');
          case 65:
            _context2.next = 71;
            break;
          case 67:
            _context2.prev = 67;
            _context2.t1 = _context2["catch"](3);
            console.error('Error detallado en el proceso LNURL:', _context2.t1);
            throw new Error("Error procesando LNURL: ".concat(_context2.t1 instanceof Error ? _context2.t1.message : 'Error desconocido'));
          case 71:
            _context2.t2 = receiverType;
            _context2.next = _context2.t2 === 'lightning' ? 74 : _context2.t2 === 'node' ? 78 : 82;
            break;
          case 74:
            _context2.next = 76;
            return fetch("https://api.getalby.com/lnurl/generate-invoice?ln=".concat(receiver, "&amount=").concat(msatsAmount, "&comment=").concat(encodeURIComponent(note || "Boost con Bitflow")));
          case 76:
            response = _context2.sent;
            return _context2.abrupt("break", 83);
          case 78:
            _context2.next = 80;
            return fetch("https://api.getalby.com/payments/keysend?node_id=".concat(receiver, "&amount=").concat(msatsAmount, "&comment=").concat(encodeURIComponent(note || "Boost con Bitflow")));
          case 80:
            response = _context2.sent;
            return _context2.abrupt("break", 83);
          case 82:
            throw new Error("Tipo de receptor no válido");
          case 83:
            if (response.ok) {
              _context2.next = 85;
              break;
            }
            throw new Error("Error al generar factura: ".concat(response.status));
          case 85:
            _context2.next = 87;
            return response.json();
          case 87:
            data = _context2.sent;
            console.log("Respuesta:", data);
            if (!(!((_data$invoice = data.invoice) !== null && _data$invoice !== void 0 && _data$invoice.pr) || typeof data.invoice.pr !== 'string')) {
              _context2.next = 91;
              break;
            }
            throw new Error("La factura no se generó correctamente");
          case 91:
            return _context2.abrupt("return", data.invoice.pr);
          case 94:
            _context2.prev = 94;
            _context2.t3 = _context2["catch"](1);
            console.error("Error en generateInvoice:", _context2.t3);
            throw _context2.t3;
          case 98:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 94], [3, 67], [25, 45]]);
    }));
    return function generateInvoice() {
      return _ref3.apply(this, arguments);
    };
  }();
  var validateReceiver = function validateReceiver() {
    if (!isClient) return true; // No validar durante SSR
    if (!receiver) {
      console.warn("Por favor, ingresa una dirección de receptor");
      return false;
    }
    return true;
  };
  var handleBoost = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var _invoice, _weblnError$message, errorMessage;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(isProcessing || !validateReceiver())) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return");
          case 2:
            _context3.prev = 2;
            setIsProcessing(true);
            console.log('Iniciando proceso de pago...');
            _context3.next = 7;
            return generateInvoice();
          case 7:
            _invoice = _context3.sent;
            console.log('Factura generada:', _invoice);

            // En móvil o sin WebLN, ir directo al QR
            if (!(isMobile || !webln)) {
              _context3.next = 14;
              break;
            }
            console.log('Mostrando QR (móvil o sin WebLN)');
            setInvoice(_invoice);
            setStep("qr");
            return _context3.abrupt("return");
          case 14:
            _context3.prev = 14;
            console.log('Intentando pago con WebLN');
            _context3.next = 18;
            return webln.sendPayment(_invoice);
          case 18:
            console.log('Pago completado con éxito');
            resetToInitialState();
            _context3.next = 26;
            break;
          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](14);
            console.error("Error detallado en pago WebLN:", _context3.t0);
            if (_context3.t0 instanceof Error && (_weblnError$message = _context3.t0.message) !== null && _weblnError$message !== void 0 && _weblnError$message.includes('User rejected')) {
              setWeblnError("Pago cancelado por el usuario.");
              setStep("initial");
            } else {
              console.log('Mostrando QR después de error WebLN');
              setInvoice(_invoice);
              setStep("qr");
            }
          case 26:
            _context3.next = 34;
            break;
          case 28:
            _context3.prev = 28;
            _context3.t1 = _context3["catch"](2);
            console.error("Error detallado en handleBoost:", _context3.t1);
            errorMessage = _context3.t1 instanceof Error ? _context3.t1.message : 'Error desconocido';
            setWeblnError("Error al generar la factura: ".concat(errorMessage));
            setStep("initial");
          case 34:
            _context3.prev = 34;
            setIsProcessing(false);
            return _context3.finish(34);
          case 37:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[2, 28, 34, 37], [14, 22]]);
    }));
    return function handleBoost() {
      return _ref4.apply(this, arguments);
    };
  }();
  var themeColors = {
    orange: '#FF8C00',
    blue: '#3B81A2',
    green: '#2E7D32'
  };
  var currentThemeColor = themeColors[theme] || themeColors.orange;
  var renderStep = function renderStep() {
    switch (step) {
      case "initial":
        return /*#__PURE__*/React.createElement("div", {
          className: "relative w-full h-full"
        }, /*#__PURE__*/React.createElement("div", {
          className: "absolute inset-0 rounded-lg flex flex-col items-center justify-center",
          style: {
            backgroundColor: currentThemeColor
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "relative w-24 h-24 mb-4"
        }, /*#__PURE__*/React.createElement("div", {
          className: "absolute inset-0 bg-[#3B81A2] rounded-full"
        }, image ? /*#__PURE__*/React.createElement(_customAvatar["default"], {
          imageUrl: image,
          size: 96,
          className: "w-full h-full"
        }) : /*#__PURE__*/React.createElement(_roboAvatar["default"], {
          seed: avatarSeed || 'default',
          set: avatarSet,
          size: 96,
          className: "w-full h-full"
        }))), /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold text-white mb-6"
        }, "Bitflow"), /*#__PURE__*/React.createElement(_button.Button, {
          onClick: function onClick() {
            return setStep("amount");
          },
          className: "bg-white text-[#3B81A2] hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
        }, "Donate Sats")));
      case "amount":
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold text-white mb-6"
        }, "How many Sats?"), /*#__PURE__*/React.createElement("div", {
          className: "flex gap-3 mb-4 w-full max-w-[280px] justify-center"
        }, amounts.map(function (preset, index) {
          return /*#__PURE__*/React.createElement(_button.Button, {
            key: preset,
            onClick: function onClick() {
              return handleAmountSelect(preset);
            },
            className: "rounded-full px-4 py-3 flex-1 text-sm flex flex-col items-center leading-tight h-[70px] justify-center ".concat(amount === preset ? "bg-white" : "bg-transparent text-white border-2 border-white"),
            style: amount === preset ? {
              color: currentThemeColor
            } : {}
          }, /*#__PURE__*/React.createElement("span", {
            className: "font-medium"
          }, getLabel(labels, index) || preset), /*#__PURE__*/React.createElement("span", {
            className: "text-xs mt-1"
          }, preset, " sats"));
        })), /*#__PURE__*/React.createElement(_button.Button, {
          onMouseDown: function onMouseDown() {
            return setIsHolding(true);
          },
          onMouseUp: function onMouseUp() {
            return setIsHolding(false);
          },
          onMouseLeave: function onMouseLeave() {
            return setIsHolding(false);
          },
          onTouchStart: function onTouchStart() {
            return setIsHolding(true);
          },
          onTouchEnd: function onTouchEnd() {
            return setIsHolding(false);
          },
          className: "w-22 h-22 mb-4 rounded-full bg-white hover:bg-white/90 font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform",
          style: {
            color: currentThemeColor
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col items-center justify-center h-full text-xs font-bold"
        }, /*#__PURE__*/React.createElement("span", null, "Press"), /*#__PURE__*/React.createElement("span", null, "to Boost"), /*#__PURE__*/React.createElement("span", {
          className: "text-lg mt-1 font-bold"
        }, "\u26A1"))), /*#__PURE__*/React.createElement("div", {
          className: "w-full max-w-[280px] flex justify-center"
        }, /*#__PURE__*/React.createElement("input", {
          type: "number",
          inputMode: "numeric",
          pattern: "[0-9]*",
          value: amount || "",
          onChange: handleCustomAmount,
          placeholder: "Enter an amount",
          className: "w-full px-4 py-2 mb-4 rounded-full text-center text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2",
          style: {
            color: currentThemeColor,
            '--tw-ring-color': currentThemeColor
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "flex gap-4"
        }, /*#__PURE__*/React.createElement(_button.Button, {
          onClick: function onClick() {
            return setStep("initial");
          },
          className: "bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"
        }, "Back"), /*#__PURE__*/React.createElement(_button.Button, {
          onClick: function onClick() {
            return setStep("note");
          },
          className: "bg-white hover:bg-white/90 font-bold text-lg px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",
          style: {
            color: currentThemeColor
          }
        }, "Next")));
      case "note":
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
          className: "text-3xl font-bold text-white mb-8"
        }, "Want to add a note?"), /*#__PURE__*/React.createElement("textarea", {
          value: note,
          onChange: handleNoteChange,
          placeholder: "Enter your note",
          className: "w-full max-w-[320px] p-4 rounded-3xl text-xl mb-6 h-40 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2",
          style: {
            color: currentThemeColor,
            '--tw-ring-color': currentThemeColor
          }
        }), /*#__PURE__*/React.createElement("div", {
          className: "flex gap-4"
        }, /*#__PURE__*/React.createElement(_button.Button, {
          onClick: function onClick() {
            return setStep("amount");
          },
          className: "bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold text-lg px-6 py-3 rounded-full transition-all duration-200"
        }, "Back"), /*#__PURE__*/React.createElement(_button.Button, {
          onClick: handleBoost,
          disabled: isProcessing,
          className: "bg-white hover:bg-white/90 font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200\n                  ".concat(isProcessing ? 'opacity-50 cursor-not-allowed' : ''),
          style: {
            color: currentThemeColor
          }
        }, isProcessing ? 'Processing...' : 'Next')));
      case "qr":
        return /*#__PURE__*/React.createElement("div", {
          className: "w-full flex flex-col items-center"
        }, /*#__PURE__*/React.createElement("div", {
          className: "bg-white p-4 rounded-lg mb-4"
        }, /*#__PURE__*/React.createElement(_qrcode.QRCodeSVG, {
          value: invoice,
          size: 200
        })), /*#__PURE__*/React.createElement("div", {
          className: "w-full bg-[#2d2d2d] p-3 rounded-lg mb-4"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between mb-2"
        }, /*#__PURE__*/React.createElement("p", {
          className: "text-xs text-white/70"
        }, "Lightning Invoice:"), /*#__PURE__*/React.createElement("button", {
          onClick: function onClick() {
            return navigator.clipboard.writeText(invoice);
          },
          className: "text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
        }, "Copiar")), /*#__PURE__*/React.createElement("p", {
          className: "text-[10px] text-white/90 font-mono truncate"
        }, invoice)), /*#__PURE__*/React.createElement(_button.Button, {
          onClick: resetToInitialState,
          className: "bg-white hover:bg-white/90 font-bold text-lg px-6 py-2 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-200",
          style: {
            color: currentThemeColor
          }
        }, "Done?"));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center w-full h-full rounded-3xl p-6 space-y-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden",
    style: {
      backgroundColor: currentThemeColor,
      width: '100%',
      height: '100%',
      minHeight: '410px'
    }
  }, renderStep())), weblnError && /*#__PURE__*/React.createElement("div", {
    className: "w-[400px]"
  }, /*#__PURE__*/React.createElement(_weblnGuide.WebLNGuide, null)));
}

  // Renderizar el componente
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(WebLNBoostButton, config));
};