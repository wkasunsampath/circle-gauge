import type { Point } from '../types/types'
import { DEGREES_FOR_PERIGON } from './constants'

export const convertAngleToRadians = (angleInDegrees: number) => {
  return (Math.PI / (DEGREES_FOR_PERIGON / 2)) * angleInDegrees
}

export const getPointOnCircleFromAngle = (
  angleInDegrees: number,
  focus: Point,
  radius: number
): Point => {
  const realAngle = angleInDegrees % DEGREES_FOR_PERIGON
  let x = focus.x
  let y = focus.y
  if (realAngle <= DEGREES_FOR_PERIGON / 4) {
    x += Math.cos(convertAngleToRadians(realAngle)) * radius
    y += Math.sin(convertAngleToRadians(realAngle)) * radius
  } else if (realAngle <= DEGREES_FOR_PERIGON / 2) {
    x -= Math.cos(convertAngleToRadians(DEGREES_FOR_PERIGON / 2 - realAngle)) * radius
    y += Math.sin(convertAngleToRadians(DEGREES_FOR_PERIGON / 2 - realAngle)) * radius
  } else if (realAngle <= (3 * DEGREES_FOR_PERIGON) / 4) {
    x -= Math.cos(convertAngleToRadians(realAngle - DEGREES_FOR_PERIGON / 2)) * radius
    y -= Math.sin(convertAngleToRadians(realAngle - DEGREES_FOR_PERIGON / 2)) * radius
  } else {
    x += Math.cos(convertAngleToRadians(DEGREES_FOR_PERIGON - realAngle)) * radius
    y -= Math.sin(convertAngleToRadians(DEGREES_FOR_PERIGON - realAngle)) * radius
  }
  return { x, y }
}
