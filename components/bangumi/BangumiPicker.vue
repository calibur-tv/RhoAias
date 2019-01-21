<template>
  <div class="bangumi-picker">
    <span v-if="label">番剧：</span>
    <div @click="openPicker">{{ placeholder }}</div>
    <v-drawer
      v-model="show"
      from="bottom"
      size="250px"
      header-text="选择番剧"
      submit-text="确认"
      @submit="onClickSelect"
    >
      <mt-picker 
        :slots="list" 
        value-key="name" 
        @change="onSlideSelect" />
    </v-drawer>
  </div>
</template>

<script>
import { Picker } from 'mint-ui'

export default {
  name: 'BangumiPicker',
  components: {
    'mt-picker': Picker
  },
  props: {
    value: {
      required: true,
      type: [Number, String]
    },
    label: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      loading: false,
      fetched: false,
      selected: false,
      isFirst: true,
      list: [
        {
          flex: 1,
          defaultIndex: -1,
          values: [],
          textAlign: 'center'
        }
      ]
    }
  },
  computed: {
    notInit() {
      return !this.list[0].values.length
    },
    placeholder() {
      if (this.loading) {
        return '加载中...'
      }
      if (this.notInit) {
        return '请先关注番剧'
      }
      if (!this.selected) {
        return '点击选择番剧'
      }
      return this.list[0].values[this.list[0].defaultIndex]['name']
    },
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    this.$watch('value', val => {
      this.autoSelect(val)
    })
    this.getData()
  },
  methods: {
    onClickSelect() {
      this.selected = true
      this.$emit('input', this.list[0].values[this.list[0].defaultIndex]['id'])
    },
    onSlideSelect(picker, values) {
      if (!values[0]) {
        return
      }
      const id = values[0].id
      this.list[0].values.forEach((item, index) => {
        if (item.id === id) {
          this.list[0].defaultIndex = index
          if (!this.isFirst) {
            this.selected = true
            this.$emit('input', item.id)
          } else {
            this.isFirst = false
          }
        }
      })
    },
    openPicker() {
      if (!this.fetched) {
        this.getData()
      } else if (this.notInit) {
        this.$toast.error('请先关注番剧')
      } else {
        this.show = true
      }
    },
    async getData() {
      if (this.loading || !this.user) {
        return
      }
      this.loading = true
      try {
        await this.$store.dispatch('users/getMineBangumis', {
          zone: this.user.zone
        })
        this.list[0].values = this.$store.state.users.mine_bangumis
        this.autoSelect(this.value)
        this.fetched = true
      } finally {
        this.loading = false
      }
    },
    autoSelect(id) {
      this.list[0].values.forEach((item, index) => {
        if (!(item.id - id)) {
          this.selected = true
          this.list[0].defaultIndex = index
        }
      })
    }
  }
}
</script>
