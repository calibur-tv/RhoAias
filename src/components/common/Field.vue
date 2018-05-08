<style lang="scss">
  $field-height: 48px;
  .v-field {
    width: 100%;
    height: 48px;

    .label {
      float: left;
      height: 100%;
      font-size: 16px;
      line-height: $field-height;
    }

    .input {
      overflow: hidden;
      height: 100%;

      $input-height: 20px;
      input {
        width: 100%;
        height: 100%;
        font-size: 16px;
        line-height: $input-height;
        padding-top: ($field-height - $input-height) / 2;
        padding-bottom: ($field-height - $input-height) / 2;
        background-color: transparent;
        border: 0;
      }
    }

    .close {
      float: right;
      width: $field-height;
      height: $field-height;
      position: relative;

      $close-size: 16px;
      span {
        width: $close-size;
        height: $close-size;
        font-size: 14px;
        line-height: 14px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: - $close-size / 2;
        margin-top: - $close-size / 2;
        background-color: gray;
        text-align: center;
        color: #fff;
      }
    }
  }
</style>

<template>
  <div class="v-field">
    <div
      class="label"
      v-text="label"
      :style="{ width: labelSize }"
    ></div>
    <div
      class="close"
      v-show="text && !disabled"
      @click="text = ''"
    >
      <span>&times;</span>
    </div>
    <div class="input">
      <input :type="type" :placeholder="placeholder" v-model="text">
    </div>
  </div>
</template>

<script>

  export default {
    name: 'v-field',
    props: {
      label: {
        type: String
      },
      value: {
        required: true
      },
      placeholder: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      labelSize: {
        type: String,
        default: '100px'
      }
    },
    watch: {
      value (val) {
        this.text = val
      },
      text (val) {
        this.$emit('input', val)
      }
    },
    data () {
      return {
        text: this.value
      }
    }
  }
</script>
