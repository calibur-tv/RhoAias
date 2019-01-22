<style lang="scss">
#the-world {
  .carousel {
    height: 150px;

    .mint-swipe-item {
      background-color: $color-pink-normal;
    }

    .background {
      position: absolute;
      display: block;
      width: 100vw;
      height: 150px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .intro {
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: rgba(30, 30, 34, 0.6);
      height: 50px;
      width: 100%;
      padding: 8px 10px 3px;
      color: #fff;

      .title {
        font-size: 14px;
      }

      .desc {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

  .flow-intro {
    margin-top: $container-padding;
    margin-bottom: $container-padding;

    .intro {
      @extend %clearfix;
      margin-bottom: $container-padding;

      .img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        margin-right: 10px;
        float: left;
        color: #fff;
        text-align: center;
        cursor: default;
        font-weight: bold;
        user-select: none;
        font-size: 36px;
        line-height: 80px;
      }

      .summary {
        overflow: hidden;

        .title {
          margin-top: 8px;
          font-size: 17px;
        }

        .extra {
          margin-top: 8px;
          font-size: 14px;
          color: $color-text-normal;
        }

        button {
          font-size: 13px;
          margin-top: 8px;
        }
      }
    }

    .detail {
      padding: 8px;
      padding-bottom: 3px;
      background-color: $color-gray-normal;
      color: $color-text-normal;
      margin-bottom: 10px;

      p {
        margin-bottom: 5px;
        font-size: 13px;
        line-height: 18px;
      }

      a {
        color: $color-blue-normal;
        transition: 0.4s;

        &:hover {
          color: $color-blue-deep;
        }
      }
    }

    .control {
      button {
        width: 100%;
        height: 40px;
        border: 1px solid #c8c8c8;
        color: #333;
        border-radius: 4px;
        padding: 6px 0;
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
</style>

<template>
  <div id="the-world">
    <div 
      v-if="loops.length" 
      class="carousel">
      <no-ssr>
        <mt-swipe :show-indicators="false">
          <mt-swipe-item 
            v-for="(item, index) in loops" 
            :key="index">
            <a
              :href="item.link"
              :style="{
                backgroundImage: `url(${$resize(item.poster, {
                  width: 600,
                  height: 300
                })})`
              }"
              class="background"
            >
              <div class="intro">
                <p 
                  class="title oneline" 
                  v-text="item.title" />
                <p 
                  class="desc oneline" 
                  v-text="item.desc" />
              </div>
            </a>
          </mt-swipe-item>
        </mt-swipe>
      </no-ssr>
    </div>
    <div class="hr" />
    <tab-container
      :headers="headers"
      :router="true"
    />
    <nuxt-child />
    <no-ssr>
      <creator-menu/>
    </no-ssr>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import { getCarousel } from '~/api/carouselApi'
import TabContainer from '~/components/common/TabContainer'
import CreatorMenu from '~/components/common/Creator'

export default {
  name: 'TheWorld',
  asyncData({ app }) {
    return getCarousel(app).then(loops => {
      return { loops }
    })
  },
  head: {
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: '站内热点'
      }
    ]
  },
  components: {
    'mt-swipe': Swipe,
    'mt-swipe-item': SwipeItem,
    TabContainer,
    CreatorMenu
  },
  data() {
    return {
      loops: [],
      headers: [
        {
          label: '帖子',
          route: 'world-post'
        },
        {
          label: '相册',
          route: 'world-pins'
        },
        {
          label: '漫评',
          route: 'world-review'
        },
        {
          label: '问答',
          route: 'world-qaq'
        }
      ]
    }
  }
}
</script>
