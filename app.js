// Переключатель языка (RU / EN). Без скриптов страница показывает оба языка сразу.
(function () {
  var root = document.documentElement;
  var lang = "ru";
  try { lang = localStorage.getItem("lang") || ""; } catch (e) {}
  if (lang !== "ru" && lang !== "en") {
    var n = (navigator.language || "en").toLowerCase();
    lang = /^(ru|uk|be|kk)/.test(n) ? "ru" : "en";
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
