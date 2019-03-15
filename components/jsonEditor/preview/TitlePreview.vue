<style lang="scss">
.text-preview {
  position: relative;
  z-index: 1;

  input {
    width: 100%;
    height: 40px;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid $color-line;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
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
      <input
        v-model.trim="text"
        type="text"
        placeholder="段落小标题"
        maxlength="30"
      >
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
  data() {
    return {
      show: false,
      saving: false
    }
  },
  computed: {
    text: {
      get() {
        return this.item.text
      },
      set(value) {
        this.$store.commit('editor/UPDATE_SECTION_TEXT', {
          value
        })
      }
    }
  },
  mounted() {
    this.$channel.$on('write-save-done', () => {
      this.saving = false
    })
    this.$channel.$on('write-open-drawer', ({ type }) => {
      if (type === 'title') {
        this.show = true
      }
    })
  },
  methods: {
    emitSave() {
      if (!this.text.replace(/\n/g, '')) {
        return
      }
      this.$channel.$emit('write-save')
      this.saving = true
    }
  }
}
</script>
