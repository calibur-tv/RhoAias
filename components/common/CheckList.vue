<style lang="scss">
.mint-checklist {
  &.is-limit {
    .mint-checkbox-core:not(:checked) {
      background-color: $color-background-tag;
      border-color: $color-background-tag;
    }
  }

  &-item {
    height: 48px;
    line-height: 47px;
    border-bottom: 1px solid #f0f0f0;
  }

  &-label {
    display: block;
    padding: 0 10px;
  }

  &-title {
    display: block;
    font-size: 12px;
    margin: 8px;
  }
}

.mint-checkbox {
  &.is-right {
    float: right;
  }

  &-label {
    vertical-align: middle;
    margin-left: 6px;
  }

  &-input {
    display: none;

    &:checked {
      + .mint-checkbox-core {
        background-color: $color-pink-normal;
        border-color: $color-pink-normal;

        &::after {
          border-color: #fff;
          transform: rotate(45deg) scale(1);
        }
      }
    }

    &[disabled] + .mint-checkbox-core {
      background-color: $color-background-tag;
      border-color: #ccc;
    }
  }

  &-core {
    display: inline-block;
    background-color: #fff;
    border-radius: 100%;
    border: 1px solid #ccc;
    position: relative;
    width: 20px;
    height: 20px;
    vertical-align: middle;

    &::after {
      border: 2px solid transparent;
      border-left: 0;
      border-top: 0;
      content: ' ';
      position: absolute;
      top: 4px;
      left: 7px;
      width: 4px;
      height: 8px;
      transform: rotate(45deg) scale(0);
      transition: transform 0.2s;
    }
  }
}
</style>

<template>
  <div
    :class="{ 'is-limit': max <= currentValue.length }"
    class="mint-checklist"
    @change="$emit('change', currentValue)"
  >
    <label v-if="title"
           class="mint-checklist-title" v-text="title"
    />
    <div
      v-for="option in options"
      :key="option.value || option"
      class="mint-checklist-item"
    >
      <label slot="title"
             class="mint-checklist-label"
      >
        <span :class="{ 'is-right': align === 'right' }"
              class="mint-checkbox"
        >
          <input
            v-model="currentValue"
            :disabled="option.disabled"
            :value="option.value || option"
            class="mint-checkbox-input"
            type="checkbox"
          >
          <span class="mint-checkbox-core" />
        </span>
        <span class="mint-checkbox-label"
              v-text="option.label || option"
        />
      </label>
    </div>
  </div>
</template>

<script>
/**
 * mt-checklist
 * @module components/checklist
 * @desc 复选框列表，依赖 cell 组件
 *
 * @param {(string[]|object[])} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string[]} value - 选中值的数组
 * @param {string} title - 标题
 * @param {number} [max] - 最多可选的个数
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 *
 * @example
 * <mt-checklist :v-model="value" :options="['a', 'b', 'c']"></mt-checklist>
 */
export default {
  name: 'VChecklist',
  props: {
    max: {
      type: Number,
      default: 5
    },
    title: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  computed: {
    limit() {
      return this.max < this.currentValue.length
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    currentValue(val) {
      if (this.limit) val.pop()
      this.$emit('input', val)
    }
  }
}
</script>
