export default {
  shortenNumber(num) {
    return num > 1000 ? `${Math.floor((num / 1000) * 10) / 10}k` : num;
  },

  timeLong(time) {
    const formatTime = /^\d+$/.test(time)
      ? time.toString().length === 13
        ? parseInt((time - 0) / 1000, 10)
        : time * 1000
      : time.replace(/-/g, "/");
    const date = new Date(formatTime);
    return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.substr(
      -2
    )}-${`0${date.getDate()}`.substr(-2)} ${`0${date.getHours()}`.substr(
      -2
    )}:${`0${date.getMinutes()}`.substr(-2)}:${`0${date.getSeconds()}`.substr(
      -2
    )}`;
  },

  throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      let now = Date.now();
      if (!previous && options.leading === false) previous = now;
      let remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },

  createFileName({ userId, type, id, file }) {
    return `user/${userId}/${type}/${id}/${new Date().getTime()}-${Math.random()
      .toString(36)
      .substring(3, 6)}.${file.type.split("/").pop()}`;
  },

  getOffsetTop(elem) {
    let offsetTop = 0;
    do {
      if (!isNaN(elem.offsetTop)) {
        offsetTop += elem.offsetTop;
      }
    } while ((elem = elem.offsetParent)); // eslint-disable-line no-cond-assign
    return offsetTop;
  },

  shuffle(array) {
    for (let i = array.length; i; i--) {
      const j = Math.floor(Math.random() * i);
      [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }

    return array;
  }
};
