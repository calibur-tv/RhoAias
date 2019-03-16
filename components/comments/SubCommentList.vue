<style lang="scss">
.sub-comment-list-wrap {
  .reply-title {
    margin-top: $container-padding;
    font-size: 17px;
    line-height: 24px;

    span {
      @include half-font(11px, top);
      display: inline-block;
      color: $color-text-light;
      margin: 1px 0 0 -2px;
    }
  }

  .load-all-comment {
    position: relative;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: $color-link;
    width: 100%;
    text-align: left;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: -20px;
      height: 1px;
      background-color: $color-line;
      transform: scaleY(0.5);
    }
  }
}
</style>

<template>
  <div
    v-if="hasComment"
    class="sub-comment-list-wrap"
  >
    <div class="sub-comment-list">
      <SubCommentItem
        v-for="comment in filterComments"
        :key="comment.id"
        :comment="comment"
        :parent-user-id="authorId"
        :parent-comment-id="parentComment.id"
        :type="type"
      />
      <button
        v-if="!comments.noMore || comments.list.length > 2"
        class="load-all-comment"
        @click.stop="loadAllComment"
      >
        全部{{ comments.total }}条回复
      </button>
    </div>
  </div>
</template>

<script>
import SubCommentItem from './SubCommentItem'

export default {
  name: 'PostSubCommentList',
  components: {
    SubCommentItem
  },
  props: {
    parentComment: {
      required: true,
      type: Object
    },
    type: {
      required: true,
      type: String
    }
  },
  computed: {
    comments() {
      return this.parentComment.comments
    },
    authorId() {
      return this.parentComment.from_user_id
    },
    hasComment() {
      return !!this.comments.list.length
    },
    filterComments() {
      const data = this.comments
      const comments = data.list
      const result = comments.slice(0, 2)
      if (comments.every(_ => _.id <= data.maxId)) {
        return result
      }
      const ids = result.map(_ => _.id)
      return result.concat(
        comments.filter(_ => _.id > data.maxId && ids.indexOf(_.id) === -1)
      )
    }
  },
  methods: {
    loadAllComment() {
      this.$channel.$emit('load-all-sub-comment', {
        id: this.parentComment.id
      })
    }
  }
}
</script>
