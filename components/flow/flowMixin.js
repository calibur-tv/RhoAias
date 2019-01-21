export default {
  props: {
    func: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    id: {
      type: [Number, String],
      default: ''
    },
    sort: {
      type: String,
      default: ''
    },
    auto: {
      type: Boolean,
      default: true
    },
    changing: {
      type: String,
      default: 'id'
    },
    displayNoMore: {
      type: Boolean,
      default: true
    }
  }
}
