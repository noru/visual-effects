export interface Vector2D {
  x: number
  y: number
}

export function rotate2D(v: Vector2D, angle: number): Vector2D {
  let { x, y } = v
  v.x = x * Math.cos(angle) - y * Math.sin(angle)
  v.y = x * Math.sin(angle) + y * Math.cos(angle)
  return v
}
