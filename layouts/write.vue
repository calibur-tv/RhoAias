<style lang="scss">
#layout-write {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  > header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 48px;
    padding: 12px 10px;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    font-size: 12px;
    z-index: 10;
    .logo {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      margin-left: 5px;
      vertical-align: middle;
    }
    .slogan {
      display: inline-block;
      vertical-align: middle;
      p {
        line-height: 20px;
      }
    }
    button {
      float: right;
      margin-left: 15px;
      line-height: 24px;
    }
  }
  .calibur {
    float: left;
    margin-left: 2px;
  }
  .main-view {
    height: 100%;
    padding: 60px $container-padding 15px $container-padding;
  }
  .not-login {
    text-align: center;
    margin-top: 30vh;
    font-size: 14px;
    button {
      margin-top: 15px;
      @include btn-empty(#333);
    }
  }
}
</style>

<template>
  <div id="layout-write">
    <header>
      <button class="calibur" @click="goIndex">
        <img
          :src="
            $resize('https://image.calibur.tv/owner/logo-new/logo.png', {
              width: 50
            })
          "
          class="logo"
          alt="logo"
        />
        <span class="slogan">calibur.tv</span>
      </button>
      <template v-if="user">
        <button class="avatar" @click="goHome">
          <v-img :src="user.avatar" :avatar="true" :width="24" :height="24" />
        </button>
        <button class="primary" @click="emitPublish">
          发布
        </button>
        <button v-if="!published" class="warning" @click="emitSave">
          保存
        </button>
        <button class="success" @click="emitPreview">
          预览
        </button>
        <!--
        <button
          v-if="id"
          class="danger"
          @click="emitDestroy"
        >删除</button>
        -->
      </template>
    </header>
    <template>
      <router-view class="main-view" />
      <v-drawer
        v-model="preview"
        :footer="false"
        header-text="预览"
        submit-text="确认"
        from="bottom"
        size="100%"
        class="preview-drawer"
      >
        <json-content v-if="preview" :content="sections" />
      </v-drawer>
    </template>
  </div>
</template>

<script>
import JsonContent from '~/components/jsonEditor/JsonContent'

export default {
  name: 'WriteLayout',
  components: {
    JsonContent
  },
  data() {
    return {
      submitting: false,
      preview: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    user() {
      return this.$store.state.user
    },
    sections() {
      return this.$store.state.editor.sections
    },
    published() {
      return this.$store.state.editor.resource
        ? !!this.$store.state.editor.resource.published_at
        : false
    }
  },
  mounted() {
    this.$channel.$on('write-submit', result => {
      this.submitting = result
    })
  },
  methods: {
    emitPublish() {
      this.$channel.$emit('write-publish')
    },
    emitSave() {
      this.$channel.$emit('write-save')
    },
    emitPreview() {
      this.preview = true
    },
    emitDestroy() {
      this.$channel.$emit('write-destroy')
    },
    goHome() {
      this.$confirm('要离开写作界面吗?')
        .then(async () => {
          window.location = this.$alias.user(this.user.zone)
        })
        .catch(() => {})
    },
    goIndex() {
      this.$confirm('要离开写作界面吗?')
        .then(async () => {
          window.location = '/'
        })
        .catch(() => {})
    }
  }
}
</script>
