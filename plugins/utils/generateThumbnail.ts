import { Option, Thumbnail } from '../types';
import { getThumbnailImage, getColumnThumbnail } from './subfunc';
import { DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL_IMAGES_DEFAULT } from '../constance/index'

function generateThumbnail(event: any, video: HTMLVideoElement, options: Option): void {
  const seekBar: HTMLCollection = document.getElementsByClassName('shaka-seek-bar')
  const thumbnails = options.thumbnails as Array<Thumbnail>
  for (let i: number = 0; i < seekBar.length; i++) {
    if (seekBar[i] instanceof HTMLElement) {
      const sb = (seekBar[i] as HTMLElement)
      const rect: ClientRect = video.getBoundingClientRect()
      
      // Margin left of Video tag and window
      const marginLeftVideoAndWindow = rect.left
      // Because the seekBar is the center of the video
      // Margin between video and the progess bar
      const marginVideoAndProgressBar = (video.offsetWidth - sb.offsetWidth) / 2
      // Your real event on the progress bar
      let myEvent = event.clientX - marginLeftVideoAndWindow - marginVideoAndProgressBar
      // Start position of the progress bar
      const startPositionOfProgressBar = marginLeftVideoAndWindow + marginVideoAndProgressBar

      const thumbIndex: number = thumbnails.findIndex(tm => (event.clientX - startPositionOfProgressBar - sb.offsetWidth * (tm.endTime ? tm.endTime : video.duration) / video.duration) < 0)
      const thumbValue: Thumbnail = thumbnails[thumbIndex]
      
      if(thumbValue && thumbIndex !== null) {
        const thumbnailPixel: number = sb.offsetWidth / (video.duration / thumbValue.displayTime)

        const thumbnail = getThumbnailImage(thumbIndex)

        if(thumbnail) {
          if (myEvent < 0) {
            myEvent = 0
          }

          if (myEvent > (sb.offsetWidth - marginVideoAndProgressBar)) {
            myEvent = sb.offsetWidth - marginVideoAndProgressBar
          }
          const row: number = Math.floor((myEvent / thumbnailPixel) % thumbValue.row)
          let column: number = Math.floor(myEvent / (thumbValue.row * thumbnailPixel))

          if(getColumnThumbnail(thumbIndex, thumbnails) !== -1) {
            if(column >= getColumnThumbnail(thumbIndex, thumbnails)) {
              column = column - getColumnThumbnail(thumbIndex, thumbnails) + 1
            }
          }
          
          thumbnail.style.display = 'block'
          sb.style.cursor = 'pointer'
          thumbnail.style.left =
            event.clientX -
            thumbnail.clientWidth / thumbValue.row +
            80 -
            marginLeftVideoAndWindow -
            thumbValue.width * row +
            'px'

          thumbnail.style.top = rect.height - DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL_IMAGES_DEFAULT - thumbValue.height * column + 'px'
          console.log(`rect(${thumbValue.height * column}px, ${thumbValue.width *
            (row + 1)}px, ${thumbValue.height * (column + 1)}px, ${thumbValue.width * row}px)`)
          thumbnail.style.clip = `rect(${thumbValue.height * column}px, ${thumbValue.width *
            (row + 1)}px, ${thumbValue.height * (column + 1)}px, ${thumbValue.width * row}px)`
        }
      }
    }
  }
}

export default generateThumbnail