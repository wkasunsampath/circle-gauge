import type { Point } from '../types/types'
import { DEGREES_FOR_PERIGON, RIGHT_ANGLE_IN_DEGREES } from './constants'

export const formatNumber = (number: number) => {
  return Number(number).toLocaleString('en', {
    minimumFractionDigits: 2
  })
}

export const convertAngleToRadians = (angleInDegrees: number) => {
  return (Math.PI / (DEGREES_FOR_PERIGON / 2)) * angleInDegrees
}

export const getPointFromGivenDistance = (angleInDegrees: number, point: Point, distance: number): Point => {
  const realAngle = angleInDegrees % DEGREES_FOR_PERIGON
  let x = point.x
  let y = point.y
  if (realAngle <= RIGHT_ANGLE_IN_DEGREES) {
    const angle = convertAngleToRadians(realAngle)
    x += Math.cos(angle) * distance
    y += Math.sin(angle) * distance
  } else if (realAngle <= DEGREES_FOR_PERIGON / 2) {
    const angle = convertAngleToRadians(DEGREES_FOR_PERIGON / 2 - realAngle)
    x -= Math.cos(angle) * distance
    y += Math.sin(angle) * distance
  } else if (realAngle <= (3 * DEGREES_FOR_PERIGON) / 4) {
    const angle = convertAngleToRadians(realAngle - DEGREES_FOR_PERIGON / 2)
    x -= Math.cos(angle) * distance
    y -= Math.sin(angle) * distance
  } else {
    const angle = convertAngleToRadians(DEGREES_FOR_PERIGON - realAngle)
    x += Math.cos(angle) * distance
    y -= Math.sin(angle) * distance
  }
  return { x, y }
}

export const getAngleInDegreesForUnitOfScale = (
  startingAngleInDegrees: number,
  endingAngleInDegrees: number,
  scaleStart: number,
  scaleEnd: number
): number => {
  return (endingAngleInDegrees - startingAngleInDegrees) / (scaleEnd - scaleStart)
}
