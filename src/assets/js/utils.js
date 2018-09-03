import { orderBy, throttle } from "lodash";

export default {
  shortenNumber(num) {
    return num > 1000 ? `${Math.floor((num / 1000) * 10) / 10}k` : num;
  },

  camelize(string, uppercaseFirstLetter = true) {
    const camelizeString = string.replace(
      /(?:^|[-])(\w)/g,
      (_, c) => (c ? c.toUpperCase() : "")
    );
    if (uppercaseFirstLetter) {
      return camelizeString;
    }
    return camelizeString[0].toLowerCase() + camelizeString.substring(1);
  },

  setStyle(element, styleName, value) {
    if (!element || !styleName) return;

    if (typeof styleName === "object") {
      for (const prop in styleName) {
        if (styleName.hasOwnProperty(prop)) {
          this.setStyle(element, prop, styleName[prop]);
        }
      }
    } else {
      styleName = this.camelize(styleName, false); // eslint-disable-line no-param-reassign
      if (styleName === "opacity" && Number(document.documentMode) < 9) {
        element.style.filter = isNaN(value)
          ? ""
          : `alpha(opacity=${value * 100})`;
      } else {
        element.style[styleName] = value;
      }
    }
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

  orderBy,

  throttle,

  hackFocus({ button, input, statement }) {
    if (
      !(button instanceof Element) ||
      !(input instanceof Element) ||
      !statement
    ) {
      return;
    }
    button.addEventListener("click", function(evt) {
      if (
        typeof statement === "string" &&
        evt.target.className.match(statement) === null
      ) {
        return;
      }
      input.style.display = "block";
      input.focus();
    });
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
