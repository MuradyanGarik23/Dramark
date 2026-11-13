// Dramark: переключатель языка (RU / EN / HY) и защита страницы от копирования.
// Без скриптов страница показывает все три языка сразу.

// 1. Переключатель языка
(function () {
  var root = document.documentElement;
  var lang = "ru";
  try { lang = localStorage.getItem("lang") || ""; } catch (e) {}
  if (lang !== "ru" && lang !== "en" && lang !== "hy") {
    var n = (navigator.language || "en").toLowerCase();
    lang = /^hy/.test(n) ? "hy" : /^(ru|uk|be|kk)/.test(n) ? "ru" : "en";
  }
  function apply(l) {
    root.setAttribute("data-show", l);
    root.setAttribute("lang", l);
    var b = document.querySelectorAll(".lang button");
    for (var i = 0; i < b.length; i++) b[i].setAttribute("aria-pressed", b[i].dataset.set === l ? "true" : "false");
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  apply(lang);
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(".lang button");
    if (t) apply(t.dataset.set);
  });
})();

// 2. Защита. Это сдерживание, а не замок: всё, что страница показывает, технически можно сфотографировать или скачать.
//    Цель — отбить простое копирование и оставить следы (уведомление об авторском праве, невидимая метка в тексте, перенаправление копий).
(function () {
  var ORIGIN = "https://muradyangarik23.github.io/Dramark/";
  // Адреса, на которых сайт может открываться. Переехали на свой домен — добавьте его сюда, иначе страница перенаправит на ORIGIN.
  var HOSTS = ["muradyangarik23.github.io", "localhost", "127.0.0.1", "[::1]", ""];
  var NOTICE = "© 2026 Muradyan. Dramark. Копирование запрещено / Copying is not permitted. garik11rm@gmail.com";
  var root = document.documentElement;

  // а) копия сайта на чужом адресе уводит посетителя на оригинал
  try {
    if (HOSTS.indexOf(location.hostname) === -1) { root.style.display = "none"; location.replace(ORIGIN); return; }
  } catch (e) {}

  // б) страницу нельзя встроить в чужой сайт (iframe): вместо содержимого остаётся ссылка на оригинал
  var framed = false;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (framed) {
    try { window.top.location.replace(location.href); } catch (e) {}           // чужую страницу браузер часто не даёт увести без нажатия
    document.body.textContent = "";
    var a = document.createElement("a");
    a.href = ORIGIN; a.target = "_top"; a.textContent = "Dramark — " + ORIGIN.replace(/^https?:\/\//, "");
    a.style.cssText = "display:block;padding:24px;font:17px/1.5 -apple-system,Arial,sans-serif";
    document.body.appendChild(a);
    return;
  }

  // в) копирование: адрес почты и страница политики остаются доступными, остальной текст не копируется
  var legalPage = !!document.querySelector("main.doc");
  function allowed(n) {
    try {
      var el = n && (n.nodeType === 1 ? n : n.parentElement);
      return !!(el && el.closest && el.closest("a[href^='mailto:'], main.doc"));
    } catch (e) { return false; }
  }
  function selectionAllowed() {
    try {
      var s = window.getSelection();
      return !!(s && s.rangeCount && allowed(s.anchorNode) && allowed(s.focusNode));
    } catch (e) { return false; }
  }
  ["copy", "cut"].forEach(function (name) {
    document.addEventListener(name, function (e) {
      if (selectionAllowed()) return;
      e.preventDefault();
      try { e.clipboardData.setData("text/plain", NOTICE); } catch (x) {}
    });
  });
  document.addEventListener("dragstart", function (e) { e.preventDefault(); });
  if (!legalPage) {
    document.addEventListener("contextmenu", function (e) { if (!allowed(e.target)) e.preventDefault(); });
    document.addEventListener("keydown", function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = (e.key || "").toLowerCase();
      if (k === "s" || k === "u" || k === "p") e.preventDefault();
    });
  }
})();
