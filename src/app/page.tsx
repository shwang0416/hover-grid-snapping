'use client'

import { useRef, useEffect, useState } from 'react'
import RectSizeInput from './RectSizeInput'
import { Rectangle } from './Rectangle'
/**
    - 테이블 사이즈 선택 -> 배치 모드 실행
    - 배치 모드에서는 호버시 해당 사이즈만큼의 영역이 마우스를 따라다님
    - 클릭 시 해당 위치에 배치된다. 
  **/
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800

const CELL_SPACING = 40
const imagePath = 'image/ham.png'
const GRID_COLOR = 'gray'
const BOUNDARY_BACKGROUND = `rgba(256, 0, 0, 0.5)`
const dummies = [
	{ positionX: 0, positionY: 0, width: 80, height: 80, imagePath: imagePath },
	{
		positionX: 240,
		positionY: 240,
		width: 40,
		height: 40,
		imagePath: imagePath,
	},
]

export default function Home() {
	const [isEditMode, setIsEditMode] = useState(false)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [rectSize, setRectSize] = useState({
		width: 0,
		height: 0,
	})
	const [rects, setRects] = useState<Rectangle[]>(
		dummies.map((d) => new Rectangle(d))
	)
	const [rectangleX, setRectangleX] = useState<number>(175) // 사각형 x 좌표
	const [rectangleY, setRectangleY] = useState<number>(175) // 사각형 y 좌표

	const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isEditMode) return

		const canvas = canvasRef.current
		if (canvas) {
			const rect = canvas.getBoundingClientRect()
			const mouseX = event.clientX - rect.left
			const mouseY = event.clientY - rect.top

			const gridSnappedX = getGridSnapped(
				mouseX - rectSize.width / 2,
				CELL_SPACING
			)
			const gridSnappedY = getGridSnapped(
				mouseY - rectSize.width / 2,
				CELL_SPACING
			)

			setRectangleX(gridSnappedX)
			setRectangleY(gridSnappedY)
		}
	}

	const onMouseDownHandler = () => {
		console.log('onMouseDownHandler')
		/**
		 * 편집모드라면
		 * - 현재 포지션을 저장, 편집모드 해제
		 */
		setRects((rects) => [
			...rects,
			new Rectangle({
				positionX: rectangleX,
				positionY: rectangleY,
				width: rectSize.width,
				height: rectSize.height,
				imagePath: imagePath,
			}),
		])

		setRectangleX(0)
		setRectangleY(0)
		setRectSize({
			width: 0,
			height: 0,
		})
		setIsEditMode(false)
	}

	const drawImage = (ctx: CanvasRenderingContext2D) => {
		const img = new Image()
		img.onload = function () {
			ctx.drawImage(
				img,
				rectangleX,
				rectangleY,
				rectSize.width,
				rectSize.height
			) // 이미지 좌표 (0, 0)에 그리기
		}
		img.src = imagePath // 이미지 URL 설정
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		if (isEditMode) return
		drawImage(ctx)
	}, [isEditMode])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		// 캔버스 크기 설정
		canvas.width = CANVAS_WIDTH
		canvas.height = CANVAS_HEIGHT

		const drawGrid = () => {
			// 격자 무늬 그리기 함수 호출
			const gridSize = CELL_SPACING
			const gridColor = GRID_COLOR

			ctx.beginPath()
			ctx.strokeStyle = gridColor

			// 수직선 그리기
			for (let x = 0; x <= canvas.width; x += gridSize) {
				ctx.moveTo(x, 0)
				ctx.lineTo(x, canvas.height)
			}

			// 수평선 그리기
			for (let y = 0; y <= canvas.height; y += gridSize) {
				ctx.moveTo(0, y)
				ctx.lineTo(canvas.width, y)
			}

			ctx.stroke()
		}
		// 새로운 사각형 그리기 함수
		const drawRectangle = () => {
			// ctx.clearRect(0, 0, canvas.width, canvas.height) // 이전 프레임 지우기
			ctx.fillStyle = BOUNDARY_BACKGROUND // 사각형 색상
			ctx.fillRect(
				rectangleX,
				rectangleY,
				rectSize.width,
				rectSize.height
			) // 사각형 그리기
		}

		drawGrid()
		drawRectangle()
		rects.map((r) => r.drawImage(ctx))
	}, [canvasRef, rectangleX, rectangleY]) // 이펙트는 한 번만 실행되어야 함

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<RectSizeInput
				updateRectSize={setRectSize}
				updateIsEditMode={setIsEditMode}
			/>
			<canvas
				ref={canvasRef}
				onMouseMove={handleMouseMove}
				onMouseDown={onMouseDownHandler}
			/>
		</main>
	)
}

const getGridSnapped = (position: number, spacing: number) =>
	Math.round(position / spacing) * spacing
