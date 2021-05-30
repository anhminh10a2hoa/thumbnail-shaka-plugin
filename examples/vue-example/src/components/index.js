class ShakaPlugin {
  constructor(video, options) {
    this.video = video
    this.options = options
  }

  initialize() {
    const seekBar = document.getElementsByClassName('shaka-seek-bar')
    if(this.video && this.video.duration && seekBar) {
      // for(let [index, value] of this.options.thumbnails.entries()) {
      //   let thumbnail = document.createElement('img')
      //   thumbnail.originalHeight = thumbnail.clientHeight
      //   thumbnail.id = 'thumbnail-' + index
      //   thumbnail.src = value.src
      //   thumbnail.className = 'shaka-thumbnail-' + index
      //   thumbnail.style.position = 'absolute'
      //   thumbnail.style.display = 'none'
      //   if(this.video.parentNode) {
      //     this.video.parentNode.appendChild(thumbnail)
      //   } else {
      //     const parent = document.body
      //     parent.appendChild(thumbnail)
      //   }
      // }
     
      for (let i = 0; i < seekBar.length; i++) {
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

  mouseEnter(event) {
    
    const seekBar = document.getElementsByClassName('shaka-seek-bar')
    for (let i = 0; i < seekBar.length; i++) {
      if (seekBar[i] instanceof HTMLElement) {
        const rect = this.video.getBoundingClientRect()
        
        // Margin left of Video tag and window
        const mlv = rect.left
        // Because the seekBar is the center of the video
        // Margin between video and the progess bar
        const mbvs = (this.video.offsetWidth - seekBar[i].offsetWidth) / 2
        // Your real event on the progress bar
        let myEvent = event.clientX - mlv - mbvs


        // console.log(myEvent)
        // console.log(seekBar[i].offsetWidth)

        if (myEvent < 0) {
          myEvent = 0
        }

        // if (myEvent > seekBar[i].offsetWidth) {
        //   myEvent = seekBar[i].of 
        // }

        if(this.video.duration <= 0) {
          return '00:00'
        } else if(this.video.duration < 60) {
          console.log(Math.floor(myEvent / seekBar[i].offsetWidth * 60))
          return `00:${Math.floor(myEvent / seekBar[i].offsetWidth * 60)}`
        } else if(this.video.duration < 3600) {
          console.log(`${Math.floor((this.video.duration / seekBar[i].offsetWidth * myEvent) / 60)}:${Math.floor((this.video.duration / seekBar[i].offsetWidth * myEvent) % 60)}`)
          return `${Math.floor((seekBar[i].offsetWidth / myEvent) % 60)}:${Math.floor(myEvent / seekBar[i].offsetWidth * 60)}`
        }

        // Start position of the progress bar
        const sppb = mlv + mbvs

        const tmv = this.options.thumbnails.filter(tm => (event.clientX - sppb - seekBar[i].offsetWidth * (tm.endTime ? tm.endTime : this.video.duration) / this.video.duration) < 0)[0]
        const tmi = this.options.thumbnails.findIndex(tm => (event.clientX - sppb - seekBar[i].offsetWidth * (tm.endTime ? tm.endTime : this.video.duration) / this.video.duration) < 0)

        if(tmv && tmi !== null) {
          const thumbnailPixel = seekBar[i].offsetWidth / (this.video.duration / tmv.displayTime)

          if (myEvent < 0) {
            myEvent = 0
          }

          if (myEvent > (seekBar[i].offsetWidth - mbvs)) {
            myEvent = seekBar[i].offsetWidth - mbvs
          }

          let tmiTemp = null
          if(tmv !== tmiTemp) {
            tmiTemp = tmi
          }
          const thumbnailEl = document.getElementsByClassName('shaka-thumbnail')
          for(let i = 0; i < thumbnailEl.length; i++) {
            thumbnailEl[i].remove()
          }

          seekBar[i].style.cursor = 'pointer'
          let thumbnail = document.createElement('img')
          thumbnail.originalHeight = thumbnail.clientHeight
          thumbnail.id = 'shaka-thumbnail'
          thumbnail.src = tmv.src
          thumbnail.className = 'shaka-thumbnail'
          thumbnail.style.position = 'absolute'

          const row = Math.floor((myEvent / thumbnailPixel) % tmv.row)
          let column = Math.floor(myEvent / (tmv.row * thumbnailPixel))

          if(column >= 7) {
            column = column - 7
          }

          thumbnail.style.left =
            event.clientX -
            thumbnail.clientWidth / tmv.row +
            80 - 150 -
            mlv -
            tmv.width * row +
            'px'

          thumbnail.style.top = rect.height - 150 - tmv.height * column + 'px'
          thumbnail.style.clip = `rect(${tmv.height * column}px, ${tmv.width *
            (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`

          document.body.style.overflow = 'hidden'

          if(this.video.parentNode) {
            this.video.parentNode.appendChild(thumbnail)
          } else {
            const parent = document.body
            parent.appendChild(thumbnail)
          }
        }
      }
    }
  }

  mouseLeave() {
    const thumbnail = document.getElementsByClassName('shaka-thumbnail')
    for(let i = 0; i < thumbnail.length; i++) {
      thumbnail[i].remove()
    }
  }

  getColumnThumbnail(index) {
    if(index > 0) {
      const thumbnail = document.getElementById('shaka-thumbnail')
      return Math.round(thumbnail.clientHeight / this.options.thumbnails[index - 1].height)
    }
  }

  // getThumbnailByColumn(column) {

  // }
}

module.exports = ShakaPlugin;
