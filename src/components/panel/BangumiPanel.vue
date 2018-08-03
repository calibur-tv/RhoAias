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

      .follow {
        @include btn-empty($color-blue-deep);
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
      <v-img :src="$resize(avatar, { width: 80, height: 92 })"/>
    </a>
    <div :class="$style.content">
      <a :href="$alias.bangumi(id)">
        <h5 
          :class="$style.name" 
          v-text="name"/>
      </a>
      <div :class="$style.summary">
        <slot/>
      </div>
      <div :class="$style.controls">
        <button 
          :class="$style.create" 
          @click="handleCreate">发帖</button>
        <button 
          :class="$style.follow" 
          @click="actionFollow">{{ followed ? '已关注' : '关注' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "~/api/bangumiApi";

export default {
  name: "VBangumiPanel",
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
    }
  },
  data() {
    return {
      loadingFollow: false
    };
  },
  methods: {
    handleCreate() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      this.$channel.$emit("open-create-post-drawer", {
        id: this.id,
        name: this.name,
        avatar: this.avatar
      });
    },
    async actionFollow() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (this.loadingFollow) {
        return;
      }
      this.loadingFollow = true;
      const api = new Api(this);
      try {
        const result = await api.follow(this.id);
        this.$emit("follow", result);
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingFollow = false;
      }
    }
  }
};
</script>
