<style lang="scss">
  #comment-wrap {
    .load-more-btn {
      margin-top: 20px;
      margin-bottom: 20px;

      button {
        width: 100%;
      }
    }

    .focus-comment-drawer {
      .reply {
        .user {
          padding-top: $container-padding;

          .avatar {
            float: left;
            margin-right: 9px;
            @include avatar-2(35px)
          }

          .summary {
            overflow: hidden;

            .nickname {
              font-size: 14px;
              color: #333;
            }

            .info {
              line-height: 16px;
              font-size: 12px;
              color: #999;

              span {
                margin-right: 5px;
              }
            }
          }
        }

        .content {
          font-size: 16px;
          line-height: 24px;
          padding-top: 16px;
          padding-bottom: 16px;
          color: #000;

          .image-area {
            margin: 16px 0;

            img {
              width: 100%;
              height: auto;
            }
          }
        }
      }

      .total {
        height: 40px;
        line-height: 40px;
        color: #000;
        font-size: 16px;
      }

      .comments {
        li {
          padding: 17px 0 13px;
          position: relative;
          @include border-bottom();

          .from-user {
            .avatar {
              float: left;
              display: block;
              margin-right: 9px;
              @include avatar-2(35px);
            }

            .summary {
              overflow: hidden;

              .nickname {
                display: inline-block;
                font-size: 14px;
                line-height: 14px;
                margin-bottom: 6px;
                margin-top: 2px;
                color: $color-blue-deep;
              }

              .info {
                font-size: 12px;
                line-height: 12px;
                color: #999;
              }
            }
          }

          .content {
            padding-top: 11px;
            font-size: 16px;
            line-height: 24px;
            margin-left: 45px;

            a {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div id="comment-wrap">
    <!-- 主列表的头部 -->
    <slot name="header"></slot>
    <!-- 主列表的 list -->
    <div id="comment-list-wrap">
      <!-- 每条主评论 -->
      <div
        v-for="comment in list"
        :key="comment.id"
        class="comment-item-wrap"
      >
        <!-- 主评论的内容 -->
        <slot name="comment-item" :comment="comment"></slot>
      </div>
    </div>
    <div id="comment-list-footer">
      <slot name="load">
        <div class="load-more-btn">
          <el-button
            type="info"
            v-if="!noMore"
            :loading="loading"
            @click="loadMore"
            plain
            round
          >{{ loading ? '加载中...' : '加载更多' }}</el-button>
        </div>
      </slot>
    </div>
    <!-- reply drawer -->
    <!-- load all sub comment drawer -->
    <v-drawer
      v-model="openFocusCommentDrawer"
      from="bottom"
      size="100%"
      class="focus-comment-drawer"
      :header-text="`评论列表 - ${focusComment ? focusComment.floor_count : ''} 楼`"
      :backdrop="false"
    >
      <div
        class="container"
        v-if="focusComment"
      >
        <div class="reply">
          <div class="user clearfix">
            <a class="avatar" :href="$alias.user(focusComment.from_user_zone)">
              <img :src="$resize(focusComment.from_user_avatar, { width: 70 })">
            </a>
            <div class="summary">
              <a
                class="nickname"
                :href="$alias.user(focusComment.from_user_zone)"
                v-text="focusComment.from_user_name"
              ></a>
              <div class="info">
                <v-time v-model="focusComment.created_at"></v-time>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="text-area" v-html="focusComment.content"></div>
            <div class="image-area">
              <div
                class="image-package"
                v-for="(img, idx) in focusComment.images"
                :key="idx"
                @click="$previewImages(focusComment.images, idx)"
              >
                <v-img
                  class="image"
                  :src="img.url"
                  width="150"
                  mode="2"
                ></v-img>
              </div>
            </div>
          </div>
        </div>
        <div class="hr"></div>
        <p class="total">{{ focusComment.comments.total }}条回复</p>
        <ul class="comments">
          <li
            v-for="item in focusComment.comments.list"
            :key="item.id"
          >
            <div class="from-user">
              <a
                class="avatar"
                :href="$alias.user(item.from_user_zone)"
              >
                <img :src="$resize(item.from_user_avatar, { width: 70 })"/>
              </a>
              <div class="summary">
                <a
                  class="nickname"
                  :href="$alias.user(item.from_user_zone)"
                  v-text="item.from_user_name"
                ></a>
                <div class="info">
                  <v-time v-model="item.created_at"></v-time>
                </div>
              </div>
            </div>
            <div class="content" @click="commentToComment(item)">
              <template v-if="item.to_user_zone">
                回复
                <a
                  class="nickname"
                  :href="$alias.user(item.to_user_zone)"
                  v-text="item.to_user_name"
                ></a>
                :
              </template>
              <span class="comment-content">{{ item.content }}</span>
            </div>
          </li>
        </ul>
      </div>
      <!--
      <more-btn
        :no-more="noMoreComment"
        :loading="loadingComments"
        @fetch="loadMoreComment"
      ></more-btn>
      -->
    </v-drawer>
  </div>
</template>

<script>
  export default {
    name: 'v-comment-main',
    props: {
      id: {
        required: true,
        type: [Number, String]
      },
      type: {
        required: true,
        type: String,
        validator: val => ~['post'].indexOf(val)
      },
      onlySeeMaster: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      store () {
        return this.$store.state.comment
      },
      list () {
        return this.store.list
      },
      noMore () {
        return this.store.noMore
      },
      total () {
        return this.store.total
      },
      submitting () {
        return this.store.submitting
      },
      focusComment () {
        return this.focusCommentId
          ? this.list.filter(_ => _.id === this.focusCommentId)[0]
          : null
      }
    },
    data () {
      return {
        loading: false,
        focusCommentId: 0,
        openFocusCommentDrawer: false
      }
    },
    methods: {
      async loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('comment/getMainComments', {
            ctx: this,
            type: this.type,
            id: this.id,
            onlySeeMaster: this.onlySeeMaster ? 1 : 0
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      },
      async reply (data) {
        if (this.submitting) {
          return
        }
        this.$store.commit('comment/SET_SUBMITTING', { result: true })
        try {
          await this.$store.dispatch('comment/createMainComment', {
            content: data.content,
            images: data.images,
            type: 'post',
            id: this.id,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.$store.commit('comment/SET_SUBMITTING', { result: false })
          this.$channel.$emit('main-comment-create-success')
        }
      },
      commentToComment () {
      }
    },
    mounted () {
      this.$channel.$on('load-all-sub-comment', ({ id }) => {
        this.focusCommentId = id
        this.openFocusCommentDrawer = true
      })
    }
  }
</script>
