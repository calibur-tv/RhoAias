const throttle = require('lodash/throttle')

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
      default: 2
    },
    mode: {
      type: [Number, String],
      default: 1
    },
    events: {
      type: Array,
      default: function () {
        return ['scroll', 'resize']
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
    }
  },
  render: function (createElement) {
    return createElement(this.tag, {
      attrs: {
        src: this.tag.toLowerCase() === 'img'
          ? this.loading
            ? 'data:image/gif;base64,R0lGODlhEAAQAKIGAMLY8YSx5HOm4Mjc88/g9Ofw+v///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAGACwAAAAAEAAQAAADMGi6RbUwGjKIXCAA016PgRBElAVlG/RdLOO0X9nK61W39qvqiwz5Ls/rRqrggsdkAgAh+QQFCgAGACwCAAAABwAFAAADD2hqELAmiFBIYY4MAutdCQAh+QQFCgAGACwGAAAABwAFAAADD1hU1kaDOKMYCGAGEeYFCQAh+QQFCgAGACwKAAIABQAHAAADEFhUZjSkKdZqBQG0IELDQAIAIfkEBQoABgAsCgAGAAUABwAAAxBoVlRKgyjmlAIBqCDCzUoCACH5BAUKAAYALAYACgAHAAUAAAMPaGpFtYYMAgJgLogA610JACH5BAUKAAYALAIACgAHAAUAAAMPCAHWFiI4o1ghZZJB5i0JACH5BAUKAAYALAAABgAFAAcAAAMQCAFmIaEp1motpDQySMNFAgA7'
            : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA'
          : null
      },
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
      const image = this.$el
      if (this.$checkInView(image, (this.scale - 0))) {
        this.loadResource(image)
      } else {
        const id = this.$eventManager.add(document, this.events, throttle(() => {
          if (this.$checkInView(image, (this.scale - 0))) {
            this.loadResource(image)
            this.$eventManager.del(id)
          }
        }, 500))
        if (this.id) {
          this.$channel.$on(`image-load-${this.id}`, () => {
            this.loadResource(image)
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
        image.style.backgroundImage = `url(${src})`
      }
      this.tag.toLowerCase() === 'img'
        ? image.setAttribute('src', src)
        : image.style.backgroundImage = `url(${src})`
    }
  }
}
