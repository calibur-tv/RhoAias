<template>
  <div class="json-content">
    <component
      :is="`${item.type}-parser`"
      v-for="(item, index) in content"
      :key="index"
      :item="item"
    />
  </div>
</template>

<script>
import TxtParser from './parser/TxtParser'
import ImgParser from './parser/ImgParser'
import UseParser from './parser/UseParser'
import ListParser from './parser/ListParser'
import TitleParser from './parser/TitleParser'

export default {
  name: 'JsonContent',
  components: {
    TxtParser,
    ImgParser,
    UseParser,
    ListParser,
    TitleParser
  },
  props: {
    content: {
      required: true,
      type: Array
    }
  }
}
</script>
