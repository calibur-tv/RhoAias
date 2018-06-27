<style lang="scss">
  .comment-create-form {
    .content {
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      height: 250px;
      margin-bottom: 5px;
    }

    .submit-btn {
      margin-top: 15px;
      width: 100%;
    }
  }
</style>

<template>
  <div class="comment-create-form">
    <textarea
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      v-model.trim="content"
      @focus="handleAreaFocus"
    ></textarea>
    <el-button class="submit-btn" type="primary" @click="submit" :loading="submitting">发布</el-button>
  </div>
</template>

<script>
  export default {
    name: 'comment-create-form',
    props: {
      type: {
        required: true,
        type: String
      },
      id: {
        required: true,
        type: Number
      }
    },
    computed: {
      isGuest () {
        return !this.$store.state.login
      },
      formatContent () {
        let content = this.content
        while (content.match('\n\n\n') !== null) {
          content = content.replace(/\n\n\n/g, '\n\n')
        }
        content = content.split('\n')

        const res = []
        content.forEach(item => {
          res.push(item ? `<p>${item}</p>` : '<p><br/></p>')
        })

        return res.join('')
      },
      submitting () {
        return this.$store.state.comment.submitting
      }
    },
    data () {
      return {
        content: ''
      }
    },
    methods: {
      async submit () {
        if (this.isGuest) {
          this.$channel.$emit('sign-in')
          return
        }
        if (!this.formatContent) {
          this.$emit('close')
          return
        }
        if (this.submitting) {
          return
        }
        this.$store.commit('comment/SET_SUBMITTING', { result: true })
        try {
          const newComment = await this.$store.dispatch('comment/createMainComment', {
            content: this.formatContent,
            images: [],
            type: this.type,
            id: this.id,
            ctx: this
          })
          this.$toast.success('评论成功')
          this.$emit('close')
          this.content = ''
          setTimeout(() => {
            const dom = document.getElementById(`comment-${newComment.id}`)
            dom && this.$scrollToY(this.$utils.getOffsetTop(dom) - 100, 600)
          }, 400)
        } catch (e) {
          console.log(e)
          this.$toast.error(e)
        } finally {
          this.$store.commit('comment/SET_SUBMITTING', { result: false })
        }
      },
      handleAreaFocus () {
        document.body.scrollTop = 0
      }
    }
  }
</script>
