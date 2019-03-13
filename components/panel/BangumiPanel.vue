<style lang="scss" module>
$panel-height: 92px;

.bangumi-panel {
  .avatar {
    display: block;
    float: left;
    width: 80px;
    height: $panel-height;
    border-radius: 5px;
    margin-right: 10px;
    overflow: hidden;
  }

  .content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: $panel-height;

    .name {
      font-size: 16px;
      font-weight: bold;
      display: block;
    }

    .controls {
      text-align: right;
    }
  }
}
</style>

<template>
  <div :class="$style.bangumiPanel">
    <nuxt-link :class="$style.avatar"
               :to="$alias.bangumi(id)"
    >
      <v-img :src="avatar"
             width="80" height="92"
      />
    </nuxt-link>
    <div :class="$style.content">
      <nuxt-link :to="$alias.bangumi(id)">
        <h5 :class="$style.name"
            class="oneline" v-text="name"
        />
      </nuxt-link>
      <div :class="$style.summary">
        <slot />
      </div>
      <div v-if="showFollow"
           :class="$style.controls"
      >
        <FollowButton :id="id"
                      type="bangumi"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FollowButton from '~/components/common/FollowButton'

export default {
  name: 'BangumiPanel',
  components: {
    FollowButton
  },
  props: {
    id: {
      required: true,
      type: Number
    },
    avatar: {
      required: true,
      type: String
    },
    name: {
      required: true,
      type: String
    },
    showFollow: {
      default: true,
      type: Boolean
    }
  }
}
</script>
