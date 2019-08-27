import { sample, random, TAU } from '@drewxiu/utils'
import { Colors } from './utils/common'

interface Partical {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  radius: number
  originalRadius: Readonly<number>
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

export function movingDots({
  container = document.body,
  amount = 100,
  colors = Colors,
  width,
  height,
  mouseEffect = false,
  mouseEffectRange = 50,
  mouseEffectMaxRadius = 70,
}: Config = {}) {
  let frameId, mousePos
  let ratio = window.devicePixelRatio
  width = width || container.offsetWidth
  height = height || container.offsetHeight
  mouseEffectRange *= ratio
  mouseEffectMaxRadius *= ratio
  let mouseEffectStep = mouseEffectMaxRadius / 30
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')!
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  let particles = new Array<Partical>(amount)
  for (let i = 0; i < amount; i++) {
    let radius = random(5, 10) * ratio
    particles[i] = {
      x: random(width * ratio),
      y: random(height * ratio),
      vx: random(-3, 3) * ratio,
      vy: random(-3, 3) * ratio,
      color: sample(colors),
      radius,
      originalRadius: radius,
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
      // move
      p.x += p.vx
      p.y += p.vy
      if (p.x > canvas.width || p.x < 0) {
        p.vx *= random(-0.9, -1.1)
      }
      if (p.y > canvas.height || p.y < 0) {
        p.vy *= random(-0.9, -1.1)
      }
      if (mousePos) {
        if (Math.abs(p.x - mousePos.x) < mouseEffectRange && Math.abs(p.y - mousePos.y) < mouseEffectRange) {
          p.radius < mouseEffectMaxRadius && (p.radius += mouseEffectStep)
        } else {
          p.radius -= mouseEffectStep
          p.radius < p.originalRadius && (p.radius = p.originalRadius)
        }
      }
    })
    // next frame
    frameId = requestAnimationFrame(render)
  }

  function recordMousePos(evt) {
    mousePos.x = evt.offsetX * ratio
    mousePos.y = evt.offsetY * ratio
  }
  if (mouseEffect) {
    mousePos = { x: -1000, y: -1000 }
    canvas.addEventListener('mousemove', recordMousePos)
  }

  container.append(canvas)
  render()
  console.info('[Moving Dots]Inspired by <chriscourses.com>')

  return () => {
    cancelAnimationFrame(frameId)
    canvas.removeEventListener('mousemove', recordMousePos)
    canvas.remove()
  }
}
