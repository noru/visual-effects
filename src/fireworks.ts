import { TAU, random, sample, randomInt } from '@drewxiu/utils'
import { Colors } from './utils/common'

interface Particle {
  x: number
  y: number
  speed: number
  opacity: number
  opacityStep: number
  yV: number
  rotation: number
}

class Shot {
  x!: number
  driftedX!: number
  height!: number
  explodeHeight!: number
  initSpeed!: number
  color!: string
  radius!: number
  distanceFromCameraFactor!: number
  particles!: Particle[]
  context: CanvasRenderingContext2D
  finished = false

  gravity = 0.05
  friction = 0.96

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
      this.height += this.initSpeed *= 0.96
      this.x = (this.driftedX - this.x) * 0.035 + this.x
    } else {
      let count = 0
      this.particles.forEach(p => {
        p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180)
        p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180) + (p.yV += this.gravity)
        p.speed *= this.friction
        p.opacity -= p.opacityStep
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
      ctx.arc(p.x, p.y, 3, 0, TAU)
      ctx.fillStyle = this.color
      ctx.globalAlpha = p.opacity
      ctx.fill()
      ctx.restore()
    })
  }

  reset() {
    let canvas = this.context.canvas
    this.height = 0
    this.distanceFromCameraFactor = random(0.3, 1)
    this.explodeHeight = this.distanceFromCameraFactor * 0.9 * this.context.canvas.height
    this.x = random(canvas.width * 0.1, canvas.width * 0.9)
    this.driftedX = (random(-2, 2) * canvas.width) / 30 + this.x
    this.color = sample(Colors)
    this.radius = this.explodeHeight * 0.3
    this.initSpeed = this.explodeHeight * 0.05
    this.particles = Array.from({ length: 150 }, _ => ({
      x: this.driftedX,
      y: canvas.height - this.explodeHeight,
      yV: 0,
      rotation: randomInt(0, 360),
      speed: random(0.03, 0.06) * this.radius,
      opacity: this.distanceFromCameraFactor,
      opacityStep: 0.01 * this.distanceFromCameraFactor,
    }))
  }
}

interface Config {
  container?: HTMLElement
  width?: number
  height?: number
}

export function fireworks({ container = document.body, width, height }: Config = {}) {
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

  context.fillStyle = '#999'
  context.fillRect(0, 0, canvas.width, canvas.height)

  let shots = new Array<Shot>()

  let lastFire = 0
  function render() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    let now = Date.now()
    if (now - lastFire > random(100, 400)) {
      lastFire = now
      shots.push(new Shot(context))
    }
    shots = shots.filter(f => !f.finished)
    shots.forEach(f => f.draw())
    frameId = requestAnimationFrame(render)
  }

  container.append(canvas)
  render()
  return () => {
    cancelAnimationFrame(frameId)
    canvas.remove()
  }
}
