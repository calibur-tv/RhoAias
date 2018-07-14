<style lang="scss">
  .json-item {
    position: relative;
    height: 115px;

    &.selected {
      .show-area {
        border-color: $color-pink-normal;
        box-shadow: 0 0 0 2px rgba($color-pink-normal, .2);
      }
    }

    .delete-btn {
      position: absolute;
      left: 66px;
      top: 28px;
      width: 20px;
      height: 20px;
      text-align: center;
      background-color: #f56c6c;
      color: #fff;
      font-size: 11px;
      border-radius: 50%;
      line-height: 20px;
      opacity: .8;
    }

    .up-btn {
      position: absolute;
      width: 20px;
      height: 20px;
      right: -8px;
      top: -8px;
      background-color: $color-gray-light;
      color: #333;
      font-size: 11px;
      border-radius: 50%;
      line-height: 20px;
    }

    .show-area {
      background-color: $color-gray-normal;
      border: 1px solid transparent;
      transition-duration: .3s;
      margin-bottom: 7px;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;

      .capture {
        float: left;
        width: 76px;
        height: 76px;
        margin-right: 10px;

        .poster {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 100%;
          height: 100%;
        }

        .default {
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 76px;
          font-size: 30px;
          color: #fff;

          &.yellow {
            background-color: gold;
          }

          &.green {
            background-color: #67c23a;
          }
        }
      }

      .content {
        overflow: hidden;
        height: 76px;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-right: 6px;

        .text {
          font-size: 13px;
          line-height: 16px;
          -webkit-line-clamp: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          color: $color-text-normal;
          @extend %breakWord;
        }
      }
    }

    .append-area {
      text-align: center;

      button {
        width: 40px;
        height: 20px;
        line-height: 20px;
        margin: 0 8px;
        color: #fff;
        background-color: $color-gray-deep;
        border-radius: 10px;
        font-size: 12px;

        i {
          font-weight: bold;
        }
      }
    }
  }
</style>

<template>
  <div
    :class="{ selected }"
    class="json-item"
  >
    <button
      v-if="sectionCount > 1"
      class="delete-btn"
      @click="emitDelete"
    >
      <i class="el-icon-delete"/>
    </button>
    <button
      v-if="index"
      class="up-btn"
      @click="emitSort"
    >
      <i class="el-icon-arrow-up"/>
    </button>
    <div
      class="show-area"
      @click="emitPreview(item.type)"
    >
      <div class="capture">
        <template v-if="item.type === 'img'">
          <div
            v-if="item.url"
            :style="{ backgroundImage: `url(${$resize(item.url, { width: 150 })})` }"
            class="poster"
          />
          <div
            v-if="!item.url"
            class="default green"
          >
            <i class="el-icon-picture-outline"/>
          </div>
        </template>
        <div
          v-else-if="item.type === 'txt'"
          class="default yellow"
        >
          <i class="el-icon-document"/>
        </div>
      </div>
      <div class="content">
        <div
          class="text"
          v-html="item.text"
        />
      </div>
    </div>
    <div class="append-area">
      <button @click="emitCreate('txt')">
        <i class="el-icon-edit"/>
      </button>
      <button @click="emitCreate('img')">
        <i class="el-icon-picture"/>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'JsonItem',
    props: {
      item: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean,
        required: true,
        default: false
      },
      index: {
        type: Number,
        required: true
      }
    },
    computed: {
      sectionCount () {
        return this.$store.state.editor.sections.length
      }
    },
    methods: {
      emitPreview (type) {
        this.$emit('preview', { index: this.index, type })
      },
      emitCreate (type) {
        this.$emit('create', { index: this.index, type })
      },
      emitDelete () {
        this.$emit('delete', { index: this.index })
      },
      emitSort () {
        this.$emit('sort', { index: this.index })
      }
    }
  }
</script>
