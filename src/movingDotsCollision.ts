import { sample, random, randomInt } from '@drewxiu/utils'
import { Colors } from './utils/common'
import { rotate2D, Vector2D } from './utils/math'

interface Partical {
  x: number
  y: number
  v: { x: number; y: number }
  color: string
  radius: number
  mass: number
}

interface Config {
  container?: HTMLElement
  amount?: number
  colors?: string[]
  width?: number
  height?: number
  mouseEffect?: boolean
  mouseEffectRange?: number
  mouseEffectMaxRadius?: number
}

const PHI = Math.PI * 2

export function movingDots({ container = document.body, amount = 100, colors = Colors, width, height }: Config = {}) {
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

  let particles = new Array<Partical>(amount)
  for (let i = 0; i < amount; i++) {
    let radius = random(15, 20) * ratio
    let x, y
    do {
      x = random(radius, width * ratio - radius)
      y = random(radius, height * ratio - radius)
    } while (particles.some(p => Math.hypot(x - p.x, y - p.y) < radius + p.radius))
    particles[i] = {
      x,
      y,
      v: {
        x: random(-2, 2) * ratio,
        y: random(-2, 2) * ratio,
      },
      color: sample(colors),
      radius,
      mass: 1, // radius * radius,
    }
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      // paint
      context.beginPath()
      context.arc(p.x, p.y, p.radius, 0, PHI)
      context.fillStyle = p.color
      context.fill()
      // resolve collision
      // edges
      if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
        p.v.x *= -1
      } else if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
        p.v.y *= -1
      } else {
        // other particles
        resolveCollision(p, particles)
      }
    })

    particles.forEach(p => {
      p.x += p.v.x
      p.y += p.v.y
    })
    // next frame
    frameId = requestAnimationFrame(render)
  }

  container.append(canvas)
  render()
  return () => {
    cancelAnimationFrame(frameId)
    canvas.remove()
  }
}

function resolveCollision(p: Partical, others: Partical[]): Vector2D | undefined {
  for (let i = 0; i < others.length; i++) {
    let other = others[i]
    if (other === p || !isCollided(p, other)) continue

    let vxDiff = p.v.x - other.v.x
    let vyDiff = p.v.y - other.v.y
    let xDist = other.x - p.x
    let yDist = other.y - p.y

    let angle = Math.atan2(other.y - p.y, other.x - p.x)
    rotate2D(p.v, angle)
    rotate2D(other.v, angle)
    let totalMass = p.mass + other.mass
    if (vxDiff * xDist + vyDiff * yDist < 0) {
      p.v.y = 2
      other.v.y = -2
    } else {
      p.v.x = ((p.mass - other.mass) * p.v.x) / totalMass + (other.mass * 2 * other.v.x) / totalMass
      other.v.x = ((p.mass - other.mass) * other.v.x) / totalMass + (other.mass * 2 * p.v.x) / totalMass
    }
    rotate2D(p.v, -angle)
    rotate2D(other.v, -angle)
  }
  return p.v
}

function isCollided(p1: Partical, p2: Partical) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y) < p1.radius + p2.radius
}
