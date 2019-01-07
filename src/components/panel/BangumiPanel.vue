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

      .create {
        @include btn-empty(#333);
        margin-right: 10px;
      }
    }
  }
}
</style>

<template>
  <div :class="$style.bangumiPanel">
    <a 
      :class="$style.avatar" 
      :href="$alias.bangumi(id)">
      <v-img
        :src="avatar"
        width="80"
        height="92"
      />
    </a>
    <div :class="$style.content">
      <a :href="$alias.bangumi(id)">
        <h5 
          :class="$style.name"
          class="oneline"
          v-text="name"/>
      </a>
      <div :class="$style.summary">
        <slot/>
      </div>
      <div :class="$style.controls">
        <button
          v-if="createBtn"
          :class="$style.create"
          @click="handleCreate"
        >
          <i class="iconfont icon-pinglun"/>
          发帖
        </button>
        <follow-button
          :id="id"
          :followed="followed"
          type="bangumi"
          @submit="actionFollow"
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
    followed: {
      required: true,
      type: Boolean
    },
    createBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loadingFollow: false
    }
  },
  methods: {
    handleCreate() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      this.$channel.$emit('drawer-open-write-post')
    },
    actionFollow(result) {
      this.$emit('follow', result)
    }
  }
}
</script>
