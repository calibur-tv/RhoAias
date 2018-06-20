<style lang="scss">
  #image-waterfall {
    margin-right: -5px;
    background-color: #fff;

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

    .edit-image-modal {
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
      }

      .btn-submit {
        margin-top: 15px;
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

    .btn-sort {
      width: 100%;
      padding-bottom: 5px;
      margin-bottom: 10px;
      padding-top: 15px;

      span {
        float: left;
        margin-left: 8px;
        font-size: 13px;
      }

      .iconfont {
        float: right;
        margin-right: 13px;
        font-size: 12px;
      }
    }

    .sort-image-drawer {
      border-radius: 5px 5px 0 0;
    }
  }
</style>

<template>
  <div id="image-waterfall" v-if="list.length">
    <no-ssr>
      <div class="image-container">
        <template v-if="showSortHeader">
          <button class="btn-sort clearfix" @click="openSortDrawer">
            <span>筛选</span>
            <i class="iconfont icon-101"></i>
          </button>
          <v-drawer
            v-model="toggleSortDrawer"
            header-text="图片筛选"
            from="bottom"
            size="250px"
            class="sort-image-drawer"
            submit-text="确认"
            @submit="handleSelectedSort"
          >
            <mt-picker
              :slots="sortSlots"
              @change="onSortValuesChange"
              valueKey="name"
            ></mt-picker>
          </v-drawer>
        </template>
        <waterfall :line-gap="155" :auto-resize="false">
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
                <a class="avatar" :href="$alias.user(item.user.zone)">
                  <img :src="$resize(item.user.avatar, { width: 56 })">
                </a>
                <div class="info">
                  <a class="oneline" :class="{ 'margin-top': !item.bangumi }" :href="$alias.user(item.user.zone)" v-text="item.user.nickname"></a>
                  <a class="oneline" v-if="item.bangumi_id" :href="$alias.bangumi(item.bangumi.id)" v-text="item.bangumi.name"></a>
                </div>
              </div>
              <template v-else-if="page === 'user-show'">
                <div class="detail bangumi clearfix" v-if="item.bangumi_id">
                  <a class="avatar" :href="$alias.bangumi(item.bangumi.id)">
                    <img :src="$resize(item.bangumi.avatar, { width: 56 })">
                  </a>
                  <div class="info" :class="{ 'margin-top': !item.role_id }">
                    <a class="oneline" :href="$alias.bangumi(item.bangumi.id)" v-text="item.bangumi.name"></a>
                    <div v-if="item.role" class="oneline" v-text="item.role.name"></div>
                  </div>
                </div>
              </template>
              <div class="detail user clearfix" v-else-if="page === 'bangumi-show'">
                <a class="avatar" :href="$alias.user(item.user.zone)">
                  <img :src="$resize(item.user.avatar, { width: 56 })">
                </a>
                <div class="info" :class="{ 'margin-top': !item.role_id }">
                  <a class="oneline" :href="$alias.user(item.user.zone)" v-text="item.user.nickname"></a>
                  <a v-if="item.role_id" :href="$alias.cartoonRole(item.role_id)">
                    <div class="oneline" v-text="item.role.name"></div>
                  </a>
                </div>
              </div>
            </div>
          </waterfall-slot>
        </waterfall>
      </div>
    </no-ssr>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :length="list.length"
      @fetch="handleLoadMoreClick(false)"
    ></more-btn>
    <v-drawer
      v-model="openEditModal"
      :header-text="openEditAlbumModal ? '编辑相册' : '编辑图片'"
      from="bottom"
      size="100%"
      class="edit-image-modal"
      :backdrop="false"
    >
      <!-- 编辑图片弹窗 -->
      <div class="container">
        <template v-if="openEditAlbumModal">
          <div class="field">
            <v-field
              v-model="albumData.name"
              label="名称"
              placeholder="请填写相册名称"
              label-size="48px"
            ></v-field>
          </div>
          <div class="field" v-if="!albumData.is_cartoon">
            <span>番剧：</span>
            <div
              @click="handleAlbumBangumiPickerBtnClick"
              v-text="albumBangumiPlaceholder"
            ></div>
          </div>
          <div class="field">
            <span>封面：</span>
            <el-upload
              action="https://upload.qiniup.com"
              list-type="picture-card"
              ref="albumUploader"
              :data="uploadHeaders"
              :disabled="true"
              :on-error="handleError"
              :before-upload="beforeUpload"
              :on-remove="handleAlbumPosterRemove"
              :on-success="handleAlbumUploadSuccess"
            >+</el-upload>
          </div>
          <button
            class="btn-submit"
            @click="handleAlbumEditDone"
          >确认修改</button>
        </template>
        <template v-else>
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
          <button
            class="btn-submit"
            @click="handleImageEditDone"
          >确认修改</button>
        </template>
      </div>
      <!-- picker 的 drawer -->
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
      </v-drawer>
    </v-drawer>
  </div>
  <more-btn
    v-else
    :no-more="noMore"
    :length="list.length"
    :loading="false"
  >
    <button @click="openCreateImageModal">上传图片</button>
  </more-btn>
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
      showSortHeader () {
        return !Array.isArray(this.options)
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
      zone () {
        return this.$store.state.user.zone
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
      albumBangumiPlaceholder () {
        if (this.loadingBangumi) {
          return '加载中...'
        }
        let result = '点击选择番剧'

        this.bangumiSlots[0].values.forEach(item => {
          if (item.id === this.albumData.bangumiId) {
            result = item.name
          }
        })

        return result
      },
      imageBangumiPlaceholder () {
        if (this.loadingBangumi) {
          return '加载中...'
        }
        if (!this.imageData.selectedBangumi) {
          return '点击选择番剧'
        }
        return this.getNameById('bangumi', this.imageData.bangumiId)
      },
      imageTagsPlaceholder () {
        if (this.loadingUploadType) {
          return '加载中...'
        }
        if (!this.imageData.selectedTags) {
          return '点击选择类型'
        }
        return this.getNameById('tags', this.imageData.tagsId)
      },
      imageSizePlaceholder () {
        if (this.loadingUploadType) {
          return '加载中...'
        }
        if (!this.imageData.selectedSize) {
          return '点击选择尺寸'
        }
        return this.getNameById('size', this.imageData.sizeId)
      },
      imageRolePlaceholder () {
        if (this.loadingBangumiRole) {
          return '加载中...'
        }
        if (!this.imageData.selectedRole) {
          return '点击选择角色（可选）'
        }
        return this.getNameById('role', this.imageData.roleId)
      }
    },
    data () {
      return {
        uploadHeaders: {
          token: ''
        },
        openEditModal: false,
        openEditAlbumModal: false,
        toggleSortDrawer: false,
        bangumiRoles: {},
        loadingUserBangumiFetch: false,
        loadingUploadTypeFetch: false,
        submitting: false,
        selectedTagsId: 0,
        selectedSizeId: 0,
        selectedCreatorId: -1,
        albumData: {
          id: 0,
          name: '',
          bangumiId: '',
          url: '',
          poster: [],
          is_cartoon: false
        },
        originAlbumData: {
          name: '',
          bangumiId: '',
          url: ''
        },
        imageData: {
          id: 0,
          bangumiId: '',
          roleId: '',
          sizeId: '',
          tagsId: '',
          selectedBangumi: false,
          selectedTags: false,
          selectedSize: false,
          selectedRole: false
        },
        originImageData: {
          bangumiId: '',
          roleId: '',
          sizeId: '',
          tagsId: ''
        },
        loadingBangumi: false,
        loadingUploadType: false,
        loadingBangumiRole: false,
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
        sortSlots: [
          {
            flex: 1,
            values: [],
            defaultIndex: 0,
            textAlign: 'right'
          },
          {
            flex: 1,
            values: [],
            defaultIndex: 0,
            textAlign: 'center'
          },
          {
            flex: 1,
            values: [
              {
                id: -1,
                name: '全部'
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
            defaultIndex: 0,
            textAlign: 'left'
          }
        ],
        openPickerDrawer: false,
        openBangumisDrawer: false,
        openImageTagsDrawer: false,
        openImageSizeDrawer: false,
        openImageRoleDrawer: false,
        openImageAlbumDrawer: false,
        saveSortSelect: []
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
            this.page === 'role-show'
              ? 48
              : this.page === 'user-show'
                ? image.bangumi_id ? 93 : 48
                : (image.bangumi || image.user ? 93 : 48)
          )
      },
      computeImageHeight (image) {
        return parseInt(image.height / image.width * 145, 10)
      },
      computeImageType (image) {
        const tags = image.tags
        const sizeId = image.size.id
        if (sizeId) {
          this.originImageData.sizeId = sizeId
          this.imageData.sizeId = sizeId
          this.imageData.selectedSize = true
        }
        if (tags.length) {
          const tagId = tags.length ? tags[0].id : ''
          this.originImageData.tagsId = tagId
          this.imageData.tagsId = tagId
          this.imageData.selectedTags = true
        }
      },
      handleLoadMoreClick (reset) {
        if (reset) {
          this.$store.commit('image/SET_WATERFALL_META', {
            size: this.selectedSizeId,
            tags: this.selectedTagsId,
            bangumiId: -1,
            roleId: -1,
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
      startEditImage (image) {
        this.imageData.id = image.id
        const bangumiId = image.bangumi_id
        const roleId = image.role_id
        this.getUserBangumis()
        if (bangumiId) {
          this.originImageData.bangumiId = bangumiId
          this.imageData.selectedBangumi = true
          this.imageData.bangumiId = bangumiId
          this.getBangumiRoles(bangumiId)
        }
        if (roleId) {
          this.originImageData.roleId = roleId
          this.imageData.roleId = roleId
          this.imageData.selectedRole = true
        }
        this.computeImageType(image)
        this.openEditModal = true
      },
      startEditAlbum (album) {
        this.albumData.is_cartoon = album.is_cartoon
        this.albumData.id = album.id
        this.albumData.name = album.name
        this.albumData.url = album.url
        this.originAlbumData.name = album.name
        this.originAlbumData.url = album.url
        const bangumiId = album.bangumi_id
        if (bangumiId) {
          this.albumData.bangumiId = bangumiId
          this.originAlbumData.bangumiId = bangumiId
        }
        this.getUpToken()
        this.getUserBangumis()
        this.openEditModal = true
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
      openSortDrawer () {
        const defaultSelect = [{
          id: 0,
          name: '全部'
        }]
        const hasOptions = !Array.isArray(this.options)
        const tagsOptions = hasOptions ? defaultSelect.concat(this.options.tags) : []
        const sizeOptions = hasOptions ? defaultSelect.concat(this.options.size) : []
        this.sortSlots[0].values = tagsOptions
        this.sortSlots[1].values = sizeOptions
        tagsOptions.forEach((item, index) => {
          if (item.id === this.selectedTagsId) {
            this.sortSlots[0].defaultIndex = index
          }
        })
        sizeOptions.forEach((item, index) => {
          if (item.id === this.selectedSizeId) {
            this.sortSlots[1].defaultIndex = index
          }
        })
        this.sortSlots[2].values.forEach((item, index) => {
          if (item.id === this.selectedCreatorId) {
            this.sortSlots[2].defaultIndex = index
          }
        })
        this.toggleSortDrawer = true
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
          this.tagsSlots[0].values = this.options.tags
          this.sizeSlots[0].values = this.options.size
          if (image.image_count) {
            this.albumData = {
              id: 0,
              name: '',
              bangumiId: '',
              url: '',
              poster: []
            }
            this.openEditAlbumModal = true
            this.startEditAlbum(image)
          } else {
            this.imageData = {
              id: 0,
              bangumiId: '',
              roleId: '',
              sizeId: '',
              tagsId: '',
              selectedBangumi: false,
              selectedTags: false,
              selectedSize: false,
              selectedRole: false
            }
            this.openEditAlbumModal = false
            this.startEditImage(image)
          }
        }
      },
      handleLikeBtnClick (e, image) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMine(image.user_id)) {
          this.$toast.error('不能为自己的图片点赞')
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
          window.location = this.$alias.imageAlbum(image.id)
        } else {
          this.$previewImages(image, image)
        }
      },
      handleRolePickerBtnClick () {
        if (!this.imageData.selectedBangumi) {
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
        this.imageData.selectedRole = true
        if (!this.imageData.roleId) {
          this.imageData.roleId = this.getSelectedMeta('role', 'id')
        }
        this.switchPickerDrawer('openImageRoleDrawer')
      },
      handleAlbumBangumiPickerBtnClick () {
        if (!this.bangumiSlots[0].values.length) {
          this.$toast.error('还没有关注任何番剧')
          return
        }
        if (!this.albumData.bangumiId) {
          this.albumData.bangumiId = this.getSelectedMeta('bangumi', 'id')
        }
        this.switchPickerDrawer('openBangumisDrawer')
      },
      handleImageBangumiPickerBtnClick () {
        if (!this.bangumiSlots[0].values.length) {
          this.$toast.error('还没有关注任何番剧')
          return
        }
        this.imageData.selectedBangumi = true
        this.switchPickerDrawer('openBangumisDrawer')
      },
      handleImageTagsPickerBtnClick () {
        this.imageData.selectedTags = true
        this.switchPickerDrawer('openImageTagsDrawer')
      },
      handleImageSizePickerBtnClick () {
        this.imageData.selectedSize = true
        this.switchPickerDrawer('openImageSizeDrawer')
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
        if (this.bangumiSlots[0].values.length) {
          return
        }
        if (this.loadingUserBangumiFetch) {
          return
        }
        this.loadingUserBangumiFetch = true
        try {
          this.bangumiSlots[0].values = await this.$store.dispatch('users/getFollowBangumis', {
            ctx: this,
            zone: this.zone
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
          this.roleSlots[0].values = this.bangumiRoles[bangumiId]
          return
        }
        const data = await this.$store.dispatch('bangumi/getRoles', {
          ctx: this,
          bangumiId
        })
        this.bangumiRoles[bangumiId] = data
        this.roleSlots[0].values = data
      },
      async handleImageEditDone () {
        if (!this.imageData.selectedSize) {
          this.$toast.error('请先选择尺寸')
          return
        }
        if (!this.imageData.selectedTags) {
          this.$toast.error('请先选择类型')
          return
        }
        if (!this.imageData.selectedBangumi) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.submitting) {
          return
        }
        if (
          this.imageData.bangumiId === this.originImageData.bangumiId &&
          this.imageData.roleId === this.originImageData.roleId &&
          this.imageData.sizeId === this.originImageData.sizeId &&
          this.imageData.tagsId === this.originImageData.tagsId
        ) {
          this.openEditModal = false
          return
        }
        this.submitting = true
        this.$toast.loading('修改中...')
        const api = new Api(this)
        try {
          const id = this.imageData.id
          const data = await api.editImage({
            id,
            bangumiId: this.imageData.bangumiId || 0,
            roleId: this.imageData.selectedRole ? this.imageData.roleId || 0 : 0,
            tags: this.imageData.tagsId,
            size: this.imageData.sizeId
          })
          this.$toast.success('图片编辑成功！')
          this.$store.commit('image/EDIT_WATERFALL', { id, data })
          this.openEditModal = false
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      async handleAlbumEditDone () {
        if (!this.albumData.name) {
          this.$toast.error('请填写专辑名称')
          return
        }
        if (this.albumData.name.length > 20) {
          this.$toast.error('专题名称请缩减至20字以内')
          return
        }
        if (!this.albumData.bangumiId) {
          this.$toast.error('请选择要投稿的番剧')
          return
        }
        if (this.submitting) {
          return
        }
        if (
          this.albumData.bangumiId === this.originAlbumData.bangumiId &&
          this.albumData.name === this.originAlbumData.name &&
          this.albumData.poster.length === 0
        ) {
          this.openEditModal = false
          return
        }
        this.submitting = false
        this.$toast.loading('修改中...')
        const api = new Api(this)
        const id = this.albumData.id
        const poster = this.albumData.poster.length ? this.albumData.poster[0]['url'] : null
        try {
          const data = await api.editAlbum(Object.assign({
            id,
            bangumiId: this.albumData.bangumiId || 0,
            name: this.albumData.name
          }, poster ? {
            url: poster.key,
            width: poster.width,
            height: poster.height
          } : {}))
          this.$store.commit('image/EDIT_ALBUM', { id, data })
          this.$store.commit('image/EDIT_WATERFALL', { id, data })
          this.$toast.success('专辑编辑成功！')
          this.openEditModal = false
          this.$refs.uploader.clearFiles()
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.submitting = false
        }
      },
      handleError (err, file) {
        console.log(err)
        this.albumData.poster = []
        this.$toast.error(`图片：${file.name} 上传失败`)
      },
      beforeUpload (file) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        const isFormat = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.type) !== -1
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isFormat) {
          this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
          return false
        }
        if (!isLt5M) {
          this.$toast.error('图片大小不能超过 5MB!')
          return false
        }

        this.uploadHeaders.key = this.$utils.createFileName({
          userId: this.$store.state.user.id,
          type: 'album',
          id: this.albumData.id,
          file
        })

        return true
      },
      handleAlbumPosterRemove () {
        this.albumData.poster = []
      },
      handleAlbumUploadSuccess (res, file) {
        this.albumData.poster = [
          {
            name: file.name,
            url: res.data
          }
        ]
      },
      openCreateImageModal () {
        if (this.$store.state.login) {
          this.$channel.$emit('open-create-image-drawer')
        } else {
          this.$channel.$emit('sign-in')
        }
      },
      getSelectedMeta (name, value) {
        const key = `${name}Slots`
        if (!this[key][0].values.length) {
          return 0
        }
        return this[key][0].values[this[key][0].defaultIndex][value]
      },
      getNameById (name, id) {
        const key = `${name}Slots`
        let result = ''
        if (!this[key][0].values.length) {
          return result
        }
        this[key][0].values.forEach(item => {
          if (item.id === id) {
            result = item.name
          }
        })
        return result
      },
      onTagsValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.imageData.tagsId = id
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
        this.imageData.sizeId = id
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
        this.imageData.roleId = id
        this.roleSlots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.roleSlots[0].defaultIndex = index
          }
        })
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
        if (this.openEditAlbumModal) {
          this.albumData.bangumiId = id
        } else {
          this.imageData.bangumiId = id
          this.imageData.selectedRole = false
          this.getBangumiRoles(this.getSelectedMeta('bangumi', 'id'))
        }
      },
      onSortValuesChange (picker, values) {
        this.saveSortSelect = values
      },
      handleSelectedSort () {
        const selectedTagsId = this.saveSortSelect[0].id
        const selectedSizeId = this.saveSortSelect[1].id
        const selectedCreatorId = this.saveSortSelect[2].id
        if (
          (this.selectedTagsId !== selectedTagsId) ||
          (this.selectedSizeId !== selectedSizeId) ||
          (this.selectedCreatorId !== selectedCreatorId)
        ) {
          this.selectedTagsId = selectedTagsId
          this.selectedSizeId = selectedSizeId
          this.selectedCreatorId = selectedCreatorId
          this.handleLoadMoreClick(true)
        }
      }
    }
  }
</script>
