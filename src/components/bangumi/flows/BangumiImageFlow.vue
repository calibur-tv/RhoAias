<template>
  <div id="bangumi-image-flow">
    <image-waterfall
      :loading="loading"
      @fetch="getImages"
    ></image-waterfall>
  </div>
</template>

<script>
  import ImageWaterfall from '~/components/lists/ImageWaterfall'

  export default {
    name: 'v-bangumi-image-flow',
    components: {
      ImageWaterfall
    },
    computed: {
      info () {
        return this.$store.state.bangumi.info
      }
    },
    data () {
      return {
        loading: false
      }
    },
    created () {
      if (!this.$store.state.image.waterfall.data.length) {
        this.getImages()
      }
    },
    methods: {
      async getImages () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('image/getBangumiImages', {
            ctx: this,
            id: this.info.id,
            force: false
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
