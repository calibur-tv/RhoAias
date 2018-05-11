<style lang="scss">
  #image-waterfall {
    margin-right: -5px;
    background-color: #fff;
    padding-top: $container-padding;

    .image-container {
      position: relative;
      width: 310px;
      margin: 0 auto $container-padding auto;
    }

    .image-item {
      padding-right: 10px;
      padding-bottom: 10px;
      margin-left: 3px;
      margin-top: 3px;

      .item-wrap {
        font-size: 0;
        position: relative;

        &.album-wrap {
          cursor: pointer;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            opacity: .3;
            background-color: transparent;
            background-image: linear-gradient(transparent,rgba(0,0,0,.1) 20%,rgba(0,0,0,.2) 35%,rgba(0,0,0,.6) 65%,rgba(0,0,0,.9));
          }
        }

        .creator {
          font-size: 20px;
          position: absolute;
          left: 5px;
          top: 2px;
          z-index: 1;
          color: #ffcf00;
        }

        .album-info {
          position: absolute;
          left: 7px;
          bottom: 4px;
          z-index: 1;
          color: #fff;
          line-height: 20px;

          i {
            font-size: 20px;
            vertical-align: middle;
          }

          .image-count {
            margin-left: 5px;
            font-size: 14px;
            vertical-align: middle;
          }
        }

        .v-select-wrap {
          position: absolute;
          right: 0;
          top: 0;
          width: 58px;
          line-height: 16px;
          font-size: 12px;
          color: #fff;
          z-index: 1;
          margin-top: 7px;
          margin-right: 6px;

          .iconfont {
            text-shadow: 0 1px 10px grey;
          }

          .v-select-options-wrap {
            background-color: #fff;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            top: 18px;
          }

          .v-select-options-item {
            height: 36px;
            line-height: 35px;
            color: #535353;
            font-size: 12px;
            padding-left: 15px;

            &:not(:last-child) {
              border-bottom: 1px solid #f0f0f0;
            }
          }
        }
      }

      .image {
        width: 100%;
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
        overflow: hidden;

        .desc {
          padding: 5px 8px;
          height: 48px;

          .name {
            max-width: 140px;
            margin-bottom: 7px;
            display: block;
            font-size: 12px;
            line-height: 18px;
          }

          .tags {
            margin-bottom: 7px;

            .el-tag {
              margin-right: 7px;
              max-width: 60px;
              font-size: 12px;
            }
          }

          .meta {
            font-size: 11px;
            color: $color-gray-deep;
            overflow: hidden;
            text-align: right;
            margin-top: 1px;

            .like {
              display: block;
              text-align: left;
              width: 100%;
              color: $color-gray-deep;
              font-size: 12px;
              line-height: 12px;

              &.liked {
                color: $color-pink-deep;
              }
            }

            time {
              margin-top: 3px;
            }
          }
        }

        .detail {
          padding: 8px;
          border-top: 1px solid #F2F2F2;
          background-color: #fafafa;
          font-size: 12px;
          line-height: 14px;
          color: #999;

          .margin-top {
            margin-top: 8px;
          }

          .info {
            overflow: hidden;
          }

          a {
            display: block;
            color: #777;
            font-size: 12px;
          }
        }

        .bangumi {

          .avatar {
            float: left;
            margin-right: 8px;

            img {
              width: 28px;
              height: 28px;
            }
          }
        }

        .user {

          .avatar {
            float: left;
            margin-right: 8px;
            overflow: hidden;
            border: 1px solid #F0F0F0;
            border-radius: 50%;
            @include avatar(28px);
          }

          .extra {
            margin-top: 3px;
          }
        }
      }
    }
  }
</style>

