function createPxReplace(
  viewportSize,
  minPixelValue,
  unitPrecision,
  viewportUnit
) {
  return function(m, $1) {
    if (!$1) {
      return m
    }
    const pixels = parseFloat($1)
    if (pixels <= minPixelValue) {
      return m
    }
    return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit
  }
}

function toFixed(number, precision) {
  const multiplier = Math.pow(10, precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

/**
 * @param px {number|string|object}
 * @param viewportWidth {number}
 * @param unitPrecision {number}
 * @param viewportUnit {string}
 * @param minPixelValue {number}
 * @return {*}
 */
export default function px2vw(
  px,
  { viewportWidth, unitPrecision, viewportUnit, minPixelValue } = {
    viewportWidth: 375,
    unitPrecision: 5,
    viewportUnit: 'vw',
    minPixelValue: 1
  }
) {
  if (typeof px === 'number' || !Number.isNaN(+px)) {
    return toFixed((+px / viewportWidth) * 100, unitPrecision) + viewportUnit
  } else if (typeof px === 'string') {
    // 只转换px
    const pxRegex = new RegExp(
      '"[^"]+"|\'[^\']+\'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)' + 'px',
      'ig'
    )
    return px.replace(
      pxRegex,
      createPxReplace(viewportWidth, minPixelValue, unitPrecision, viewportUnit)
    )
  } else if (Object.prototype.toString.call(px) === '[object Object]') {
    const result = px
    Object.keys(px).forEach(key => {
      result[key] = px2vw(px[key])
    })
    return result
  }
  throw new Error('typeof px is invalid')
}
