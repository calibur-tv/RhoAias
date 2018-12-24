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
      color: $color-text-deep;
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
    <ul
      v-if="bangumis.length"
      id="bangumis"
      class="container">
      <li
        v-for="item in bangumis"
        :key="item.id"
      >
        <a
          :href="$alias.bangumi(item.id)"
          class="clearfix">
          <v-img
            :src="item.avatar"
            class="avatar"
            size="40"
          />
          <p
            class="name"
            v-text="item.name"/>
        </a>
      </li>
    </ul>
    <more-btn
      :no-more="true"
      :auto="true"
      :length="bangumis.length"
      :loading="false"
    />
  </div>
</template>

<script>
export default {
  name: 'UserBangumi',
  async asyncData({ route, store, ctx }) {
    await store.dispatch('users/getFollowBangumis', {
      ctx,
      zone: route.params.zone
    })
  },
  computed: {
    bangumis() {
      return this.$store.state.users.bangumis
    }
  }
}
</script>
