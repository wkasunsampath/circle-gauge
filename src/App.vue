<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasEl" :height="size" :width="size"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Point } from './types/types'
import {
  convertAngleToRadians,
  formatNumber,
  getAngleInDegreesForUnitOfScale,
  getPointFromGivenDistance
} from './utils/math'
import type { IntervalItem } from './types/interfaces'
import { DEGREES_FOR_PERIGON, RIGHT_ANGLE_IN_DEGREES } from './utils/constants'

const canvasEl = ref<HTMLCanvasElement>()
const data = ref<IntervalItem[]>([
  { value: 0, color: '#E1CA46' },
  { value: 20, color: '#E1CA46' },
  { value: 50, color: '#75C952' },
  { value: 60, color: '#75C952' },
  { value: 100, color: '#469ED5' }
])
const size = ref(350) //For height and width of the canvas, this value is used.
const scaleThickness = ref(70)
const gaugeThickness = ref(35)
const startingAngleInDegrees = ref(165)
const endingAngleInDegrees = ref(375)
const indicatorValue = ref(60)

onMounted(() => {
  const ctx = get2DContext()
  if (ctx) {
    const focus = getFocusCoordinate()
    const radius = getRadius()
    const angleForScaleUnit = getAngleInDegreesForUnitOfScale(
      startingAngleInDegrees.value,
      endingAngleInDegrees.value,
      0,
      100
    )
    drawScale(ctx, focus, radius, angleForScaleUnit)
    drawGradient(ctx, focus, radius)
    drawIndicator(ctx, focus, radius, angleForScaleUnit)
    drawIndicatorValue(ctx, focus, radius)
  }
})

const drawGradient = (ctx: CanvasRenderingContext2D, focus: Point, radius: number) => {
  const startPoint = getPointFromGivenDistance(startingAngleInDegrees.value, focus, radius)
  const endPoint = getPointFromGivenDistance(endingAngleInDegrees.value, focus, radius)
  let gradient = ctx.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
  addGradientColorStops(gradient)
  ctx.beginPath()
  ctx.strokeStyle = gradient
  ctx.arc(
    focus.x,
    focus.y,
    radius,
    convertAngleToRadians(startingAngleInDegrees.value),
    convertAngleToRadians(endingAngleInDegrees.value)
  )
  ctx.lineWidth = gaugeThickness.value
  ctx.stroke()
  ctx.closePath()
}

const drawScale = (ctx: CanvasRenderingContext2D, focus: Point, radius: number, angleForScaleUnit: number) => {
  const scaleRadius = radius + gaugeThickness.value * 0.8
  data.value.forEach((item) => {
    const point = getPointFromGivenDistance(
      startingAngleInDegrees.value + angleForScaleUnit * item.value,
      focus,
      scaleRadius
    )
    ctx.font = '10px serif'
    ctx.textAlign = getTextAlignmentByAngle(startingAngleInDegrees.value + angleForScaleUnit * item.value)
    ctx.strokeText(formatNumber(item.value), point.x, point.y)
  })
}

const drawIndicator = (ctx: CanvasRenderingContext2D, focus: Point, radius: number, angleForScaleUnit: number) => {
  const scaleRadius = radius + gaugeThickness.value * 0.5
  const indicatorAngle = startingAngleInDegrees.value + angleForScaleUnit * indicatorValue.value
  ctx.beginPath()
  const pointOne = getPointFromGivenDistance(indicatorAngle, focus, scaleRadius)
  ctx.moveTo(pointOne.x, pointOne.y)
  const pointTwo = getPointFromGivenDistance(indicatorAngle + RIGHT_ANGLE_IN_DEGREES, focus, 5)
  ctx.lineTo(pointTwo.x, pointTwo.y)
  const pointThree = getPointFromGivenDistance(indicatorAngle - RIGHT_ANGLE_IN_DEGREES, focus, 5)
  ctx.lineTo(pointThree.x, pointThree.y)
  ctx.fill()
}

const drawIndicatorValue = (ctx: CanvasRenderingContext2D, focus: Point, radius: number) => {
  //Draw white background
  ctx.beginPath()
  ctx.arc(focus.x, focus.y, radius / 2.5, 0, 2 * Math.PI)
  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'white'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  //Print indicator value
  ctx.font = 'bold 25px serif'
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.fillText(formatNumber(indicatorValue.value), focus.x, focus.y)
}

const get2DContext = (): CanvasRenderingContext2D | undefined => {
  if (canvasEl.value) {
    return canvasEl.value.getContext('2d') as CanvasRenderingContext2D
  }
}

const getFocusCoordinate = (): Point => {
  return { x: size.value / 2, y: size.value / 2 }
}

const getRadius = () => {
  return (size.value - gaugeThickness.value - scaleThickness.value) / 2
}

const addGradientColorStops = (gradient: CanvasGradient): CanvasGradient => {
  for (const intervalItem of data.value) {
    gradient.addColorStop(intervalItem.value / 100, intervalItem.color)
  }
  return gradient
}

const getTextAlignmentByAngle = (angleInDegrees: number) => {
  const realAngle = angleInDegrees % DEGREES_FOR_PERIGON
  if (realAngle <= RIGHT_ANGLE_IN_DEGREES / 2) {
    return 'left'
  } else if (realAngle <= RIGHT_ANGLE_IN_DEGREES * 1.5) {
    return 'center'
  } else if (realAngle <= RIGHT_ANGLE_IN_DEGREES * 2.5) {
    return 'right'
  } else if (realAngle <= RIGHT_ANGLE_IN_DEGREES * 3.5) {
    return 'center'
  } else {
    return 'left'
  }
}
</script>

<style scoped lang="scss">
.canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 99vh;
}
</style>
