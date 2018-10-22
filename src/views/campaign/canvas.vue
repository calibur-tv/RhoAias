<style lang="scss">
$footer-height: 50px;

#campaign-canvas {
  min-height: 100vh;
  position: relative;

  #campaign-header {
    position: relative;
    height: 30px;
    width: 100%;

    .home {
      width: 90px;
      height: 25px;
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
  }

  #campaign-body {
    .creating {
      .file-input-wrap {
        opacity: 0;
      }

      .textarea {
        outline: none;
      }
    }

    .file-input-wrap {
      overflow: hidden;
      position: relative;

      input {
        opacity: 0;
        width: 100%;
        height: 100%;
        display: block;
      }

      .text {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 0;
      }
    }

    .textarea {
      outline-style: dashed;
      outline-width: 2px;
    }
  }

  #campaign-footer {
    position: fixed;
    width: 100%;
    height: $footer-height;
    font-size: 0;
    left: 0;
    bottom: 0;

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

  .shim-footer {
    width: 100%;
    height: $footer-height;
    background-color: transparent;
  }
}
</style>

<template>
  <div id="campaign-canvas">
    <div id="campaign-header">
      <a 
        id="campaign-header" 
        class="home" 
        href="/">
        calibur.tv
      </a>
    </div>
    <div id="campaign-body">
      <component 
        :class="{ 'creating': creating }" 
        :is="selectedTheme" 
        :image="result"/>
    </div>
    <div id="campaign-footer">
      <button 
        class="select-btn" 
        @click="changeTheme">更换场景</button>
      <button 
        class="create-btn" 
        @click="create">{{ result ? '重新制作' : '生成海报' }}</button>
    </div>
    <div class="shim-footer"/>
    <v-drawer
      v-model="openSelectThemeDrawer"
      from="bottom"
      size="70%"
      header-text="选择场景"
    >
      <v-radio
        v-model="selectedTheme"
        :options="themes"
        title="选择你喜欢的番剧"
      />
    </v-drawer>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import OnePiece from "~/components/campaign/OnePiece";
import BlackWork from "~/components/campaign/BlackWork";
import VRadio from "~/components/common/Radio";

export default {
  name: "CampaignCanvas",
  components: {
    VRadio,
    OnePiece,
    BlackWork
  },
  data() {
    return {
      creating: false,
      openSelectThemeDrawer: false,
      result: "",
      selectedTheme: "one-piece",
      themes: [
        {
          label: "海贼王 - 通缉令",
          value: "one-piece"
        },
        {
          label: "博多豚骨拉面团 - 黑色工作",
          value: "black-work"
        }
        //          {
        //            label: '无头骑士异闻录 - dollars',
        //            value: 'dollars'
        //          }
      ]
    };
  },
  watch: {
    selectedTheme() {
      setTimeout(() => {
        this.openSelectThemeDrawer = false;
        this.$channel.$emit("campaign-canvas-reset");
        this.result = "";
      }, 300);
    }
  },
  methods: {
    changeTheme() {
      this.openSelectThemeDrawer = true;
    },
    create() {
      if (this.creating) {
        return;
      }
      if (this.result) {
        this.$channel.$emit("campaign-canvas-reset");
        this.result = "";
        return;
      }
      this.creating = true;
      this.$channel.$emit("campaign-canvas-creating");

      this.$toast.loading("制作中...");

      const config = {
        allowTaint: false,
        useCORS: true,
        backgroundColor: null
      };

      setTimeout(() => {
        html2canvas(document.querySelector(".canvas-wrap"), config)
          .then(canvas => {
            this.result = canvas.toDataURL("image/png");
            this.$toast.success("制作成功！长按图片可保持");
            this.creating = false;
          })
          .catch(() => {
            this.$toast.error("制作失败~");
            this.creating = false;
          });
      }, 1000);
    }
  }
};
</script>
