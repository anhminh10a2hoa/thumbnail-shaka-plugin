import { Option } from './types'
import generateThumbnail from './utils/generateThumbnail'
import removeThumbnailImage from './utils/removeThumbnailImage'

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
          seekBar[i].addEventListener('mousemove', this.mouseEnter.bind(this))
          seekBar[i].addEventListener('mouseleave', this.mouseLeave.bind(this))
          seekBar[i].addEventListener('touchmove', this.mouseEnter.bind(this))
          seekBar[i].addEventListener('touchend', this.mouseLeave.bind(this))
          seekBar[i].addEventListener('touchcancel', this.mouseLeave.bind(this))
        }
      }
    }
  }

  mouseEnter(event: any) {
    generateThumbnail(event, this.video, this.options)
  }

  mouseLeave() {
    removeThumbnailImage(this.options)
  }
}

export default ShakaPlugin