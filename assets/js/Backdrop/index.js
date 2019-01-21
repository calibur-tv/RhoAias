import './style.scss'

export default class {
  show({ ele, click } = {}) {
    const id = `backdrop-${Math.random()
      .toString(36)
      .substring(3, 6)}`
    const div = document.createElement('div')
    div.id = id
    div.classList.add('backdrop', 'show')
    if (click) {
      div.addEventListener('click', () => {
        click()
      })
    }
    document.body.style.overflowY = 'hidden'
    ele ? ele.parentNode.insertBefore(div, ele) : document.body.appendChild(div)
    return id
  }

  hide(id) {
    if (!id) {
      return
    }
    const backdrop = document.getElementById(id)
    if (!backdrop) {
      return
    }
    backdrop.classList.add('hide')
    backdrop.classList.remove('show')
    document.body.style.overflowY = 'auto'
    setTimeout(() => {
      backdrop &&
        backdrop.parentNode &&
        backdrop.parentNode.removeChild(backdrop)
    }, 200)
  }
}
