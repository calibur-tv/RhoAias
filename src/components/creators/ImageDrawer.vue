<style lang="scss">
  .create-image-drawer {
    .field {
      font-size: 16px;
      line-height: 48px;

      span {
        float: left;
      }

      div {
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

    .el-upload-list__item,
    .el-upload--picture-card {
      width: 15vw;
      height: 15vw;
      line-height: 15vw;
    }

    .el-upload-list__item-delete {
      float: none !important;
    }

    .btn-submit {
      margin-top: 15px;
    }
  }
</style>

<template>
  <v-drawer
    class="create-image-drawer"
    v-model="show"
    from="bottom"
    size="100%"
    header-text="上传图片"
  >
    <div class="tabs">
      <button @click="switchTab('image')" :class="{ 'active': sort === 'image' }">上传图片</button>
      <button @click="switchTab('album')" :class="{ 'active': sort === 'album' }">新建相册</button>
    </div>
    <div class="container">
      <v-drawer
        v-model="openPickerDrawer"
        class="bangumis-drawer"
        from="bottom"
        size="250px"
        :header-text="pickerDrawerHeaderText"
      >
        <mt-picker
          v-if="openBangumisDrawer"
          :slots="bangumiSlots"
          @change="onBangumiValuesChange"
          valueKey="name"
        ></mt-picker>
        <mt-picker
          v-else-if="openImageTagsDrawer"
          :slots="tagsSlots"
          @change="onTagsValuesChange"
          valueKey="name"
        ></mt-picker>
        <mt-picker
          v-else-if="openImageSizeDrawer"
          :slots="sizeSlots"
          @change="onSizeValuesChange"
          valueKey="name"
        ></mt-picker>
        <mt-picker
          v-else-if="openImageRoleDrawer"
          :slots="roleSlots"
          @change="onRoleValuesChange"
          valueKey="name"
        ></mt-picker>
        <mt-picker
          v-else-if="openImageAlbumDrawer"
          :slots="albumSlots"
          @change="onAlbumValuesChange"
          valueKey="name"
        ></mt-picker>
      </v-drawer>
      <template v-if="sort === 'image'">
        <div class="field">
          <span>类型：</span>
          <div
            @click="handleImageTagsPickerBtnClick"
            v-text="imageTagsPlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>尺寸：</span>
          <div
            @click="handleImageSizePickerBtnClick"
            v-text="imageSizePlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>番剧：</span>
          <div
            @click="handleImageBangumiPickerBtnClick"
            v-text="imageBangumiPlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>角色：</span>
          <div
            @click="handleRolePickerBtnClick"
            v-text="imageRolePlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>相册：</span>
          <div
            @click="handleAlbumPickerBtnClick"
            v-text="imageAlbumPlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>原创：</span>
          <mt-switch v-model="image.creator"></mt-switch>
        </div>
        <div class="field">
          <span>图片：</span>
          <el-upload
            action="https://upload.qiniup.com"
            ref="imageUploader"
            list-type="picture-card"
            :data="uploadHeaders"
            :on-error="handleImageUploadError"
            :on-remove="handleRemoveImage"
            :on-success="handleImageUploadSuccess"
            :before-upload="beforeImageUpload"
            :file-list="image.data"
            :on-exceed="handleExceed"
            multiple
            :limit="exceed"
          >+</el-upload>
        </div>
        <button
          class="btn-submit"
          @click="createImage"
        >确认上传</button>
      </template>
      <template v-else-if="sort === 'album'">
        <v-field
          v-model="album.name"
          label="名称"
          placeholder="请填写相册名称"
          label-size="48px"
        ></v-field>
        <div class="field">
          <span>番剧：</span>
          <div
            @click="handleAlbumBangumiPickerBtnClick"
            v-text="albumBangumiPlaceholder"
          ></div>
        </div>
        <div class="field">
          <span>原创：</span>
          <mt-switch v-model="album.creator"></mt-switch>
        </div>
        <div class="field" v-if="user.faker">
          <span>漫画：</span>
          <mt-switch v-model="album.cartoon"></mt-switch>
        </div>
        <div class="field">
          <span>封面：</span>
          <el-upload
            action="https://upload.qiniup.com"
            list-type="picture-card"
            ref="albumUploader"
            :data="uploadHeaders"
            :on-error="handlePosterUploadError"
            :on-success="handleAlbumUploadSuccess"
            :before-upload="beforeUpload"
            :on-remove="handleAlbumPosterRemove"
            :file-list="album.poster"
          >+</el-upload>
        </div>
        <button
          class="btn-submit"
          @click="createAlbum"
        >确认</button>
      </template>
    </div>
  </v-drawer>
</template>

<script>
  import ImageApi from '~/api/imageApi'

  export default {
    name: 'create-image-drawer',
    computed: {
      albumBangumiPlaceholder () {
        if (this.loadingBangumi) {
          return '加载中...'
        }
        if (!this.album.selectedBangumi) {
          return '点击选择番剧'
        }
        return this.getSelectedMeta('bangumi', 'name')
      },
      imageBangumiPlaceholder () {
        if (this.loadingBangumi) {
          return '加载中...'
        }
        if (!this.image.selectedBangumi) {
          return '点击选择番剧'
        }
        return this.getSelectedMeta('bangumi', 'name')
      },
      imageTagsPlaceholder () {
        if (this.loadingUploadType) {
          return '加载中...'
        }
        if (!this.image.selectedTags) {
          return '点击选择类型'
        }
        return this.getSelectedMeta('tags', 'name')
      },
      imageSizePlaceholder () {
        if (this.loadingUploadType) {
          return '加载中...'
        }
        if (!this.image.selectedSize) {
          return '点击选择尺寸'
        }
        return this.getSelectedMeta('size', 'name')
      },
      imageRolePlaceholder () {
        if (this.loadingBangumiRole) {
          return '加载中...'
        }
        if (!this.image.selectedRole) {
          return '点击选择角色（可选）'
        }
        return this.getSelectedMeta('role', 'name')
      },
      imageAlbumPlaceholder () {
        if (this.loadingUserAlbum) {
          return '加载中...'
        }
        if (!this.image.selectedAlbum) {
          return '点击选择相册（可选）'
        }
        return this.getSelectedMeta('album', 'name')
      },
      followBangumis () {
        return this.$store.state.users.self.followBangumi
      },
      pickerDrawerHeaderText () {
        if (this.openBangumisDrawer) {
          return '番剧'
        } else if (this.openImageTagsDrawer) {
          return '类型'
        } else if (this.openImageSizeDrawer) {
          return '尺寸'
        } else if (this.openImageRoleDrawer) {
          return '角色'
        } else if (this.openImageAlbumDrawer) {
          return '相册'
        }
        return '选项卡'
      },
      user () {
        return this.$store.state.user || {}
      }
    },
    data () {
      return {
        show: false,
        sort: 'image',
        bangumiRoles: {},
        loadedUploadType: false,
        loadedUserAlbum: false,
        loadingBangumi: false,
        loadingUploadType: false,
        loadingUserAlbum: false,
        loadingBangumiRole: false,
        openPickerDrawer: false,
        openBangumisDrawer: false,
        openImageTagsDrawer: false,
        openImageSizeDrawer: false,
        openImageRoleDrawer: false,
        openImageAlbumDrawer: false,
        submitting: false,
        uploadHeaders: {
          token: ''
        },
        bangumiSlots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: [],
            textAlign: 'center'
          }
        ],
        tagsSlots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: [],
            textAlign: 'center'
          }
        ],
        sizeSlots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: [],
            textAlign: 'center'
          }
        ],
        roleSlots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: [],
            textAlign: 'center'
          }
        ],
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
          selectedBangumi: false,
          creator: false,
          cartoon: false,
          poster: []
        },
        image: {
          creator: false,
          selectedBangumi: false,
          selectedTags: false,
          selectedSize: false,
          selectedRole: false,
          selectedAlbum: false,
          data: []
        },
        options: [],
        pendingUpload: 0,
        exceed: 7
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
      },
      handlePosterUploadError (err, file) {
        console.log(err)
        this.$toast.error(`图片：${file.name} 上传失败`)
      },
      handleImageUploadError (err, file) {
        console.log(err)
        this.pendingUpload = this.pendingUpload - 1
        this.$toast.error(`图片：${file.name} 上传失败`)
      },
      handleExceed () {
        this.$toast.error(`最多可上传 ${this.exceed} 张图片!`)
      },
      beforeImageUpload (file) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        const isFormat = ['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) !== -1
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isFormat) {
          this.$toast.error('图片只能是 JPG 或 PNG 格式!')
          return false
        }
        if (!isLt5M) {
          this.$toast.error('图片大小不能超过 5MB!')
          return false
        }
        this.image.data.push({
          name: file.name,
          percentage: 0,
          raw: file,
          size: file.size,
          status: 'uploading',
          uid: file.uid
        })
        this.pendingUpload++

        this.uploadHeaders.key = `user/${this.$store.state.user.id}/image/${new Date().getTime()}-${Math.random().toString(36).substring(3, 6)}.${file.type.split('/').pop()}`
      },
      handleRemoveImage (file) {
        this.image.data.forEach((item, index) => {
          if (item.id === file.uid) {
            this.image.data.splice(index, 1)
          }
        })
      },
      beforeUpload (file) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        const isFormat = ['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) !== -1
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!isFormat) {
          this.$toast.error('图片只能是 JPG 或 PNG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$toast.error('图片大小不能超过 5MB!')
          return false
        }

        this.uploadHeaders.key = `user/${this.$store.state.user.id}/album/0/${new Date().getTime()}-${Math.random().toString(36).substring(3, 6)}.${file.type.split('/').pop()}`
        return true
      },
      switchPickerDrawer (name) {
        this.openBangumisDrawer = false
        this.openImageTagsDrawer = false
        this.openImageSizeDrawer = false
        this.openImageRoleDrawer = false
        this.openImageAlbumDrawer = false
        this[name] = true
        this.openPickerDrawer = true
      },
      handleImageBangumiPickerBtnClick () {
        if (!this.bangumiSlots[0].values.length) {
          this.$toast.error('还没有关注任何番剧')
          return
        }
        this.image.selectedBangumi = true
        this.switchPickerDrawer('openBangumisDrawer')
      },
      handleAlbumBangumiPickerBtnClick () {
        if (!this.bangumiSlots[0].values.length) {
          this.$toast.error('还没有关注任何番剧')
          return
        }
        this.album.selectedBangumi = true
        this.switchPickerDrawer('openBangumisDrawer')
      },
      handleRolePickerBtnClick () {
        if (!this.image.selectedBangumi) {
          this.$toast.error('请先选择番剧')
          return
        }
        if (this.loadingBangumiRole) {
          this.$toast.error('数据加载中')
          return
        }
        if (!this.roleSlots[0].values.length) {
          this.$toast.error('该番剧下没用可选角色')
          return
        }
        this.image.selectedRole = true
        this.switchPickerDrawer('openImageRoleDrawer')
      },
      handleAlbumPickerBtnClick () {
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
      handleImageTagsPickerBtnClick () {
        this.image.selectedTags = true
        this.switchPickerDrawer('openImageTagsDrawer')
      },
      handleImageSizePickerBtnClick () {
        this.image.selectedSize = true
        this.switchPickerDrawer('openImageSizeDrawer')
      },
      onBangumiValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.bangumiSlots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.bangumiSlots[0].defaultIndex = index
          }
        })
        if (this.sort === 'image') {
          this.getBangumiRoles(this.getSelectedMeta('bangumi', 'id'))
        }
      },
      async getBangumiRoles (bangumiId) {
        if (this.bangumiRoles[bangumiId]) {
          this.roleSlots[0].values = this.bangumiRoles[bangumiId]
          return
        }
        this.loadingBangumiRole = true
        try {
          const data = await this.$store.dispatch('bangumi/getRoles', {
            ctx: this,
            bangumiId: bangumiId
          })
          this.bangumiRoles[bangumiId] = data
          this.roleSlots[0].values = data
          this.roleSlots[0].defaultIndex = 0
          this.image.selectedRole = false
          this.image.roleId = ''
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingBangumiRole = false
        }
      },
      onTagsValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.tagsSlots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.tagsSlots[0].defaultIndex = index
          }
        })
      },
      onSizeValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.sizeSlots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.sizeSlots[0].defaultIndex = index
          }
        })
      },
      onRoleValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.roleSlots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.roleSlots[0].defaultIndex = index
          }
        })
      },
      onAlbumValuesChange (picker, values) {
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
      async getUpToken () {
        try {
          await this.$store.dispatch('getUpToken')
          this.uploadHeaders.token = this.$store.state.user.uptoken.upToken
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async getUserFollowedBangumis () {
        if (this.followBangumis.length) {
          this.bangumiSlots[0].values = this.bangumiSlots[0].values.concat(this.followBangumis)
          return
        }
        if (this.loadingBangumi) {
          return
        }
        this.loadingBangumi = true
        try {
          const bangumis = await this.$store.dispatch('users/getFollowBangumis', {
            zone: this.user.zone,
            self: true
          })
          this.bangumiSlots[0].values = this.bangumiSlots[0].values.concat(bangumis)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingBangumi = false
        }
      },
      handleAlbumUploadSuccess (res, file) {
        this.album.poster = [
          {
            name: file.name,
            data: res.data,
            url: this.$resize(res.data.key, { width: 100 })
          }
        ]
      },
      handleAlbumPosterRemove () {
        this.$refs.albumUploader.clearFiles()
      },
      handleImageUploadSuccess (res, file) {
        this.image.data.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.image.data[index] = Object.assign(item, {
              data: res.data,
              status: 'success',
              url: this.$resize(res.data.key, { width: 100 })
            })
          }
        })
        this.pendingUpload--
      },
      async createAlbum () {
        if (!this.album.name) {
          this.$toast.error('请填写相册名称')
          return
        }
        if (this.album.name.length > 20) {
          this.$toast.error('专题名称请缩减至20字以内')
          return
        }
        if (!this.album.selectedBangumi) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        const poster = this.album.poster.length ? this.album.poster[0]['data'] : null
        if (!poster) {
          this.$toast.error('请先上传封面')
          return
        }
        if (this.submitting) {
          return
        }
        this.submitting = true
        this.$toast.loading('创建中')
        const api = new ImageApi(this)
        try {
          const data = await api.createAlbum({
            bangumiId: this.getSelectedMeta('bangumi', 'id'),
            isCartoon: this.album.cartoon,
            name: this.album.name,
            url: poster ? poster.key : '',
            width: poster ? poster.width : 0,
            height: poster ? poster.height : 0,
            creator: this.album.creator
          })
          this.albumSlots[0].values.unshift(data)
          this.albumSlots[0].defaultIndex = 0
          this.$toast.success('相册创建成功！')
          this.$store.commit('image/CREATE_ALBUM', data)
          this.sort = 'image'
          this.image.albumId = data.id
          this.album = {
            name: '',
            bangumiId: '',
            selectedBangumi: false,
            creator: false,
            cartoon: false,
            poster: []
          }
          this.$refs.albumUploader.clearFiles()
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      async getUploadType () {
        if (this.loadingUploadType || this.loadedUploadType) {
          return
        }
        this.loadingUploadType = true
        const api = new ImageApi(this)
        try {
          const data = await api.getUploadType()
          this.tagsSlots[0].values = data.tags
          this.sizeSlots[0].values = data.size
          this.loadedUploadType = true
        } finally {
          this.loadingUploadType = false
        }
      },
      async getUserAlbum () {
        if (this.loadingUserAlbum || this.loadedUserAlbum) {
          return
        }
        this.loadingUserAlbum = true
        try {
          this.albumSlots[0].values = await this.$store.dispatch('image/userAlbum', {
            ctx: this
          })
          this.loadedUserAlbum = true
        } finally {
          this.loadingUserAlbum = false
        }
      },
      async createImage () {
        if (!this.image.selectedSize) {
          this.$toast.error('请先选择尺寸')
          return
        }
        if (!this.image.selectedTags) {
          this.$toast.error('请先选择类型')
          return
        }
        if (!this.image.data.length) {
          this.$toast.error('请先上传图片')
          return
        }
        if (!this.image.selectedBangumi) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.pendingUpload) {
          this.$toast.error('等待图片上传完成')
          return
        }
        if (this.submitting) {
          return
        }
        this.submitting = true
        this.$toast.loading('上传中...')
        const api = new ImageApi(this)
        try {
          const data = await api.uploadImage({
            creator: this.image.creator,
            bangumiId: this.getSelectedMeta('bangumi', 'id'),
            tags: this.getSelectedMeta('tags', 'id'),
            size: this.getSelectedMeta('size', 'id'),
            roleId: this.image.selectedRole ? this.getSelectedMeta('role', 'id') : 0,
            albumId: this.image.selectedAlbum ? this.getSelectedMeta('album', 'id') : 0,
            images: this.image.data.map(_ => _.data)
          })
          this.$toast.success('图片上传成功！')
          this.image = {
            creator: false,
            selectedBangumi: false,
            selectedTags: false,
            selectedSize: false,
            selectedRole: false,
            selectedAlbum: false,
            data: []
          }
          this.$refs.imageUploader.clearFiles()
          this.$store.commit('image/CREATE_WATERFALL', data)
          this.show = false
          setTimeout(() => {
            this.$toast.success('图片功能目前仅支持电脑查看')
          }, 1000)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      getSelectedMeta (name, value) {
        const key = `${name}Slots`
        if (!this[key][0].values.length) {
          return 0
        }
        return this[key][0].values[this[key][0].defaultIndex][value]
      }
    },
    mounted () {
      this.$channel.$on('open-create-image-drawer', () => {
        this.getUpToken()
        this.getUserFollowedBangumis()
        this.getUploadType()
        this.getUserAlbum()
        this.show = true
      })
    }
  }
</script>
