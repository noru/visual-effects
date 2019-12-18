import { random } from '@drewxiu/utils'

const TAU = Math.PI * 2

class Dot {
  static ctx
  static perspective
  static ProjectionCenterX
  static ProjectionCenterY

  r: number
  theta: number
  phi: number
  x: number = 0
  y: number = 0
  z: number = 0
  size: number = 10
  projectedX: number = 0
  projectedY: number = 0
  projectedScale: number = 1

  constructor(r: number, theta: number, phi: number) {
    this.r = r
    this.theta = theta
    this.phi = phi
  }

  project() {
    this.theta = (this.theta + TAU / 720) % TAU
    this.x = this.r * Math.sin(this.phi) * Math.cos(this.theta)
    this.y = this.r * Math.cos(this.phi)
    this.z = this.r * Math.sin(this.phi) * Math.sin(this.theta) + this.r

    this.projectedScale = Dot.perspective / (Dot.perspective + this.z)
    this.projectedX = this.x * this.projectedScale + Dot.ProjectionCenterX
    this.projectedY = this.y * this.projectedScale + Dot.ProjectionCenterY
  }

  draw() {
    this.project()
    let alpha = 1 - this.z / (this.r * 2) + 0.3
    Dot.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
    Dot.ctx.beginPath()
    Dot.ctx.arc(this.projectedX, this.projectedY, this.size * this.projectedScale, 0, Math.PI * 2)
    Dot.ctx.closePath()
    Dot.ctx.fill()
  }
}

export function globe() {
  let frameId
  let container = document.body
  let ratio = window.devicePixelRatio
  let width = container.offsetWidth
  let height = container.offsetHeight

  const dots = new Array<Dot>()
  for (let i = 0; i < 400; i++) {
    let dot = new Dot(width / 3, random(0, TAU), Math.acos(random() * 2 - 1))
    dots.push(dot)
  }

  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')!
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  Dot.ctx = context
  Dot.perspective = canvas.width * 0.8
  Dot.ProjectionCenterX = canvas.width / 2
  Dot.ProjectionCenterY = canvas.height / 2

  function render() {
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillRect(0, 0, canvas.width, canvas.height)
    dots.sort((a, b) => a.z - b.z).forEach(d => d.draw())
    frameId = requestAnimationFrame(render)
  }

  container.append(canvas)
  render()
  return () => {
    cancelAnimationFrame(frameId)
    canvas.remove()
  }
}
