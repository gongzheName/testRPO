const debounce = function(fn, wait) {
    let timer = null;
    return function() {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    };
};

export {
  debounce,
};