<template>
  <div id="image-waterfall" v-if="list.length">
    <no-ssr>
      <waterfall class="image-container" :line-gap="155" :auto-resize="false">
        <waterfall-slot
          v-for="(item, index) in list"
          width="145"
          :height="computeBoxHeight(item)"
          :order="index"
          :key="item.id"
          class="image-item"
        >
          <div class="image">
            <div
              class="item-wrap"
              :class="[ item.image_count ? 'album-wrap' : 'image-wrap' ]"
              @click="handleImageClick(item)"
            >
              <i v-if="item.creator" class="creator iconfont icon-huangguan"></i>
              <div v-if="computeOptions(item).length" class="menu" @click.stop.prevent>
                <v-select
                  placeholder=""
                  :options="computeOptions(item)"
                  :abort="true"
                  @submit="handleMenuSelected($event, item)"
                >
                  <i class="iconfont icon-101" slot="tail"></i>
                </v-select>
              </div>
              <img width="145" :height="computeImageHeight(item)" :src="$resize(item.url, { width: 290, mode: 2 })">
              <div class="album-info" v-if="item.image_count">
                <i class="el-icon-picture-outline"></i>
                <span class="image-count" v-text="item.image_count"></span>
              </div>
            </div>
            <div class="desc">
              <a
                class="name oneline"
                href="javascript:;"
                v-text="item.name"
                v-if="item.image_count"
              ></a>
              <div class="tags" v-else>
                <button class="el-tag oneline" v-text="item.size.name"></button>
                <button class="el-tag oneline" v-for="tag in item.tags" v-text="tag.name"></button>
              </div>
              <div class="meta">
                <button class="like" :class="{ 'liked': item.liked }" @click="handleLikeBtnClick($event, item)">
                  <i class="iconfont icon-msnui-love"></i>
                  {{ item.like_count || ''  }}
                </button>
              </div>
            </div>
            <div class="detail user clearfix" v-if="page === 'image-trending'">
              <router-link class="avatar" :to="$alias.user(item.user.zone)">
                <img :src="$resize(item.user.avatar, { width: 56 })">
              </router-link>
              <div class="info">
                <router-link class="oneline" :class="{ 'margin-top': !item.bangumi }" :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
                <router-link class="oneline" v-if="item.bangumi_id" :to="$alias.bangumi(item.bangumi.id)" v-text="item.bangumi.name"></router-link>
              </div>
            </div>
            <template v-else-if="page === 'user-show'">
              <div class="detail bangumi clearfix" v-if="item.bangumi_id">
                <router-link class="avatar" :to="$alias.bangumi(item.bangumi.id)">
                  <img :src="$resize(item.bangumi.avatar, { width: 56 })">
                </router-link>
                <div class="info" :class="{ 'margin-top': !item.role_id }">
                  <router-link class="oneline" :to="$alias.bangumi(item.bangumi.id)" v-text="item.bangumi.name"></router-link>
                  <div v-if="item.role" class="oneline" v-text="item.role.name"></div>
                </div>
              </div>
            </template>
            <div class="detail user clearfix" v-else-if="page === 'bangumi-show'">
              <router-link class="avatar" :to="$alias.user(item.user.zone)">
                <img :src="$resize(item.user.avatar, { width: 56 })">
              </router-link>
              <div class="info" :class="{ 'margin-top': !item.role_id }">
                <router-link class="oneline" :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
                <router-link v-if="item.role_id" :to="$alias.cartoonRole(item.role_id)">
                  <div class="oneline" v-text="item.role.name"></div>
                </router-link>
              </div>
            </div>
          </div>
        </waterfall-slot>
      </waterfall>
    </no-ssr>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :length="list.length"
      @fetch="handleLoadMoreClick(false)"
    ></more-btn>
  </div>
</template>

