let ratio = window.devicePixelRatio

let Outer = [
  [900, 800],
  [1900, 600],
  [1800, 1500],
  [1000, 1400],
]

let Inner = [
  [1200, 1000],
  [1700, 800],
  [1700, 1200],
  [1100, 1200],
]

function points2Segments(points): LineSegment[] {
  return points
    .map(([x, y]) => ({ x, y }))
    .reduce((prev, next, i, arr) => {
      let p2 = arr[i + 1] || arr[0]
      prev.push({ p1: next, p2 })
      return prev
    }, [] as LineSegment[])
}

const OuterSegments = points2Segments(Outer)
const InnerSegments = points2Segments(Inner)
let context

function drawPolygon(points, clear = false) {
  let [head, ...rest] = points
  context.fillStyle = clear ? 'rgb(237, 237, 236)' : 'rgba(127, 191, 63, 0.43)'
  context.beginPath()
  context.moveTo(...head)
  rest.forEach((p) => context.lineTo(...p))
  context.lineTo(...head)
  context.fill()
}

function draw(evt: MouseEvent) {
  if (!context) return
  let x = evt.clientX * ratio
  let y = evt.clientY * ratio

  let color = isPointInPolygon({ x, y }, [...OuterSegments, ...InnerSegments], { x: 0, y: 0 }) ? 'green' : 'red'
  context.beginPath()
  context.fillStyle = color
  context.arc(x, y, 10, 0, Math.PI * 2, true)
  context.fill()
}

export function inOutDetection() {
  let container = document.body
  let width = container.offsetWidth
  let height = container.offsetHeight

  let canvas = document.createElement('canvas')
  context = canvas.getContext('2d')!
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.background = 'transparent'
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  context.beginPath()
  context.moveTo(...Outer[0])

  drawPolygon(Outer)
  drawPolygon(Inner, true)
  canvas.addEventListener('mousemove', draw)

  container.append(canvas)
}

interface Point {
  x: number
  y: number
}

export interface LineSegment {
  p1: Point
  p2: Point
}

function Area(a: Point, b: Point, c: Point) {
  // determinant of {AB, AC}
  return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
}

function isOppositeSigns(a: number, b: number) {
  return (a ^ b) < 0
}

export function isIntersect(seg1: LineSegment, seg2: LineSegment) {
  return (
    isOppositeSigns(Area(seg1.p1, seg1.p2, seg2.p1), Area(seg1.p1, seg1.p2, seg2.p2)) &&
    isOppositeSigns(Area(seg2.p1, seg2.p2, seg1.p1), Area(seg2.p1, seg2.p2, seg1.p2))
  )
}

export function isPointInPolygon(p: Point, polygon: LineSegment[], farPoint: Point = { x: 160, y: 90 }) {
  let helperSeg = { p1: p, p2: farPoint }
  return (polygon.filter((seg) => isIntersect(seg, helperSeg)).length & 1) > 0
}
