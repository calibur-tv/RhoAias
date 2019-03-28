<style lang="scss">
#user-bangumi {
  li {
    position: relative;
    height: 62px;
    padding: 8px 0;
    @include border-bottom();

    a {
      display: block;
    }

    .avatar {
      margin-right: 12px;
      float: left;
    }

    p {
      color: $color-text-normal;
      font-size: 12px;
      margin-top: 6px;
      margin-bottom: 5px;
      @include twoline(14px);
    }
  }
}
</style>

<template>
  <div id="user-bangumi">
    <FlowList :id="zone" func="getUserFollowBangumis" type="page" sort="news">
      <ul
        v-if="flow.length"
        id="bangumis"
        slot-scope="{ flow }"
        class="container"
      >
        <li v-for="item in flow" :key="item.id">
          <nuxt-link :to="$alias.bangumi(item.id)" class="clearfix">
            <v-img :src="item.avatar" class="avatar" width="40" height="40" />
            <p class="name" v-text="item.name" />
          </nuxt-link>
        </li>
      </ul>
      <!-- <more-btn
        :no-more="true"
        :auto="true"
        :length="flow.length"
        :loading="false"
      /> -->
    </FlowList>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
export default {
  name: 'UserBangumi',
  components: {
    FlowList
  },
  props: {
    zone: {
      type: String,
      required: true
    }
  },
  async asyncData({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getUserFollowBangumis',
      sort: 'news',
      type: 'page',
      count: 9999,
      id: params.zone
    })
  }
}
</script>
