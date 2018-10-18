<style lang="scss">
.bangumi-select-drawer-wrap {
  height: 100%;
  overflow-y: auto;
  margin-top: -56px;
  padding-top: 56px;
}
</style>

<template>
  <v-drawer
    v-model="open"
    header-text="选择番剧"
    from="bottom"
    size="100%"
    class="bangumi-select-drawer"
    submit-text="确认"
    @submit="handleSubmit"
  >
    <div class="bangumi-select-drawer-wrap">
      <v-radio
        v-if="max === 1"
        v-model="selected"
        :options="filteredList"
      />
      <v-checklist
        v-else
        v-model="selectedIds"
        :options="filteredList"
        :max="max"
      />
    </div>
  </v-drawer>
</template>

<script>
import VChecklist from "~/components/common/CheckList";

export default {
  name: "BangumiSelect",
  components: {
    VChecklist
  },
  data() {
    return {
      open: false,
      list: [],
      selectedIds: [],
      selected: "",
      max: 1,
      filteredList: [],
      eventName: ""
    };
  },
  computed: {
    bangumis() {
      return this.$store.state.bangumi.all;
    }
  },
  mounted() {
    this.$channel.$on(
      "open-bangumi-selected",
      ({ list = [], selected = [], max = 1, eventName = "" }) => {
        if (!eventName) {
          console.error("使用 BangumiSelect 必须传入唯一的事件名用于回调");
          return;
        }
        this.eventName = eventName;
        const arr = list.length ? list : this.bangumis;
        this.list = arr.map(_ => Object.assign({}, _));
        this.filteredList = this.list.map(_ => {
          return {
            label: _.name,
            value: _.id
          };
        });
        this.selectedIds = selected;
        this.selected = Array.isArray(selected) ? "" : selected;
        this.max = max;
        this.open = true;
      }
    );
  },
  methods: {
    handleSubmit() {
      const isMuti = this.max > 1;
      if (isMuti && !this.selectedIds.length) {
        return null;
      }
      if (!isMuti && !this.selected) {
        return null;
      }
      const selectedIds = isMuti ? this.selectedIds : [this.selected];
      const result = this.list.filter(_ => selectedIds.indexOf(_.id) !== -1);
      this.$channel.$emit(this.eventName, isMuti ? result : result[0]);
    }
  }
};
</script>
