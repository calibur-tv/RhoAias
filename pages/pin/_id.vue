<style lang="scss">
#image-album {
  .album-footer {
    .bangumi-panel {
      padding-top: $container-padding;
      padding-bottom: $container-padding;

      .summary {
        font-size: 12px;
        color: #666;
        @include twoline(13px);
      }
    }
  }
}
</style>

<template>
  <div id="image-album">
    <ImageContent :info="info" />
    <div class="container">
      <v-lazy>
        <CommentMain :id="id" :master-id="user.id" type="image" />
      </v-lazy>
      <div class="hr" />
      <div class="album-footer">
        <div class="bangumi-panel">
          <h3 class="sub-title">
            所属番剧：
          </h3>
          <BangumiPanel
            :id="bangumi.id"
            :name="bangumi.name"
            :avatar="bangumi.avatar"
          >
            <p class="summary" v-text="bangumi.summary" />
          </BangumiPanel>
        </div>
      </div>
    </div>
    <ShareBtn :share-data="share_data" />
  </div>
</template>

<script>
import { getImageInfo } from '~/api/imageApi'
import CommentMain from '~/components/comments/CommentMain'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ImageContent from '~/components/image/ImageContent'
import ShareBtn from '~/components/common/ShareBtn'

export default {
  name: 'ImageAlbum',
  components: {
    CommentMain,
    BangumiPanel,
    ImageContent,
    ShareBtn
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      info: null,
      user: null,
      bangumi: null,
      share_data: null
    }
  },
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getImageInfo(app, { id })
      .then(info => {
        const { bangumi } = info
        store.commit('social/SET_STATE', {
          type: 'image',
          id,
          data: {
            like: info.liked,
            reward: info.rewarded,
            mark: info.marked,
            like_users: info.like_users,
            mark_users: info.mark_users,
            reward_users: info.reward_users
          }
        })
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return {
          info,
          bangumi,
          user: info.user,
          share_data: info.share_data
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  head() {
    return {
      title: this.info.name,
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify(this.share_data),
          type: 'application/json'
        }
      ]
    }
  }
}
</script>
