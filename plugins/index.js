function initialize(video) {
  const seekBar = document.getElementsByClassName('shaka-seek-bar')
  if(video && video.duration && seekBar) {
    for(let [index, value] of options.thumbnails.entries()) {
      let thumbnail = document.createElement('img')
      thumbnail.id = 'thumbnail-' + index
      thumbnail.src = value.src
      thumbnail.className = 'shaka-thumbnail-' + index
      thumbnail.style.position = 'absolute'
      thumbnail.style.display = 'none'
      if(video.parentNode) {
        video.parentNode.appendChild(thumbnail)
      } else {
        const parent = document.body
        parent.appendChild(thumbnail)
      }
    }
    
    for (let i = 0; i < seekBar.length; i++) {
      seekBar[i].addEventListener('mousemove', mouseEnter(video))
      seekBar[i].addEventListener('mouseleave', mouseLeave)
      seekBar[i].addEventListener('touchmove', mouseEnter(video))
      seekBar[i].addEventListener('touchend', mouseLeave)
      seekBar[i].addEventListener('touchcancel', mouseLeave)
    }
  }
}

function mouseEnter(video, event) {
  const seekBar = document.getElementsByClassName('shaka-seek-bar');
  for (let i = 0; i < seekBar.length; i++) {
    if (seekBar[i] instanceof HTMLElement) {
      const sb = seekBar[i];
      const rect = video.getBoundingClientRect();
      // Margin left of Video tag and window
      const mlv = rect.left;
      // Because the seekBar is the center of the video
      // Margin between video and the progess bar
      const mbvs = (video.offsetWidth - sb.offsetWidth) / 2;
      // Your real event on the progress bar
      let myEvent = event.clientX - mlv - mbvs;
      // Start position of the progress bar
      const sppb = mlv + mbvs;
      const tmv = options.thumbnails.filter(tm => (event.clientX - sppb - sb.offsetWidth * (tm.endTime ? tm.endTime : video.duration) / video.duration) < 0)[0];
      const tmi = options.thumbnails.findIndex(tm => (event.clientX - sppb - sb.offsetWidth * (tm.endTime ? tm.endTime : video.duration) / video.duration) < 0);
      if (tmv && tmi !== null) {
        const thumbnailPixel = sb.offsetWidth / (video.duration / tmv.displayTime);
        const thumbnail = document.getElementById('thumbnail-' + tmi);
        if (thumbnail) {
          if (myEvent < 0) {
            myEvent = 0;
          }
          if (myEvent > (sb.offsetWidth - mbvs)) {
            myEvent = sb.offsetWidth - mbvs;
          }
          const row = Math.floor((myEvent / thumbnailPixel) % tmv.row);
          let column = Math.floor(myEvent / (tmv.row * thumbnailPixel));
          if (column >= 7) {
            column = column - 7;
          }
          thumbnail.style.display = 'block';
          sb.style.cursor = 'pointer';
          thumbnail.style.left =
            event.clientX -
            thumbnail.clientWidth / tmv.row +
            80 -
            mlv -
            tmv.width * row +
            'px';
          thumbnail.style.top = rect.height - 150 - tmv.height * column + 'px';
          console.log(`rect(${tmv.height * column}px, ${tmv.width *
            (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`);
          thumbnail.style.clip = `rect(${tmv.height * column}px, ${tmv.width *
            (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`;
        }
      }
    }
  }
}

function mouseLeave() {
  for(let i = 0; i < options.thumbnails.length; i++) {
    const thumbnail = document.getElementById('thumbnail-' + i)
    if (thumbnail) {
      thumbnail.style.display = 'none'
    }
  }
}

exports.initialize = initialize