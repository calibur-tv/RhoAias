<template>
  <div v-if="source">
    <slot
      :source="source"
      name="header"
    />
    <!-- flow list -->
    <slot :flow="source.list"/>
    <!-- flow state -->
    <flow-state
      :auto="auto"
      :loading="source.loading"
      :no-more="source.noMore"
      :nothing="source.nothing"
      :error="source.error"
      :display-no-more="displayNoMore"
      :fetch="loadMore"
    >
      <slot
        slot="error"
        name="error"
      />
      <slot
        slot="nothing"
        name="nothing"
      />
      <slot
        slot="no-more"
        name="no-more"
      />
      <slot
        slot="loading"
        name="loading"
      />
      <slot
        slot="load-btn"
        name="load-btn"
      />
    </flow-state>
  </div>
</template>

<script>
import FlowState from './FlowState'
import flowMixin from './flowMixin'

export default {
  name: 'FlowList',
  components: {
    FlowState
  },
  mixins: [flowMixin],
  computed: {
    source() {
      return this.$store.getters['flow/getFlow'](this.func, this.sort, this.id)
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('flow/loadMore', {
        type: this.type,
        sort: this.sort,
        func: this.func,
        id: this.id,
        count: this.count,
        changing: this.changing,
        _extra: this.extra
      })
    }
  }
}
</script>
