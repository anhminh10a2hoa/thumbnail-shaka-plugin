import { Option, Thumbnail } from './types'
import { DBPT } from './constance'

class ShakaPlugin {
  private options: Option
  public video: HTMLVideoElement

  constructor(video: HTMLVideoElement, options: Option) {
    this.video = video
    this.options = options
  }

  initialize() {
    const seekBar: HTMLCollection = document.getElementsByClassName('shaka-seek-bar')
    if(this.video && this.video.duration && seekBar) {
      for(let [index, value] of this.options.thumbnails.entries()) {
        let thumbnail: HTMLImageElement = document.createElement('img')
        thumbnail.id = 'thumbnail-' + index
        thumbnail.src = value.src
        thumbnail.className = 'shaka-thumbnail-' + index
        thumbnail.style.position = 'absolute'
        thumbnail.style.display = 'none'
        if(this.video.parentNode) {
          this.video.parentNode.appendChild(thumbnail)
        } else {
          const parent = document.body
          parent.appendChild(thumbnail)
        }
      }
     
      for (let i: number = 0; i < seekBar.length; i++) {
        if (seekBar[i] instanceof HTMLElement) {
          seekBar[i].addEventListener('mousemove', this.mouseEnter)
          seekBar[i].addEventListener('mouseleave', this.mouseLeave)
          seekBar[i].addEventListener('touchmove', this.mouseEnter)
          seekBar[i].addEventListener('touchend', this.mouseLeave)
          seekBar[i].addEventListener('touchcancel', this.mouseLeave)
        }
      }
    }
  }

  mouseEnter(event: any) {
    const seekBar: HTMLCollection = document.getElementsByClassName('shaka-seek-bar')
    for (let i: number = 0; i < seekBar.length; i++) {
      if (seekBar[i] instanceof HTMLElement) {
        const sb = (seekBar[i] as HTMLElement)
        const rect: ClientRect = this.video.getBoundingClientRect()
        
        // Margin left of Video tag and window
        const mlv = rect.left
        // Because the seekBar is the center of the video
        // Margin between video and the progess bar
        const mbvs = (this.video.offsetWidth - sb.offsetWidth) / 2
        // Your real event on the progress bar
        let myEvent = event.clientX - mlv - mbvs
        // Start position of the progress bar
        const sppb = mlv + mbvs

        const tmv: Thumbnail = this.options.thumbnails.filter(tm => (event.clientX - sppb - sb.offsetWidth * (tm.endTime ? tm.endTime : this.video.duration) / this.video.duration) < 0)[0]
        const tmi: number = this.options.thumbnails.findIndex(tm => (event.clientX - sppb - sb.offsetWidth * (tm.endTime ? tm.endTime : this.video.duration) / this.video.duration) < 0)

        if(tmv && tmi !== null) {
          const thumbnailPixel: number = sb.offsetWidth / (this.video.duration / tmv.displayTime)

          const thumbnail = this.getThumbnailImage(tmi)

          if(thumbnail) {
            if (myEvent < 0) {
              myEvent = 0
            }
  
            if (myEvent > (sb.offsetWidth - mbvs)) {
              myEvent = sb.offsetWidth - mbvs
            }
            const row: number = Math.floor((myEvent / thumbnailPixel) % tmv.row)
            let column: number = Math.floor(myEvent / (tmv.row * thumbnailPixel))
  
            if(this.getColumnThumbnail(tmi) !== -1) {
              if(column >= this.getColumnThumbnail(tmi)) {
                column = column - this.getColumnThumbnail(tmi) + 1
              }
            }
            
            thumbnail.style.display = 'block'
            sb.style.cursor = 'pointer'
            thumbnail.style.left =
              event.clientX -
              thumbnail.clientWidth / tmv.row +
              80 -
              mlv -
              tmv.width * row +
              'px'
  
            thumbnail.style.top = rect.height - DBPT - tmv.height * column + 'px'
            console.log(`rect(${tmv.height * column}px, ${tmv.width *
              (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`)
            thumbnail.style.clip = `rect(${tmv.height * column}px, ${tmv.width *
              (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`
          }
        }
      }
    }
  }

  mouseLeave() {
    for(let i: number = 0; i < this.options.thumbnails.length; i++) {
      const thumbnail = this.getThumbnailImage(i)
      if (thumbnail) {
        thumbnail.style.display = 'none'
      }
    }
  }

  getColumnThumbnail(index: number) {
    if(index > 0) {
      const thumbnail = this.getThumbnailImage(index - 1)
      if(thumbnail) {
        return Math.round(thumbnail.clientHeight / this.options.thumbnails[index - 1].height)
      }
    }
    return -1
  }

  getThumbnailImage(index: number): HTMLElement | null {
    return document.getElementById('thumbnail-' + index)
  }
}

export = ShakaPlugin