<style lang="scss">
  $footer-height: 50px;

  #campaign-canvas {
    min-height: 100vh;
    position: relative;
    padding-bottom: $footer-height;

    #campaign-header {
      position: absolute;
      top: 0;
      left: 15px;
      z-index: 9;
      background-color: #fff;
      color: $color-blue-normal;
      font-size: 16px;
      font-weight: 700;
      padding: 2px 10px 5px 10px;
      border-radius: 0 0 5px 5px;
    }

    #campaign-body {
      position: absolute;
      bottom: $footer-height;
      right: 0;
      left: 0;
      top: 0;

      >* {
        position: absolute;
        width: 300px;
        height: 520px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .canvas-wrap {
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0.3rem 2rem rgba(51,51,51,.15);
        width: 100%;
        max-height: 480px;
        display: block;

        .ad {
          opacity: 0;
          transition: .2s;
        }
      }

      &.creating {
        .ad {
          opacity: 1 !important;
        }
      }

      .controls {
        width: 100%;
        height: 40px;
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        button {
          font-size: 12px;
          background-color: #fff;
          color: $color-text-normal;
          height: 30px;
          padding: 0 15px;
          line-height: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 5px 5px;
        }
      }
    }

    #campaign-footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: $footer-height;
      font-size: 0;

      button {
        height: 100%;
        width: 50%;
        text-align: center;
        font-size: 16px;
      }

      .select-btn {
        background-color: #fff;
        color: $color-text-normal;
      }

      .create-btn {
        background: $color-blue-normal;
        color: #fff;
      }
    }
  }
</style>

<template>
  <div id="campaign-canvas">
    <router-link to="/" id="campaign-header">
      calibur.tv
    </router-link>
    <div id="campaign-body" :class="{ 'creating': creating }">
      <component :is="selectedTheme" :image="result"></component>
    </div>
    <div id="campaign-footer">
      <button class="select-btn" @click="openSelectThemeDrawer = true">更换场景</button>
      <button class="create-btn" @click="create">{{ result ? '重新制作' : '生成海报' }}</button>
    </div>
    <v-drawer
      v-model="openSelectThemeDrawer"
      from="bottom"
      size="70%"
      header-text="选择场景"
    >
      <v-radio
        title="选择你喜欢的番剧"
        v-model="selectedTheme"
        :options="themes"
      ></v-radio>
    </v-drawer>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import OnePiece from '~/components/campaign/OnePiece'

  export default {
    name: 'campaign-canvas',
    components: {
      OnePiece
    },
    watch: {
      selectedTheme () {
        setTimeout(() => {
          this.openSelectThemeDrawer = false
        }, 300)
      }
    },
    data () {
      return {
        creating: false,
        openSelectThemeDrawer: false,
        result: '',
        selectedTheme: 'one-piece',
        themes: [
          {
            label: '海贼王 - 通缉令',
            value: 'one-piece'
          },
          {
            label: '博多豚骨拉面团 - 黑色工作',
            value: 'black-work'
          },
          {
            label: '无头骑士异闻录 - dollars',
            value: 'dollars'
          }
        ]
      }
    },
    methods: {
      getImage (e) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (evt) => {
          this.list[this.index].imageValue = evt.target.result
          this.$refs.upload.value = ''
        }
        reader.readAsDataURL(file)
      },
      create () {
        if (this.creating) {
          return
        }
        if (this.result) {
          this.result = ''
          return
        }
        this.creating = true

        this.$toast.loading('制作中...')

        const config = {
          allowTaint: false,
          useCORS: true,
          backgroundColor: null
        }

        setTimeout(() => {
          html2canvas(document.querySelector('.canvas-wrap'), config).then((canvas) => {
            this.result = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            this.$toast.success('制作成功！长按图片可保持')
            this.creating = false
          }).catch(() => {
            this.$toast.error('制作失败~')
            this.creating = false
          })
        }, 1000)
      }
    }
  }
</script>
