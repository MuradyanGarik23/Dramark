// Переключатель языка (RU / EN / HY). Без скриптов страница показывает оба языка сразу.
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

// Галерея скриншотов показывается, только если в папке screens/ лежат файлы 1.jpg, 2.jpg, … Нет файлов: блок скрыт.
(function () {
  var sec = document.getElementById("shots");
  if (!sec) return;
  var figs = sec.querySelectorAll("figure");
  var pending = figs.length, ok = 0;
  function done() { pending--; if (pending === 0 && ok > 0) sec.hidden = false; }
  Array.prototype.forEach.call(figs, function (f) {
    var img = f.querySelector("img");
    function good() { ok++; done(); }
    function bad() { if (f.parentNode) f.parentNode.removeChild(f); done(); }
    if (img.complete) { if (img.naturalWidth > 0) good(); else bad(); }
    else { img.addEventListener("load", good); img.addEventListener("error", bad); }
  });
})();
