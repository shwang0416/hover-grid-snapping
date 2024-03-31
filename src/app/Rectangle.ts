const BOUNDARY_BACKGROUND = `rgba(256, 0, 0, 0.5)`

export class Rectangle {
	positionX: number
	positionY: number
	width: number
	height: number
	imagePath?: string
	constructor({
		positionX,
		positionY,
		width,
		height,
		imagePath,
	}: {
		positionX: number
		positionY: number
		width: number
		height: number
		imagePath: string
	}) {
		this.positionX = positionX
		this.positionY = positionY
		this.width = width
		this.height = height
		this.imagePath = imagePath
	}

	drawBoundary(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = BOUNDARY_BACKGROUND // 사각형 색상
		ctx.fillRect(this.positionX, this.positionY, this.width, this.height) // 사각형 그리기
	}

	drawImage(ctx: CanvasRenderingContext2D) {
		if (!this.imagePath) throw new Error('no Img src')

		const img = new Image()
		img.onload = () => {
			ctx.drawImage(
				img,
				this.positionX,
				this.positionY,
				this.width,
				this.height
			) // 이미지 좌표 (0, 0)에 그리기
		}
		img.src = this.imagePath // 이미지 URL 설정
	}
}
