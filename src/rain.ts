import { Sprites } from './utils/common'

interface Config {
  sprites?: string[]
  size?: number | string
  amount?: number
}

const defaultConfig: Readonly<Required<Config>> = {
  sprites: Sprites,
  size: '1em',
  amount: 250,
}

export class Rain {
  canvas
  context
  sprites
  animationFrame: number | null = null
  dropsForDrawing = new Array()
  drops = 250

  constructor(config: Config = {}) {
    let mergedConfig = { ...defaultConfig, ...config }
    let canvas = document.createElement('canvas')
    let ratio = window.devicePixelRatio
    canvas.width = window.innerWidth * ratio
    canvas.height = window.innerHeight * ratio
    canvas.id = 'money-rain'
    canvas.style.background = 'transparent'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.sprites = mergedConfig.sprites
    this.drops = mergedConfig.amount
  }

  getARandomIcon() {
    let emoji: any = {}
    let { floor, random } = Math
    emoji.text = this.sprites[floor(random() * this.sprites.length)]
    emoji.x = floor(random() * this.canvas.width + 1)
    emoji.y = floor(random() * this.canvas.height + 1)
    emoji.speed = floor(random() * 10 + 1)
    emoji.opacity = 1
    emoji.opacitySpeed = 0.02 * (random() * 2 + 1)
    return emoji
  }

  paintIcon(emoji) {
    if (emoji.y >= this.canvas.height || emoji.opacity < 0.1) {
      let i = emoji.arrayIndex
      emoji = this.getARandomIcon()
      emoji.arrayIndex = i
      this.dropsForDrawing[i] = emoji
    } else {
      emoji.y += emoji.speed
      emoji.opacity -= emoji.opacitySpeed
    }
    this.context.globalAlpha = emoji.opacity
    let isEven = emoji.arrayIndex % 2
    this.context.font = isEven ? '30px serif' : '50px serif'
    this.context.fillText(emoji.text, emoji.x, emoji.y)
    this.context.restore()
  }

  generateDrops() {
    for (let i = 0; i < this.drops; i++) {
      let emoji = this.getARandomIcon()
      emoji.arrayIndex = i
      this.dropsForDrawing.push(emoji)
    }
  }

  animate = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.dropsForDrawing.length; i++) {
      this.paintIcon(this.dropsForDrawing[i])
    }
    this.animationFrame = window.requestAnimationFrame(this.animate)
  }

  isRaining = () => {
    return this.animationFrame !== null
  }
  start() {
    if (this.isRaining()) {
      return
    }
    document.body.appendChild(this.canvas)
    this.generateDrops()
    this.animationFrame = window.requestAnimationFrame(this.animate)
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrame!)
    this.animationFrame = null
    document.body.removeChild(this.canvas)
    this.dropsForDrawing.length = 0
  }
}
