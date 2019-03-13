<style lang="scss" scoped>
.sub-title {
  margin-top: $container-padding;
}
</style>

<template>
  <div id="bangumi-video-flow" class="container">
    <section v-if="source.total">
      <div v-if="source.has_season">
        <div v-for="season in source.videos" :key="season.name">
          <h3 :key="season.name" class="sub-title" v-text="season.name" />
          <ul>
            <VideoFlowItem
              v-for="video in season.data"
              :key="video.id"
              :item="video"
              :bangumi-id="id"
            />
          </ul>
        </div>
      </div>
      <ul v-else>
        <VideoFlowItem
          v-for="video in source.videos[0].data"
          :key="video.id"
          :item="video"
          :bangumi-id="id"
        />
      </ul>
    </section>
  </div>
</template>

<script>
import { getBangumiVideos } from '~/api/bangumiApi'
import VideoFlowItem from '~/components/flow/item/VideoFlowItem'

export default {
  name: 'BangumiVideo',
  components: {
    VideoFlowItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      source: null
    }
  },
  asyncData({ params, app, error }) {
    return getBangumiVideos(app, {
      id: params.id
    })
      .then(source => {
        return { source }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  }
}
</script>
