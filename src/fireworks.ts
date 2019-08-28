import { TAU, random, sample, randomInt } from '@drewxiu/utils'
import { Colors } from './utils/common'

class Firework {
  x!: number
  height!: number
  explodeHeight!: number
  initSpeed!: number
  color!: string
  radius!: number
  distanceFromCameraFactor!: number
  particles!: any[]
  context: CanvasRenderingContext2D
  finished = false

  gravity = 0.05
  friction = 0.9

  constructor(context: CanvasRenderingContext2D) {
    this.context = context
    this.reset()
  }

  draw() {
    if (this.height < this.explodeHeight) {
      this.ascending()
    } else {
      this.exploding()
    }
    this.next()
  }

  next() {
    if (this.height < this.explodeHeight) {
      this.height += this.initSpeed *= 0.97
    } else {
      let count = 0
      this.particles.forEach(p => {
        p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180)
        p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180) + (p.yV += this.gravity)
        p.speed *= this.friction
        p.opacity -= 0.02
        if (p.opacity <= 0) {
          p.opacity = 0
          count++
        }
      })
      if (count === this.particles.length) {
        this.finished = true
      }
    }
  }

  ascending() {
    let ctx = this.context
    let convertedHeight = ctx.canvas.height - this.height
    ctx.beginPath()
    ctx.arc(this.x, convertedHeight, 5, Math.PI, TAU)
    ctx.moveTo(this.x - 5, convertedHeight)
    ctx.lineTo(this.x, convertedHeight + 60)
    ctx.lineTo(this.x + 5, convertedHeight)
    ctx.strokeStyle = this.color
    ctx.stroke()
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }

  exploding() {
    let ctx = this.context
    this.particles.forEach(p => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, TAU)
      ctx.fillStyle = this.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.restore()
    })
  }

  reset() {
    let canvas = this.context.canvas
    this.height = 0
    this.distanceFromCameraFactor = random(0.5, 1)
    this.explodeHeight = this.distanceFromCameraFactor * 0.9 * this.context.canvas.height
    this.x = random(canvas.width * 0.1, canvas.width * 0.9)
    this.color = sample(Colors)
    this.radius = this.explodeHeight * 0.3
    this.initSpeed = this.explodeHeight * 0.05
    this.particles = Array.from({ length: 150 }, _ => ({
      x: this.x,
      y: canvas.height - this.explodeHeight,
      yV: 0,
      rotation: randomInt(0, 360),
      speed: (random(3, 6) * this.radius) / 60,
      opacity: random(0.5, 1),
    }))
  }
}

interface Config {
  container?: HTMLElement
  colors?: string[]
  width?: number
  height?: number
}

export function fireworks({ container = document.body, colors = Colors, width, height }: Config = {}) {
  let frameId
  let ratio = window.devicePixelRatio
  width = width || container.offsetWidth
  height = height || container.offsetHeight
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')!
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)

  let fireworks = new Array<Firework>()

  let lastFire = 0
  function render() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    let now = Date.now()
    if (now - lastFire > random(500, 1000)) {
      lastFire = now
      fireworks.push(new Firework(context))
    }
    fireworks = fireworks.filter(f => !f.finished)
    fireworks.forEach(f => f.draw())
    frameId = requestAnimationFrame(render)
  }

  container.append(canvas)
  render()
  return () => {
    cancelAnimationFrame(frameId)
    canvas.remove()
  }
}
