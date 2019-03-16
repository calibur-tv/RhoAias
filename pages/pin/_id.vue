<template>
  <div id="pin-show">
    <ImageContent :info="info" />
    <SocialPanel
      :id="info.id"
      :is-creator="info.is_creator"
      :is-mine="isMine"
      type="image"
    />
    <div class="hr" />
    <div class="container">
      <BangumiPanel :bangumi="bangumi" />
    </div>
    <div class="hr" />
    <div class="container">
      <v-lazy>
        <CommentMain :id="id" :master-id="user.id" type="image" />
      </v-lazy>
    </div>
    <ShareBtn :share-data="share_data" />
  </div>
</template>

<script>
import { getImageInfo } from '~/api/imageApi'
import CommentMain from '~/components/comments/CommentMain'
import SocialPanel from '~/components/common/SocialPanel'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ImageContent from '~/components/image/ImageContent'
import ShareBtn from '~/components/common/ShareBtn'

export default {
  name: 'PinShow',
  components: {
    SocialPanel,
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
  computed: {
    isMine() {
      return this.$store.state.login
        ? this.info.user.id === this.$store.state.user.id
        : false
    }
  },
  asyncData({ app, store, params, error }) {
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
