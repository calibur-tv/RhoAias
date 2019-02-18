<template>
  <div id="bangumi-show">
    <bangumi-header :info="info"/>
    <tab-container
      :headers="headers"
      :router="true"
    />
    <nuxt-child/>
  </div>
</template>

<script>
import BangumiHeader from '~/components/bangumi/BangumiHeader'
import TabContainer from '~/components/common/TabContainer'
import { getBangumiInfo } from '~/api/bangumiApi'

export default {
  name: 'BangumiShowLayout',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  asyncData({ app, params, store, error }) {
    const { id } = params
    return getBangumiInfo(app, { id })
      .then(info => {
        store.commit('social/SET_STATE', {
          id,
          type: 'bangumi',
          data: {
            follow: info.followed,
            follow_users: info.follow_users
          }
        })
        return { info }
      })
      .catch(error)
  },
  components: {
    BangumiHeader,
    TabContainer
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  head() {
    return {
      title: this.info.name,
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify(this.info.share_data),
          type: 'application/json'
        }
      ]
    }
  },
  data() {
    return {
      info: null
    }
  },
  computed: {
    headers() {
      if (!this.info) {
        return []
      }
      const { has_video, has_cartoon } = this.info
      const result = [
        {
          label: '帖子',
          route: 'bangumi-id-post'
        }
      ]
      if (has_video) {
        result.push({
          label: '视频',
          route: 'bangumi-id-video'
        })
      }
      if (has_cartoon) {
        result.push({
          label: '漫画',
          route: 'bangumi-id-cartoon'
        })
      }
      return result.concat([
        {
          label: '股市',
          route: 'bangumi-id-role'
        },
        {
          label: '相册',
          route: 'bangumi-id-pins'
        },
        {
          label: '漫评',
          route: 'bangumi-id-review'
        },
        {
          label: '问答',
          route: 'bangumi-id-qaq'
        }
      ])
    }
  }
}
</script>
