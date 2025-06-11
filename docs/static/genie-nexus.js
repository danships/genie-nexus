(function () {
  function updateHomeLink(fallback = true) {
    var homeButton = document.querySelector('.navbar-home-button');
    if (homeButton) {
      homeButton.setAttribute('href', '/');
      return;
    }

    if (fallback) {
      setTimeout(() => updateHomeLink(false), 1000);
    }
  }

  /**
   * We need this to be able to directly link outside the docs to the home page.
   */
  document.addEventListener('DOMContentLoaded', function () {
    updateHomeLink();
  });
})();
