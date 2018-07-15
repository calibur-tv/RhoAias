<style lang="scss">
  .text-preview {
    position: relative;
    z-index: 1;

    .shim, textarea {
      width: 100%;
      display: block;
      font-weight: 400;
      font-family: inherit;
      font-size: 14px;
      line-height: 25px;
      letter-spacing: 0;
      padding-left: 15px;
      padding-right: 15px;
      margin-bottom: 46px;
      @extend %breakWord;
    }

    .shim {
      height: auto;
      position: relative;
      visibility: hidden;
      white-space: pre-wrap;
      min-height: 300px;
    }

    textarea {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      overflow-y: auto;
      border: none;
      resize: none;
      color: #333;
    }
  }
</style>

<template>
  <v-drawer
    v-model="show"
    from="right"
    size="100%"
    header-text="编辑文本段落"
    submit-text="确定"
  >
    <div v-if="show" class="text-preview">
      <pre
        class="shim"
        v-html="item.text"
      />
      <textarea
        v-model="text"
        placeholder="添加文字内容"
        @focus="textAreaFocus"
      />
    </div>
  </v-drawer>
</template>

<script>
  export default {
    name: 'TxtPreview',
    props: {
      item: {
        required: true,
        type: Object
      }
    },
    data () {
      return {
        show: false,
        saving: false
      }
    },
    computed: {
      text: {
        get () {
          return this.item.text.replace(/<br>/g, '\n')
        },
        set (value) {
          this.$store.commit('editor/UPDATE_SECTION_TEXT', {
            value: value.replace(/\n/g, '<br>')
          })
        }
      }
    },
    mounted () {
      this.$channel.$on('write-save-done', () => {
        this.saving = false
      })
      this.$channel.$on('write-open-drawer', ({ type }) => {
        if (type === 'txt') {
          this.show = true
        }
      })
    },
    methods: {
      textAreaFocus () {
        if (this.text.length < 100) {
          document.body.scrollTop = 0
        }
      },
      emitSave () {
        if (!this.text.replace(/\n/g, '')) {
          return
        }
        this.$channel.$emit('write-save')
        this.saving = true
      }
    }
  }
</script>
