const utils = {
  /**
   * takes an HTML Element and toggle an inert state
   * @param {HTMLElement} el
   * @param {boolean} makeInert
   * @returns
   */
  toggleInertEl: (el, makeInert) => {
    if (makeInert) {
      el.inert = true;
      el.parentElement.style.opacity = ".5";
      return;
    }
    el.inert = false;
    el.parentElement.style.opacity = "1";
  },
};

export default utils;
