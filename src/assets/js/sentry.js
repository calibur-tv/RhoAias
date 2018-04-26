import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default ({ url, version }) => {
  try {
    Raven.config(url, {
      release: version,
      environment: 'production',
      ignoreUrls: [
        /^file:\/\//
      ],
      shouldSendCallback (data) {
        let shouldSend = true
        try {
          const exception = data.exception.values[0]
          shouldSend = exception.stacktrace.frames.length > 1
        } catch (e) {
          shouldSend = false
        }
        return shouldSend
      },
      ignoreErrors: [
        'TuiaMedia is not defined',
        "Can't find variable: $UCBrowser",
        /MyAppGet.*AtPoint/,
        /UCArticleFinderJS/,
        'JSON Parse error',
        'playBackgroundMusic is not defined',
        "Cannot read property 'style' of",
        'Unexpected end of input',
        'object is not defined',
        'Unexpected end of JSON input',
        "Cannot call method 'querySelectorAll' of undefined",
        'value.hasOwnProperty is not a function',
        'Unexpected token o',
        "Cannot read property 'script' of null",
        'The index is not in the allowed range.',
        'undefined is not an object (evaluating',
        "null is not an object (evaluating 'conDoc.getElementsByTagName')",
        "null is not an object (evaluating 'v.src')",
        "null is not an object (evaluating 'window.mttLongPressVar.tagName')",
        "canvasList.forEach is not a function. (In 'canvasList.forEach', 'canvasList.forEach' is undefined)"
      ]
    }).addPlugin(RavenVue, Vue).install()
  } catch (e) {
    Raven.captureException(e)
  }
}
