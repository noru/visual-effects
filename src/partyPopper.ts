import { random, randomBool, randomInt } from '@drewxiu/utils'
import { Colors } from './utils/common'

type Offset = [number, number]
type Shape = [Offset, Offset, Offset?]
interface Particle {
  x: number
  y: number
  xOffset: number
  yOffset: number
  angle: number
  speed: number
  opacity: number
  color: string
  shape: Shape
}

interface Config {
  container?: HTMLElement
  particleAmount?: number
  devicePixelRatio?: number
  speed?: number
  colors?: string[]
}
const defaultConfig: Required<Config> = {
  container: document.body,
  devicePixelRatio: window.devicePixelRatio,
  particleAmount: 300,
  speed: 20,
  colors: Colors,
}

const TotalFrames = 250

export function partyPopper(config: Config = defaultConfig) {
  let { container, particleAmount: particleAmount, colors, devicePixelRatio, speed } = Object.assign({}, defaultConfig, config)
  let canvas = document.createElement('canvas')
  let width = container.clientWidth || window.innerWidth
  let height = container.clientHeight || window.innerHeight
  let heightWidthRatio = height / width
  canvas.id = 've-party-popper-' + Date.now()
  canvas.width = width
  canvas.height = height
  canvas.style.position = 'absolute'
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '100'

  let ctx = canvas.getContext('2d')!
  let particlesLeft: Particle[] = new Array(particleAmount / 2)
  let particlesRight: Particle[] = new Array(particleAmount / 2)

  for (let i = 0; i < particleAmount / 2; i++) {
    particlesLeft[i] = {
      x: 0,
      y: canvas.height,
      xOffset: random(-2, 2) * devicePixelRatio,
      yOffset: random(-2, 0.5) * devicePixelRatio,
      speed: (speed + random(-5, 5)) * devicePixelRatio,
      opacity: 1,
      angle: 0,
      color: colors[randomInt(0, colors.length - 1)],
      shape: getRandomShape(devicePixelRatio),
    }
  }
  for (let i = 0; i < particleAmount / 2; i++) {
    particlesRight[i] = {
      x: canvas.width,
      y: canvas.height,
      xOffset: random(-2, 2) * devicePixelRatio,
      yOffset: random(-2, 0.5) * devicePixelRatio,
      speed: (speed + random(-5, 5)) * devicePixelRatio,
      opacity: 1,
      angle: 0,
      color: colors[randomInt(0, colors.length - 1)],
      shape: getRandomShape(devicePixelRatio),
    }
  }

  function render(count = { frame: 0 }) {
    if (count.frame > TotalFrames) return
    count.frame += 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let updated = false
    particlesLeft.forEach(p => {
      if (p.opacity < 0) {
        return
      }
      updated = true
      p.x += p.speed + p.xOffset
      p.y -= (p.speed + p.yOffset) * heightWidthRatio
      p.speed *= Math.pow(0.99, count.frame) // exponentially decrease the speed
      if (p.speed < 0.1) {
        fadeOut(p, devicePixelRatio)
      }
      paintSprite(ctx, p)
    })
    particlesRight.forEach(p => {
      if (p.opacity < 0) {
        return
      }
      updated = true
      p.x -= p.speed + p.xOffset
      p.y -= (p.speed + p.yOffset) * heightWidthRatio
      p.speed *= Math.pow(0.99, count.frame) // exponentially decrease the speed
      if (p.speed < 0.01) {
        fadeOut(p, devicePixelRatio)
      }
      paintSprite(ctx, p)
    })
    if (updated) {
      requestAnimationFrame(() => render(count))
    } else {
      canvas.remove()
    }
  }
  container.appendChild(canvas)
  return render
}

function fadeOut(p: Particle, ratio: number = 1) {
  p.opacity -= 0.005
  p.x += random(0, 1)
  p.y += random(0, 1) * ratio
  p.angle += random(0.1)
}

function getRandomShape(ratio: number = 1): Shape {
  return [
    [random(3, 6) * ratio, random(3, 6) * ratio],
    [random(-3, 3) * ratio, random(4, 7) * ratio],
    randomBool() ? [random(-6, -3) * ratio, random(3, 6) * ratio] : undefined,
  ]
}

function paintSprite(ctx, p: Particle) {
  if (p.opacity < 0 || p.y > ctx.width || p.x < 0 || p.y > ctx.width) {
    return
  }
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.angle)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(p.shape[0][0], p.shape[0][1])
  ctx.lineTo(p.shape[1][0], p.shape[1][1])
  p.shape[2] && ctx.lineTo(p.shape[2][0], p.shape[2][1])
  ctx.fillStyle = p.color
  ctx.globalAlpha = p.opacity
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
