import './style.scss'

export default class {
  show ({ parent, click } = {}) {
    const id = `backdrop-${Math.random().toString(36).substring(3, 6)}`
    const parentNode = parent || document.body
    const div = document.createElement('div')
    div.id = id
    div.classList.add('backdrop', 'show')
    if (click) {
      div.addEventListener('click', (e) => {
        e.stopPropagation()
        click()
      })
    }
    document.body.style.overflowY = 'hidden'
    parentNode.appendChild(div)
    return id
  }

  hide ({ id } = {}) {
    const list = document.querySelectorAll('.backdrop')
    if (list.length) {
      const backdrop = id ? document.getElementById(id) : list[0]
      backdrop.classList.add('hide')
      backdrop.classList.remove('show')
      document.body.style.overflowY = 'auto'
      setTimeout(() => {
        backdrop.parentNode.removeChild(backdrop)
      }, 200)
    }
  }
}
