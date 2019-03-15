<style lang="scss"></style>

<template>
  <div id="wx-app-idol-setting">
    <div class="container">
      <IdolSetting :idol="idol" />
    </div>
  </div>
</template>

<script>
import IdolSetting from '~/components/idol/IdolSetting'
import serverAuth from '~/mixins/serverAuth'
import { getCartoonRoleInfo } from '~/api/cartoonRoleApi'

export default {
  name: 'WxAppIdolSetting',
  components: {
    IdolSetting
  },
  mixins: [serverAuth],
  data() {
    return {
      idol: null
    }
  },
  async asyncData({ app, params, error }) {
    const { id } = params
    return getCartoonRoleInfo(app, { id })
      .then(data => {
        return {
          idol: data.role
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  }
}
</script>
