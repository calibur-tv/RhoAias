export default {
  name: 'v-img',
  props: {
    tag: {
      type: String,
      default: 'img'
    },
    src: {
      required: true,
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 0
    },
    height: {
      type: [Number, String],
      default: 0
    },
    scale: {
      type: [Number, String],
      default: 1.3
    },
    mode: {
      type: [Number, String],
      default: 1
    },
    events: {
      type: Array,
      default: function () {
        return ['scroll']
      }
    },
    id: {},
    aspect: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  render: function (createElement) {
    return createElement(this.tag, {
      'class': {
        'image-lazy-mask': this.aspect,
        'image-loading': this.loading
      },
      style: this.aspect ? {
        paddingBottom: `${this.aspect * 100}%`
      } : {}
    })
  },
  data () {
    return {
      listeners: {},
      resource: this.src
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$checkInView(this.$el, (this.scale - 0))) {
        this.loadResource(this.$el)
      } else {
        const id = this.$eventManager.add(document, this.events, this.$utils.throttle(() => {
          if (this.$checkInView(this.$el, (this.scale - 0))) {
            this.loadResource(this.$el)
            this.$eventManager.del(id)
          }
        }, 200))
        if (this.id) {
          this.$channel.$on(`image-load-${this.id}`, () => {
            this.loadResource(this.$el)
            this.$eventManager.del(id)
            this.$channel.$off(`image-load-${this.id}`)
          })
        }
      }
    })
  },
  methods: {
    loadResource (image) {
      let src
      if (this.width && this.height) {
        src = this.$resize(this.resource, {
          width: (this.width - 0) * 2,
          height: (this.height - 0) * 2,
          mode: (this.mode - 0)
        })
      } else if (this.width) {
        src = this.$resize(this.resource, {
          width: (this.width - 0) * 2,
          mode: (this.mode - 0)
        })
      } else if (this.height) {
        src = this.$resize(this.resource, {
          height: (this.height - 0) * 2,
          mode: (this.mode - 0)
        })
      } else {
        src = this.resource
      }
      src = src.split('|http').length > 1 ? `http${src.split('|http').pop()}` : src
      if (this.tag.toLowerCase() === 'img') {
        image.setAttribute('src', src)
        image.addEventListener('load', () => {
          this.$utils.setStyle(image, 'padding-bottom', 0)
          image.classList.remove('image-lazy-mask', 'image-loading')
        })
      } else {
        this.$utils.setStyle(image, 'background-image', `url(${src})`)
      }
    }
  }
}
