<style lang="scss">
  #campaign-one-piece {

    .canvas-wrap {
      background-image: url(~img/campaign/one-piece.jpg);
      background-size: 100% auto;
      background-repeat: repeat-y;
      background-position: center -30px;

      .ad {
        position: absolute;
        left: 45px;
        right: 45px;
        bottom: 40px;
        height: 50px;
        background-color: rgba(255, 255, 255, .9);

        .text {
          overflow: hidden;

          .title {
            font-size: 13px;
            margin-top: 8px;
            margin-left: 8px;
          }
        }

        .qrcode {
          float: right;
        }
      }
    }
  }
</style>

<template>
  <div id="campaign-one-piece">
    <img class="canvas-wrap" :src="image" v-if="image">
    <div class="canvas-wrap" v-else>
      <div class="ad">
        <img class="qrcode" :src="$resize($siteQR, { width: 100 })" width="50" height="50">
        <div class="text">
          <p class="title">
            calibur.tv 天下漫友是一家
          </p>
        </div>
      </div>
    </div>
    <div class="controls">
      <button>头像</button>
      <button>条件</button>
      <button>名称</button>
      <button>赏金</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CampaignOnePiece',
    props: {
      image: {
        required: true,
        type: String
      }
    },
    data () {
      return {

      }
    },
    created () {

    },
    methods: {

    },
    mounted () {

    }
  }
</script>
