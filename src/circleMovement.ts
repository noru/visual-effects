import { TAU, random, sample } from '@drewxiu/utils'
import { Colors } from './utils/common'

interface Coord2D {
  x: number
  y: number
}

class Particle {
  context: CanvasRenderingContext2D
  center: Coord2D
  radius: number = 0
  v: number = 0
  distance: number = 0
  radian: number = 0
  color: string = ''
  trace?: Coord2D

  constructor(context: CanvasRenderingContext2D, center: Coord2D) {
    this.context = context
    this.center = center
  }

  draw() {
    let ctx = this.context
    ctx.beginPath()
    if (this.trace) {
      this.trace.x -= (this.trace.x - this.center.x) * 0.04
      this.trace.y -= (this.trace.y - this.center.y) * 0.04
    } else {
      this.trace = {
        ...this.center,
      }
    }
    let x = this.trace.x + Math.sin(this.radian) * this.distance
    let y = this.trace.y + Math.cos(this.radian) * this.distance
    ctx.arc(x, y, this.radius, 0, TAU)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

interface Config {
  container?: HTMLElement
  amount?: number
  colors?: string[]
  width?: number
  height?: number
}

export function circleMovement({
  container = document.body,
  amount = 100,
  colors = Colors,
  width,
  height,
}: Config = {}) {
  let frameId
  let ratio = window.devicePixelRatio
  width = width || container.offsetWidth
  height = height || container.offsetHeight
  let mousePos = { x: (width * ratio) / 2, y: (height * ratio) / 2 }
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')!
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  context.fillStyle = '#FAFAFA'
  context.fillRect(0, 0, canvas.width, canvas.height)

  let particles = new Array<Particle>(amount)

  for (let i = 0; i < amount; i++) {
    let p = new Particle(context, mousePos)
    p.radius = random(1, 3) * ratio
    p.distance = random(50, 150) * ratio
    p.radian = random(0, TAU)
    p.color = sample(colors)
    p.v = random(0.02, 0.05)
    particles[i] = p
  }
  function render() {
    // apply a layer of transparent white mask to simulate fade out effect
    context.fillStyle = 'rgba(255, 255, 255, 0.07)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.draw()
      p.radian += p.v
    })

    // next frame
    frameId = requestAnimationFrame(render)
  }
  container.append(canvas)
  render()
  function recordMousePos(evt) {
    mousePos.x = evt.offsetX * ratio
    mousePos.y = evt.offsetY * ratio
  }
  canvas.addEventListener('mousemove', recordMousePos)
  console.info('[Circle Movement]Inspired by <chriscourses.com>(https://www.youtube.com/watch?v=raXW5J1Te7Y)')
  return () => {
    cancelAnimationFrame(frameId)
    canvas.removeEventListener('mousemove', recordMousePos)
    canvas.remove()
  }
}
