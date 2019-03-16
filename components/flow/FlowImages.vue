<style lang="scss">
.flow-images {
  border-radius: 5px;
  overflow: hidden;
  font-size: 0;

  .h-shim {
    width: 4px;
    height: 100%;
    background-color: #fff;
  }

  .w-shim {
    width: 100%;
    height: 4px;
    background-color: #fff;
  }

  .two-images {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .item {
      flex-grow: 1;
      background-color: $color-background-container;
    }
  }

  .three-images {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .item {
      flex-grow: 2;
      background-color: $color-background-container;
    }

    .wrap {
      flex-grow: 1;
      background-color: $color-background-container;
    }
  }
}
</style>

<template>
  <div v-if="images.length" class="flow-images">
    <div v-if="images.length >= 3" class="three-images">
      <div class="item">
        <v-img :src="images[0].url" width="100%" height="120" />
      </div>
      <div class="h-shim" />
      <div class="wrap">
        <v-img :src="images[1].url" width="100%" height="58" />
        <div class="w-shim" />
        <v-img :src="images[2].url" width="100%" height="58" />
      </div>
    </div>
    <div v-else-if="images.length === 2" class="two-images">
      <div class="item">
        <v-img :src="images[0].url" width="100%" height="120" />
      </div>
      <div class="h-shim" />
      <div class="item">
        <v-img :src="images[1].url" width="100%" height="120" />
      </div>
    </div>
    <v-img v-else :src="images[0].url" width="100%" height="120" />
  </div>
</template>

<script>
export default {
  name: 'FlowImages',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
