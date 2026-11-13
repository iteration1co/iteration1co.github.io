// Fade the page content out before following an internal link.
// The new page fades itself in (see .page in style.css). The shared
// gradient backdrop is never faded, so only the text appears to change.
(function () {
  var FADE_OUT_MS = 900;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  document.addEventListener('click', function (e) {
    if (reduceMotion || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a[href]');
    if (!link || link.hasAttribute('download')) return;
    if (link.target && link.target !== '_self') return;

    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    // Same page: let in-page anchors behave normally; ignore reloads of this page.
    if (url.pathname === location.pathname && url.search === location.search) {
      if (!url.hash) e.preventDefault();
      return;
    }

    e.preventDefault();
    root.classList.add('is-leaving');
    setTimeout(function () { location.href = url.href; }, FADE_OUT_MS);
  });

  // Coming back with the Back button can restore this page exactly as it was
  // left (faded out), so make it visible again.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) root.classList.remove('is-leaving');
  });
})();
