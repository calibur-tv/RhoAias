<style lang="scss">
  #homepage {
    #posts {
      .post {
        padding-top: 17px;

        .header {
          height: 35px;
          margin-bottom: 9px;

          .avatar {
            margin-right: 10px;
            display: block;
            float: left;
            @include avatar(35px);
          }

          .name {
            vertical-align: middle;
            display: block;
            overflow: hidden;

            p {
              margin-bottom: 3px;
              font-size: 14px;
              color: #333;
            }

            time {
              color: #999;
              font-size: 12px;
            }
          }
        }

        .body {
          display: block;

          .content {
            color: #000;
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 4px;
          }

          .images {
            .image-full {
              height: 190px;
              width: 100%;
            }

            .image-list {
              img {
                width: 32%;
                height: auto;

                &:not(:last-child) {
                  margin-right: 2%;
                }
              }
            }
          }
        }

        .footer {
          height: 44px;
          line-height: 44px;
          color: #666;
          font-size: 12px;

          .bangumi {
            float: left;
          }

          .stats {
            overflow: hidden;
            text-align: right;
          }
        }
      }
    }
  }
</style>

<template>
  <div id="homepage">
    <ul id="posts">
      <li class="post" v-for="item in list.data">
        <div class="header">
          <router-link class="avatar" :to="$alias.user(item.user.id)">
            <v-img width="70" :src="item.user.avatar"></v-img>
          </router-link>
          <router-link class="name" :to="$alias.user(item.user.id)">
            <p v-text="item.user.nickname"></p>
            <v-time v-model="item.created_at"></v-time>
          </router-link>
        </div>
        <router-link :to="$alias.post(item.id)" class="body">
          <p class="content twoline" v-text="item.desc"></p>
          <div class="images clearfix" v-if="item.images.length">
            <v-img
              class="image-full bg"
              v-if="item.images.length === 1"
              :src="item.images[0]"
              height="190"
              mode="2"
              tag="div"
            ></v-img>
            <div class="image-list" v-else>
              <v-img
                v-for="image in item.images"
                :src="image"
                width="110"
              ></v-img>
            </div>
          </div>
        </router-link>
        <div class="footer">
          <router-link
            class="bangumi"
            :to="$alias.bangumi(item.bangumi.id)"
            v-text="item.bangumi.name"
          ></router-link>
          <div class="stats">
            <span v-text="item.view_count"></span>
          </div>
        </div>
        <div class="hr"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  const defaultSort = 'new'

  export default {
    name: 'page-index',
    head: {
      title: '天下漫友是一家'
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('post/getTrending', {
        sort: defaultSort,
        ctx
      })
    },
    computed: {
      list () {
        return this.$store.state.post.trending[this.sort]
      }
    },
    data () {
      return {
        sort: defaultSort
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
