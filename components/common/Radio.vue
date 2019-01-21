<style lang="scss">
$height: 48px;

.mint-radiolist {
  text-align: left;

  .mint-radiolist-label {
    height: $height;
    display: block;
    padding: 0 10px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #f0f0f0;
      bottom: 0;
    }
  }

  .mint-radiolist-title {
    font-size: 12px;
    padding: 8px;
    display: block;
    color: #888;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #f0f0f0;
      bottom: 0;
    }
  }
}

.mint-radio-wrap {
  height: $height;
  background-color: #ffffff;
}

.mint-radio {
  display: inline-block;
  vertical-align: middle;
  line-height: $height;
  height: $height;

  &.is-right {
    float: right;
  }

  .mint-radio-input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked {
      + .mint-radio-core {
        background-color: #26a2ff;
        border-color: #26a2ff;

        &::after {
          background-color: $color-white;
          transform: scale(1);
        }
      }
    }
    &[disabled] + .mint-radio-core {
      background-color: #d9d9d9;
      border-color: #ccc;
    }
  }

  .mint-radio-core {
    box-sizing: border-box;
    display: inline-block;
    background-color: $color-white;
    border-radius: 100%;
    border: 1px solid #ccc;
    position: relative;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    top: -2px;

    &::after {
      content: '';
      border-radius: 100%;
      position: absolute;
      left: 5px;
      top: 5px;
      width: 8px;
      height: 8px;
      transition: transform 0.2s;
      transform: scale(0);
    }
  }
}

.mint-radio-label {
  display: inline-block;
  height: $height;
  line-height: $height;
  vertical-align: middle;
  margin-left: 6px;
}
</style>

<template>
  <div 
    class="mint-radiolist" 
    @change="$emit('change', currentValue)">
    <label 
      v-if="title" 
      class="mint-radiolist-title" 
      v-text="title" />
    <div
      v-for="(option, index) in options"
      :key="index"
      class="mint-radio-wrap"
    >
      <label class="mint-radiolist-label">
        <span 
          :class="{ 'is-right': align === 'right' }" 
          class="mint-radio">
          <input
            v-model="currentValue"
            :disabled="option.disabled"
            :value="option.value || option"
            class="mint-radio-input"
            type="radio"
          >
          <span class="mint-radio-core" />
        </span>
        <span 
          class="mint-radio-label" 
          v-text="option.label || option" />
      </label>
    </div>
  </div>
</template>

<script>
/**
 * mt-radio
 * @module components/radio
 * @desc 单选框列表，依赖 cell 组件
 *
 * @param {string[], object[]} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string} value - 选中值
 * @param {string} title - 标题
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 * @example
 * <mt-radio v-model="value" :options="['a', 'b', 'c']"></mt-radio>
 */
export default {
  name: 'VRadio',
  props: {
    title: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    currentValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
