import { sample } from '@drewxiu/utils'

interface Config {
  container?: HTMLElement
  colors?: string[]
  sprites?: string[]
  size?: number | string
}

const defaultConfig: Readonly<Required<Config>> = {
  container: document.body,
  colors: ['#FB4A9B', '#F8CD4F', '#FC979D', '#A6DFEB', '#66B8C9', '#FAD7F3', '#FFE65B', '#DCF2F0'],
  sprites: ['*'],
  size: '1em',
}

const TEMPLATE = document.createElement('span')
TEMPLATE.style.display = 'block'
TEMPLATE.style.position = 'fixed'
TEMPLATE.style.zIndex = '861112'
TEMPLATE.style.transition = 'all 2s'
TEMPLATE.style.opacity = '1'
TEMPLATE.style.pointerEvents = 'none'

export function snowflake(config: Config = {}) {
  let { colors, sprites, container, size } = Object.assign({}, defaultConfig, config)

  let mouseMoveListener = evt => {
    let color = sample(colors)
    let innerText = sample(sprites)
    let flake = TEMPLATE.cloneNode(true) as HTMLSpanElement
    flake.innerText = innerText
    flake.style.top = `${evt.clientY}px`
    flake.style.left = `${evt.clientX}px`
    flake.style.color = color
    flake.style.fontSize = typeof size === 'number' ? size + 'px' : size
    container.appendChild(flake)
    setTimeout(() => {
      flake.style.opacity = '0'
      flake.style.transform = `scale(.4) translate3d(${(0.5 - Math.random()) * 300}px, ${Math.random() * 380}px, 0)`
    })
    setTimeout(() => {
      flake.remove()
    }, 2000)
  }
  container.addEventListener('mousemove', mouseMoveListener)
  return () => container.removeEventListener('mousemove', mouseMoveListener)
}
