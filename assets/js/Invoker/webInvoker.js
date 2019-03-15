/* eslint-disable */
import invokerInterface from './invokerInterface'
import { MessageBox } from 'mint-ui'

export default class extends invokerInterface {
  getDeviceInfo(callback) {
    this.JsCallApp('getDeviceInfo', {}, callback)
    callback(window.navigator.userAgent)
  }

  getUserInfo(callback) {
    this.JsCallApp('getUserInfo', {})
    callback &&
      callback({
        id: 1,
        zone: 'bing-yu',
        avatar:
          'https://image.calibur.tv/user/1/avatar/0/1530281203832-e6c.jpeg',
        banner:
          'https://image.calibur.tv/user/1/banner/0/1530281125317-y03.jpeg',
        nickname: '冰淤',
        signature: '天下漫友是一家',
        level: 23,
        power: 316,
        sex: '男',
        sexSecret: false,
        share_data: {
          title: '冰淤',
          desc: '天下漫友是一家',
          link: 'https://m.calibur.tv/user/bing-yu',
          image:
            'https://image.calibur.tv/user/1/avatar/0/1530281203832-e6c.jpeg-share120jpg'
        },
        faker: false,
        banned_to: '',
        badge: [
          {
            id: '3',
            name: '站长',
            icon:
              'https://image.calibur.tv/admin/1/tag/badge//1550572993150-jjm.png'
          },
          {
            id: '1',
            name: '版主',
            icon:
              'https://image.calibur.tv/admin/1/tag/badge//1550572974015-c9x.png'
          },
          {
            id: '7',
            name: '光芒',
            icon:
              'https://image.calibur.tv/admin/1/tag/badge//1550573034437-93t.png'
          },
          {
            id: '2',
            name: '代行者',
            icon:
              'https://image.calibur.tv/admin/1/tag/badge//1550572983550-wxj.png'
          }
        ],
        banlance: {
          coin_count: '143.94',
          light_count: '6.27'
        }
      })
  }

  setUserInfo(data) {
    this.JsCallApp('setUserInfo', data)
    M.user = data
  }

  logout() {
    this.JsCallApp('logout')
  }

  toNative(page, params) {
    this.JsCallApp('toNative', { page, params })
  }

  previewImages({ images, index }) {
    this.JsCallApp('previewImages', { images, index })
  }

  toggleClick({ type, model, id, result }) {
    this.JsCallApp('toggleClick', { type, model, id, result })
  }

  confirm({
    title,
    message,
    cancelButtonText,
    submitButtonText,
    callback
  } = {}) {
    const sendTitle = title || '提示'
    const sendMessage = message || 'calibur.tv'
    const sendCancelButtonText = cancelButtonText || '取消'
    const sendSubmitButtonText = submitButtonText || '确认'
    MessageBox.confirm(sendMessage, sendTitle, {
      confirmButtonText: sendSubmitButtonText,
      cancelButtonText: sendCancelButtonText,
      type: 'warning'
    })
      .then(callback)
      .catch(() => {})
  }

  createMainComment({ model_type, model_id }) {
    this.JsCallApp('createMainComment', { model_type, model_id })
  }

  createEditorSection({ type, id }, callback) {
    this.JsCallApp('createEditorSection', { type, id }, callback)
  }

  editEditorSection({ type, id, data }, callback) {
    this.JsCallApp('editEditorSection', { type, id, data }, callback)
  }

  editEditorImageSection({ id, type, data }, callback) {
    this.JsCallApp('editEditorImageSection', { type, id, data }, callback)
  }

  editEditorTextSection({ id, type, data }, callback) {
    this.JsCallApp('editEditorTextSection', { type, id, data }, callback)
  }

  sendEditorContent({ content }) {
    this.JsCallApp('sendEditorContent', { content })
  }

  createSubComment({
    model_type,
    parent_comment_id,
    target_user_id,
    target_user_name
  }) {
    this.JsCallApp('createSubComment', {
      model_type,
      parent_comment_id,
      target_user_id,
      target_user_name
    })
  }

  readNotification({ count }) {
    this.JsCallApp('readNotification', { count })
  }

  JsCallApp(func, params, callback) {
    console.log(func, params, callback)
  }

  appCallJs(jsonObj) {
    let paramsObj
    try {
      paramsObj = JSON.parse(jsonObj)
    } catch (e) {
      paramsObj = {}
    }

    const func = paramsObj.func
    const params = paramsObj.params || {}
    const callbackId = paramsObj.callbackId
    const jsFunction = this.jsFuncs[func]

    if (!jsFunction || typeof jsFunction !== 'function') {
      return
    }

    const data = jsFunction.call(this, params)
    console.log(func, params, callbackId, data)
  }
}
