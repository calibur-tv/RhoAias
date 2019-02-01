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
    count: {
      type: [String, Number],
      default: 12
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
