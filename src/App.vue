<template>
  <div class="canvas-wrapper">
    <canvas ref="canvasEl" :height="size" :width="size"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Point } from './types/types'
import { convertAngleToRadians, getPointOnCircleFromAngle } from './utils/math'
import type { IntervalItem } from './types/interfaces'

const canvasEl = ref<HTMLCanvasElement>()
const data = ref<IntervalItem[]>([
  { value: 0, color: '#E1CA46' },
  { value: 50, color: '#75C952' },
  { value: 100, color: '#469ED5' }
])
const size = ref(300) //For height and width of the canvas, this value is used.
const gaugeThickness = ref(35)
const startingAngleInDegrees = ref(165)
const endingAngleInDegrees = ref(375)

onMounted(() => {
  const ctx = get2DContext()
  if (ctx) {
    const focus = getFocusCoordinate()
    const radius = getRadius()
    const startPoint = getPointOnCircleFromAngle(startingAngleInDegrees.value, focus, radius)
    const endPoint = getPointOnCircleFromAngle(endingAngleInDegrees.value, focus, radius)
    let gradient = ctx.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
    gradient = addGradientColorStops(gradient)
    ctx.beginPath()
    ctx.lineCap = 'butt'
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
})

const get2DContext = (): CanvasRenderingContext2D | undefined => {
  if (canvasEl.value) {
    return canvasEl.value.getContext('2d') as CanvasRenderingContext2D
  }
}

const getFocusCoordinate = (): Point => {
  return { x: size.value / 2, y: size.value / 2 }
}

const getRadius = () => {
  return (size.value - gaugeThickness.value) / 2
}

const addGradientColorStops = (gradient: CanvasGradient): CanvasGradient => {
  for (const intervalItem of data.value) {
    gradient.addColorStop(intervalItem.value / 100, intervalItem.color)
  }
  return gradient
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
