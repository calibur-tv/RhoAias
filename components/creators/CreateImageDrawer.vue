<style lang="scss">
.create-image-drawer {
  .field {
    font-size: 16px;
    line-height: 48px;

    > span {
      float: left;
    }

    > div {
      color: #000;
      overflow: hidden;
    }

    .mint-switch {
      height: 48px;

      .mint-switch-input:checked + .mint-switch-core {
        background-color: $color-blue-light;
      }
    }
  }
}
</style>

<template>
  <v-drawer
    v-model="show"
    class="create-image-drawer"
    from="bottom"
    size="100%"
    header-text="上传图片"
  >
    <div class="tabs">
      <button 
        :class="{ active: sort === 'image' }" 
        @click="switchTab('image')">
        上传图片
      </button>
      <button 
        :class="{ active: sort === 'album' }" 
        @click="switchTab('album')">
        新建相册
      </button>
    </div>
    <div class="container">
      <v-drawer
        v-model="openPickerDrawer"
        :header-text="pickerDrawerHeaderText"
        class="bangumis-drawer"
        from="bottom"
        size="250px"
      >
        <mt-picker
          v-if="openImageAlbumDrawer"
          :slots="albumSlots"
          value-key="name"
          @change="onAlbumValuesChange"
        />
      </v-drawer>
      <template v-if="sort === 'image'">
        <div class="field">
          <span>单张模式：</span>
          <mt-switch v-model="isSingleModel" />
        </div>
        <template v-if="isSingleModel">
          <v-field
            v-model="image.name"
            label="名字"
            placeholder="请给图片起个名字"
            label-size="48px"
          />
          <div class="field">
            <span>番剧：</span>
            <bangumi-picker
              v-model="image.bangumiId"
              :label="false"
              :display="show && sort === 'image'"
            />
          </div>
          <div class="field">
            <span>原创：</span>
            <mt-switch v-model="image.creator" />
          </div>
          <div class="field">
            <span>图片：</span>
            <image-uploader @submit="createImage" />
          </div>
        </template>
        <template v-else>
          <div class="field">
            <span>相册：</span>
            <div
              @click="handleAlbumPickerBtnClick"
              v-text="imageAlbumPlaceholder"
            />
          </div>
          <div class="field">
            <span>图片：</span>
            <image-uploader 
              :limit="7" 
              @submit="createImage" />
          </div>
        </template>
      </template>
      <template v-else-if="sort === 'album'">
        <v-field
          v-model="album.name"
          label="名字"
          placeholder="请填写相册名字"
          label-size="48px"
        />
        <div class="field">
          <span>番剧：</span>
          <bangumi-picker
            v-model="album.bangumiId"
            :label="false"
            :display="show && sort === 'album'"
          />
        </div>
        <div class="field">
          <span>原创：</span>
          <mt-switch v-model="album.creator" />
        </div>
        <div class="field">
          <span>封面：</span>
          <image-uploader @submit="createAlbum" />
        </div>
      </template>
    </div>
  </v-drawer>
</template>

<script>
import { createAlbum, uploadSingleImage, uploadManyImage } from '~/api/imageApi'
import BangumiPicker from '~/components/bangumi/BangumiPicker'
import Field from '~/components/common/Field'
import ImageUploader from '~/components/common/ImageUploader'
import { Picker, Switch } from 'mint-ui'

