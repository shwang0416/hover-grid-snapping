import { useState } from 'react'

type RectSize = {
	width: number
	height: number
}

type RectSizeInputProps = {
	updateRectSize: (rectSize: RectSize) => void
	updateIsEditMode: (isEditMode: boolean) => void
}

const RectSizeInput = ({
	updateRectSize,
	updateIsEditMode,
}: RectSizeInputProps) => {
	const [showInput, setShowInput] = useState(false)
	const onSubmitHandler = (formData: FormData) => {
		const width = formData.get('width') as string
		const height = formData.get('height') as string

		if (!width || !height) {
			alert('값이 없습니다')
			return
		}

		updateRectSize({ width: parseInt(width), height: parseInt(height) })
		updateIsEditMode(true)
	}

	return (
		<div>
			{!showInput && (
				<button onClick={() => setShowInput(true)}>테이블 추가</button>
			)}
			{showInput && (
				<form className='flex flex-col' action={onSubmitHandler}>
					<label htmlFor='width' className=''>
						width
					</label>
					<input name='width' type='text'></input>
					<label htmlFor='height' className=''>
						height
					</label>
					<input name='height' type='text'></input>
					<button type='submit'>submit</button>
				</form>
			)}
		</div>
	)
}

export default RectSizeInput
