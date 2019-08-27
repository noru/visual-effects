import { sample, random, rotate2D, Vector2D, TAU } from '@drewxiu/utils'
import { Colors } from './utils/common'

interface Partical {
  x: number
  y: number
  v: Vector2D
  color: string
  radius: number
  mass: number
  updated?: boolean
}

interface Config {
  container?: HTMLElement
  amount?: number
  colors?: string[]
  width?: number
  height?: number
}

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
    let radius = random(20, 30) * ratio
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
      mass: radius * radius,
    }
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      // paint
      context.beginPath()
      context.arc(p.x, p.y, p.radius, 0, TAU)
      context.fillStyle = p.color
      context.fill()
      // resolve collision
      // edges
      if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
        p.v.x *= random(-0.95, -1.03)
      } else if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
        p.v.y *= random(-0.95, -1.03)
      } else {
        // other particles
        resolveCollision(p, particles)
      }
      p.x += p.v.x
      p.y += p.v.y
      p.updated = false
    })

    // next frame
    frameId = requestAnimationFrame(render)
  }

  container.append(canvas)
  render()
  console.info('[Moving Dots w/ Collision]Inspired by <chriscourses.com>(https://www.youtube.com/watch?v=789weryntzM)')
  return () => {
    cancelAnimationFrame(frameId)
    canvas.remove()
  }
}

function resolveCollision(p: Partical, others: Partical[]) {
  if (p.updated) {
    return
  }
  for (let i = 0; i < others.length; i++) {
    let other = others[i]
    if (other === p || !isCollided(p, other)) continue

    let vxDiff = p.v.x - other.v.x
    let vyDiff = p.v.y - other.v.y
    let xDist = other.x - p.x
    let yDist = other.y - p.y
    if (vxDiff * xDist + vyDiff * yDist < 0) {
      return
    }

    let angle = -Math.atan2(other.y - p.y, other.x - p.x)
    p.v = rotate2D(p.v, angle)
    other.v = rotate2D(other.v, angle)
    let totalMass = p.mass + other.mass
    let px = ((p.mass - other.mass) * p.v.x) / totalMass + (other.mass * 2 * other.v.x) / totalMass
    let ox = ((p.mass - other.mass) * other.v.x) / totalMass + (other.mass * 2 * p.v.x) / totalMass

    p.v.x = px * 0.98 // add a bit damping, to avoid acceleration issue
    other.v.x = ox * 0.98

    p.v = rotate2D(p.v, -angle)
    other.v = rotate2D(other.v, -angle)
    p.updated = other.updated = true
  }
}

function isCollided(p1: Partical, p2: Partical) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y) <= p1.radius + p2.radius
}
