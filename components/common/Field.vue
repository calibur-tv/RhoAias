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
      margin-left: -$close-size / 2;
      margin-top: -$close-size / 2;
      background-color: gray;
      text-align: center;
      color: #fff;
    }
  }
}
</style>

<template>
  <div class="v-field">
    <div :style="{ width: labelSize }" class="label" v-text="label" />
    <div v-show="text && !disabled" class="close" @click="text = ''">
      <span>&times;</span>
    </div>
    <div class="input">
      <input v-model="text" :type="type" :placeholder="placeholder" >
    </div>
  </div>
</template>

<script>
export default {
  name: 'VField',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      required: true,
      type: [Number, String]
    },
    placeholder: {
      type: String,
      default: ''
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
  data() {
    return {
      text: this.value
    }
  },
  watch: {
    value(val) {
      this.text = val
    },
    text(val) {
      this.$emit('input', val)
    }
  }
}
</script>