export default {
  name: 'CreateImageDrawer',
  components: {
    'v-field': Field,
    'mt-switch': Switch,
    'mt-picker': Picker,
    BangumiPicker,
    ImageUploader
  },
  data() {
    return {
      show: false,
      sort: 'image',
      loadedUserAlbum: false,
      loadingBangumi: false,
      loadingUserAlbum: false,
      openPickerDrawer: false,
      openBangumisDrawer: false,
      openImageAlbumDrawer: false,
      submitting: false,
      albumSlots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: [],
          textAlign: 'center'
        }
      ],
      album: {
        name: '',
        bangumiId: '',
        creator: false,
        cartoon: false
      },
      image: {
        name: '',
        creator: false,
        bangumiId: '',
        selectedAlbum: false
      },
      isSingleModel: true
    }
  },
  computed: {
    imageAlbumPlaceholder() {
      if (this.loadingUserAlbum) {
        return '加载中...'
      }
      if (!this.albumSlots[0].values.length) {
        return '请先创建相册'
      }
      if (!this.image.selectedAlbum) {
        return '点击选择相册'
      }
      return this.getSelectedMeta('album', 'name')
    },
    pickerDrawerHeaderText() {
      if (this.openBangumisDrawer) {
        return '番剧'
      } else if (this.openImageAlbumDrawer) {
        return '相册'
      }
      return '选项卡'
    },
    user() {
      return this.$store.state.user || {}
    }
  },
  mounted() {
    this.$channel.$on('open-create-image-drawer', () => {
      this.getUserAlbum()
      this.show = true
    })
  },
  methods: {
    switchTab(tab) {
      this.sort = tab
      this.$channel.$emit('image-upload-done')
    },
    switchPickerDrawer(name) {
      this.openBangumisDrawer = false
      this.openImageAlbumDrawer = false
      this[name] = true
      this.openPickerDrawer = true
    },
    handleAlbumPickerBtnClick() {
      if (this.loadingUserAlbum) {
        this.$toast.error('数据加载中')
        return
      }
      if (!this.albumSlots[0].values.length) {
        this.$toast.error('还没有创建相册')
        return
      }
      this.image.selectedAlbum = true
      this.switchPickerDrawer('openImageAlbumDrawer')
    },
    onAlbumValuesChange(picker, values) {
      if (!values[0]) {
        return
      }
      const id = values[0].id
      this.albumSlots[0].values.forEach((item, index) => {
        if (item.id === id) {
          this.albumSlots[0].defaultIndex = index
        }
      })
    },
    async createAlbum(poster) {
      if (!this.album.name) {
        this.$toast.error('请填写相册名字')
        return
      }
      if (this.album.name.length > 30) {
        this.$toast.error('相册名字请缩减至 30 字以内')
        return
      }
      if (!this.album.bangumiId) {
        this.$toast.error('请选择要投稿的番剧')
        return
      }
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.$toast.loading('创建中')
      try {
        const result = await createAlbum(
          this,
          Object.assign({}, poster, {
            bangumi_id: this.album.bangumiId,
            is_cartoon: false,
            name: this.album.name,
            is_creator: this.album.creator,
            part: 0
          })
        )
        const data = result.data
        this.albumSlots[0].values.unshift(data)
        this.albumSlots[0].defaultIndex = 0
        this.$toast.success(result.message)
        this.$store.commit('UPDATE_USER_EXP', result.exp)
        this.image.albumId = data.id
        this.image.selectedAlbum = true
        this.isSingleModel = false
        this.switchTab('image')
        this.album = {
          name: '',
          bangumiId: '',
          creator: false,
          cartoon: false
        }
        this.$channel.$emit('image-upload-done')
      } finally {
        this.submitting = false
      }
    },
    async getUserAlbum() {
      if (this.loadingUserAlbum || this.loadedUserAlbum) {
        return
      }
      this.loadingUserAlbum = true
      try {
        this.albumSlots[0].values = await this.$store.dispatch(
          'image/userAlbum',
          {
            ctx: this
          }
        )
        this.loadedUserAlbum = true
      } finally {
        this.loadingUserAlbum = false
      }
    },
    async createImage(images) {
      if (this.isSingleModel) {
        if (!this.image.bangumiId) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.image.name.length > 30) {
          this.$toast.error('图片名字请缩减至 30 字以内')
          return
        }
      } else {
        if (!this.image.selectedAlbum) {
          this.$toast.error('请选择要上传的相册')
          return
        }
      }
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.$toast.loading('上传中...')
      let newId
      try {
        if (this.isSingleModel) {
          this.$captcha({
            ctx: this,
            success: async ({ data }) => {
              const result = await uploadSingleImage(
                this,
                Object.assign({}, images, {
                  is_creator: this.image.creator,
                  bangumi_id: this.image.bangumiId,
                  name: this.image.name,
                  geetest: data
                })
              )
              newId = result.data
              this.show = false
              this.$store.commit('UPDATE_USER_EXP', result.exp)
              this.$toast.success(result.message).then(() => {
                window.location = this.$alias.image(newId)
              })
              this.$channel.$emit('image-upload-done')
            },
            close: () => {
              this.submitting = false
            }
          })
        } else {
          newId = this.getSelectedMeta('album', 'id')
          await uploadManyImage(this, {
            album_id: newId,
            images
          })
          this.$toast.success('上传成功')
          this.show = false
          setTimeout(() => {
            window.location = this.$alias.image(newId)
          }, 400)
          this.$channel.$emit('image-upload-done')
        }
      } finally {
        this.submitting = false
      }
    },
    getSelectedMeta(name, value) {
      const key = `${name}Slots`
      if (!this[key][0].values.length) {
        return 0
      }
      return this[key][0].values[this[key][0].defaultIndex][value]
    }
  }
}
</script>
