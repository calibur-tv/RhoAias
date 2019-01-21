<style lang="scss">
.json-content-txt-parser {
  p {
    margin-left: $container-padding;
    margin-right: $container-padding;
    font-weight: 400;
    line-height: 1.7;
    color: #2f2f2f;
    @extend %breakWord;
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 16px;
  }
}
</style>

<template>
  <div class="json-content-txt-parser"><p v-html="item.text" /></div>
</template>

<script>
export default {
  name: 'JsonContentTxtParser',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