<script>
  import Api from '~/api/imageApi'

  export default {
    name: 'ImageWaterfall',
    components: {
      'waterfall': () => {
        if (typeof window === 'undefined') {
          return import('~/assets/js/empty')
        }
        return import('vue-waterfall/lib/waterfall')
      },
      'waterfall-slot': () => {
        if (typeof window === 'undefined') {
          return import('~/assets/js/empty')
        }
        return import('vue-waterfall/lib/waterfall-slot')
      }
    },
    props: {
      loading: {
        type: Boolean,
        required: true
      },
      bangumi: {
        type: Array,
        default: () => []
      },
      role: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      page () {
        return this.$route.name
      },
      waterfall () {
        return this.$store.state.image.waterfall
      },
      list () {
        return this.waterfall.data
      },
      noMore () {
        return this.waterfall.noMore
      },
      options () {
        return this.waterfall.options
      },
      curUserId () {
        return this.$store.state.login
          ? this.$store.state.user.id
          : -1
      },
      slug () {
        return this.$store.state.user.zone
      },
      selectionSize () {
        return this.options.size ? [{
          id: 0,
          name: '全部尺寸'
        }].concat(this.options.size) : []
      },
      selectionTags () {
        return this.options.tags ? [{
          id: 0,
          name: '全部类型'
        }].concat(this.options.tags) : []
      },
      selectionBangumis () {
        return this.bangumi.length ? [{
          id: -1,
          name: '全部番剧'
        }, {
          id: 0,
          name: '未指定'
        }].concat(this.bangumi) : []
      },
      selectionRoles () {
        return this.role.length ? [{
          id: -1,
          name: '全部角色'
        }, {
          id: 0,
          name: '未指定'
        }].concat(this.role) : []
      }
    },
    data () {
      return {
        uploadHeaders: {
          token: ''
        },
        openEditModal: false,
        openEditAlbumModal: false,
        bangumiRoles: {},
        bangumis: [],
        roles: [],
        loadingUserBangumiFetch: false,
        loadingUploadTypeFetch: false,
        submitting: false,
        form: {
          id: '',
          bangumiId: '',
          size: '',
          tags: '',
          roleId: ''
        },
        origin: {
          bangumiId: '',
          roleId: '',
          size: '',
          tags: ''
        },
        selectedTagsId: 0,
        selectedSizeId: 0,
        selectedBangumiId: -1,
        selectedRoleId: -1,
        selectedCreatorId: -1,
        creators: [
          {
            id: -1,
            name: '原创和搬运'
          },
          {
            id: 1,
            name: '仅原创'
          },
          {
            id: 0,
            name: '仅搬运'
          }
        ],
        albumForm: {
          id: 0,
          name: '',
          bangumiId: '',
          url: '',
          poster: []
        },
        originAlbumData: {
          name: '',
          bangumiId: '',
          url: ''
        }
      }
    },
    methods: {
      isMine (userId) {
        return this.curUserId === userId
      },
      computeOptions (image) {
        let result = []
        if (this.isMine(image.user_id)) {
          result = result.concat([
            '删除',
            '编辑'
          ])
        } else {
          result = result.concat([
            '举报'
          ])
        }
        return result
      },
      computeBoxHeight (image) {
        return this.computeImageHeight(image) + (
            this.page === 'user-show'
              ? image.bangumi_id ? 93 : 52
              : (image.bangumi || image.user ? 93 : 52)
          )
      },
      computeImageHeight (image) {
        return parseInt(image.height / image.width * 145, 10)
      },
      computeImageType (image) {
        const tags = image.tags
        this.form.size = image.size.id
        this.origin.size = image.size.id
        this.form.tags = tags.length ? tags[0].id : ''
        this.origin.tags = tags.length ? tags[0].id : ''
      },
      handleLoadMoreClick (reset) {
        if (reset) {
          this.$store.commit('image/SET_WATERFALL_META', {
            size: this.selectedSizeId,
            tags: this.selectedTagsId,
            bangumiId: this.selectedBangumiId,
            roleId: this.selectedRoleId,
            creator: this.selectedCreatorId
          })
        }
        this.$emit('fetch')
      },
      deleteImage ({ userId, id }) {
        if (userId !== this.curUserId) {
          return
        }
        const api = new Api(this)
        api.deleteImage({ id }).then(() => {
          this.$store.commit('image/DELETE_WATERFALL', { id })
        }).catch((err) => {
          this.$toast.error(err)
        })
      },
      editImage (image) {
        this.form.id = image.id
        const bangumiId = image.bangumi_id
        const roleId = image.role_id
        this.getUserBangumis()
        if (bangumiId) {
          this.origin.bangumiId = bangumiId
          this.form.bangumiId = bangumiId
          this.getBangumiRoles(bangumiId)
        }
        if (roleId) {
          this.origin.roleId = roleId
          this.form.roleId = roleId
        }
        this.computeImageType(image)
        this.openEditModal = true
      },
      editAlbum (album) {
        this.albumForm.id = album.id
        this.albumForm.name = album.name
        this.albumForm.url = album.url
        this.originAlbumData.name = album.name
        this.originAlbumData.url = album.url
        if (album.bangumiId) {
          this.albumForm.bangumiId = album.bangumiId
          this.originAlbumData.bangumiId = album.bangumiId
        }
        this.getUpToken()
        this.getUserBangumis()
        this.openEditAlbumModal = true
      },
      reportImage (image) {
        this.$prompt('请输入举报原因', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value) {
            const api = new Api(this)
            api.trialReport({ id: image.id }).then(() => {
              this.$toast.success('提交成功！')
            })
          }
        }).catch(() => {})
      },
      handleMenuSelected (option, image) {
        if (option === '举报') {
          this.reportImage(image)
        } else if (option === '删除') {
          this.$confirm('删除后不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteImage({
              userId: image.user_id,
              id: image.id
            })
          }).catch(() => {})
        } else if (option === '编辑') {
          if (image.image_count) {
            this.editAlbum(image)
          } else {
            this.editImage(image)
          }
        }
      },
      handleLikeBtnClick (e, image) {
        if (!this.$store.state.login) {
          this.$toast.info('继续操作前请先登录')
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMine(image.user_id)) {
          this.$toast.info('不能为自己的图片点赞')
          return
        }
        const btn = e.currentTarget
        if (image.creator && !image.liked) {
          if (!this.$store.state.user.coin) {
            this.$toast.error('金币不足')
            return
          }
          this.$confirm('原创图片点赞需要金币, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitToggleLike(btn, image)
          }).catch(() => {})
          return
        }
        this.submitToggleLike(btn, image)
      },
      handleImageClick (image) {
        if (image.image_count) {
          this.$router.push({
            name: 'image-album',
            params: {
              id: image.id
            }
          })
        } else {
          const result = `${image.width}-${image.height}|${image.url}`
          this.$previewImages([result], result)
        }
      },
      async getUpToken () {
        try {
          await this.$store.dispatch('getUpToken', this)
          this.uploadHeaders.token = this.$store.state.user.uptoken.upToken
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async submitToggleLike (btn, image) {
        btn.setAttribute('disabled', 'disabled')
        // do like
        const api = new Api(this)
        try {
          if (!image.creator) {
            this.$store.commit('image/LIKE_WATERFALL', {
              id: image.id,
              result: !image.liked
            })
          }
          const result = await api.toggleLike({ id: image.id })
          if (image.creator) {
            this.$store.commit('image/LIKE_WATERFALL', {
              id: image.id,
              result
            })
            if (result) {
              this.$store.commit('USE_COIN')
            }
            this.$toast.success('操作成功')
          }
        } catch (e) {
          this.$toast.error(e)
        } finally {
          btn.removeAttribute('disabled')
        }
      },
      async getUserBangumis () {
        if (this.bangumis.length) {
          return
        }
        if (this.loadingUserBangumiFetch) {
          return
        }
        this.loadingUserBangumiFetch = true
        try {
          this.bangumis = await this.$store.dispatch('users/getFollowBangumis', {
            ctx: this,
            zone: this.slug
          })
        } finally {
          this.loadingUserBangumiFetch = false
        }
      },
      async getBangumiRoles (bangumiId) {
        if (!bangumiId) {
          return
        }
        if (this.bangumiRoles[bangumiId]) {
          this.roles = this.bangumiRoles[bangumiId]
          return
        }
        const data = await this.$store.dispatch('bangumi/getRoles', {
          ctx: this,
          bangumiId: this.form.bangumiId
        })
        this.bangumiRoles[bangumiId] = data
        this.roles = data
      },
      async handleImageEditDone () {
        if (!this.form.size) {
          this.$toast.error('请先选择尺寸')
          return
        }
        if (!this.form.tags) {
          this.$toast.error('请先选择类型')
          return
        }
        if (!this.form.bangumiId) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.submitting) {
          return
        }
        if (
          this.form.bangumiId === this.origin.bangumiId &&
          this.form.roleId === this.origin.roleId &&
          this.form.size === this.origin.size &&
          this.form.tags === this.origin.tags
        ) {
          this.openEditModal = false
          this.form = {
            id: '',
            bangumiId: '',
            size: '',
            tags: '',
            roleId: ''
          }
          return
        }
        this.submitting = true
        this.$toast.info('修改中...')
        const api = new Api(this)
        try {
          const id = this.form.id
          const data = await api.editImage({
            id,
            bangumiId: this.form.bangumiId || 0,
            roleId: this.form.roleId || 0,
            tags: this.form.tags,
            size: this.form.size
          })
          this.$toast.success('图片编辑成功！')
          this.$store.commit('image/EDIT_WATERFALL', { id, data })
          this.openEditModal = false
          this.form = {
            id: '',
            bangumiId: '',
            size: '',
            tags: '',
            roleId: ''
          }
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      async handleAlbumEditDone () {
        if (!this.albumForm.name) {
          this.$toast.error('请填写专辑名称')
          return
        }
        if (this.albumForm.name.length > 20) {
          this.$toast.error('专题名称请缩减至20字以内')
          return
        }
        if (!this.albumForm.bangumiId) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.submitting) {
          return
        }
        if (
          this.albumForm.bangumiId === this.originAlbumData.bangumiId &&
          this.albumForm.name === this.originAlbumData.name &&
          this.albumForm.poster.length === 0
        ) {
          this.openEditAlbumModal = false
          this.albumForm = {
            id: 0,
            name: '',
            bangumiId: '',
            url: '',
            poster: []
          }
          return
        }
        this.submitting = false
        this.$toast.info('修改中...')
        const api = new Api(this)
        const id = this.albumForm.id
        const poster = this.albumForm.poster.length ? this.albumForm.poster[0]['url'] : null
        try {
          const data = await api.editAlbum(Object.assign({
            id,
            bangumiId: this.albumForm.bangumiId || 0,
            name: this.albumForm.name
          }, poster ? {
            url: poster.key,
            width: poster.width,
            height: poster.height
          } : {}))
          this.$store.commit('image/EDIT_ALBUM', { id, data })
          this.$store.commit('image/EDIT_WATERFALL', { id, data })
          this.$toast.success('专辑编辑成功！')
          this.openEditAlbumModal = false
          this.$refs.uploader.clearFiles()
          this.albumForm = {
            id: 0,
            name: '',
            bangumiId: '',
            url: '',
            poster: []
          }
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      handleError (err, file) {
        console.log(err)
        this.$toast.error(`图片：${file.name} 上传失败`)
      },
      beforeUpload (file) {
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

        this.uploadHeaders.key = `user/${this.$store.state.user.id}/image/${new Date().getTime()}-${Math.random().toString(36).substring(3, 6)}.${file.type.split('/').pop()}`
      },
      handleAlbumPosterRemove () {
        this.albumForm.poster = []
      },
      handleAlbumUploadSuccess (res, file) {
        this.albumForm.poster = [
          {
            name: file.name,
            url: res.data
          }
        ]
      }
    }
  }
</script>
