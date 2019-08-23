import { randomInt, random } from '@drewxiu/utils'
import { Sprites } from './utils/common'

interface Config {
  x: number
  y: number
  radius?: number
  amount?: number
  sprites?: string[]
}

const defaultConfig: Readonly<Required<Omit<Config, 'x' | 'y'>>> = {
  sprites: Sprites,
  radius: 100,
  amount: 100,
}

const render = (particles, ctx, width, height, count = { count: 0 }) => {
  if (count.count > 100) {
    return
  }
  count.count += 1
  requestAnimationFrame(() => render(particles, ctx, width, height, count))
  ctx.clearRect(0, 0, width, height)
  particles.forEach(p => {
    p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180)
    p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180)
    p.opacity -= 0.02
    p.speed *= p.friction
    p.yVel += p.gravity
    p.y += p.yVel
    if (p.opacity < 0) return
    ctx.globalAlpha = p.opacity
    ctx.font = `${width / 20}px serif`
    ctx.fillText(p.icon, p.x, p.y)
  })
  return ctx
}

export function explode(config: Config) {
  let { x, y, radius, sprites, amount } = { ...defaultConfig, ...config }
  let icon = sprites[(Math.random() * sprites.length) | 0]
  let particles = new Array<any>(amount)
  let canvas = document.createElement('canvas')
  let width = radius * 2
  let height = radius * 3.5
  canvas.width = width
  canvas.height = height
  let ctx = canvas.getContext('2d')
  canvas.style.position = 'absolute'
  canvas.style.left = x - width / 2 + 'px'
  canvas.style.top = y - height / 4 + 'px'
  canvas.style.pointerEvents = 'none'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.style.zIndex = '100'
  document.body.appendChild(canvas)
  for (let i = 0; i < amount; i++) {
    particles[i] = {
      x: canvas.width / 2,
      y: canvas.height / 4,
      rotation: randomInt(0, 360),
      speed: randomInt(3, 6) * (radius / 100),
      friction: 0.93,
      opacity: random(0.6, 1),
      yVel: 0,
      gravity: 0.25,
      icon,
    }
  }
  render(particles, ctx, canvas.width, canvas.height)
  setTimeout(() => {
    document.body.removeChild(canvas)
  }, 4000)
}
