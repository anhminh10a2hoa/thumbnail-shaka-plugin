const manifestUri = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
let ShakaPlugin = require('../plugins/build/test.js')

const thumbnailImages = [
  {
    src: './assets/big-bunny-1-320-2-160-90.jpeg',
    width: 160,
    height: 90,
    row: 20,
    displayTime: 2,
    startTime: 0,
    endTime: 320
  },
  {
    src: './assets/big-bunny-2-276-2-160-90.jpeg',
    width: 160,
    height: 90,
    row: 20,
    displayTime: 2,
    startTime: 320,
  }
]

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
    document.addEventListener('shaka-ui-loaded', initPlayer);
    // Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
    // to load (e.g. due to lack of browser support).
    document.addEventListener('shaka-ui-load-failed', initFailed);
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // When using the UI, the player is made automatically by the UI object.
  const video = document.getElementById('video');
  const player = new shaka.Player(video)
  const ui = video.ui

  // Attach player and ui to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onPlayerErrorEvent);
  // controls.addEventListener('error', onUIErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (error) {
    onPlayerError(error);
  }

  let ShakaPlugin = new ShakaPlugin(video, thumbnailImages)
  ShakaPlugin.initialize()
}

// function mouseEnter(event) {
//   const video = document.getElementById('video')
//   const seekBar = document.getElementsByClassName('shaka-seek-bar')

//   const DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL = 150

//   var rect = video.getBoundingClientRect()
  
//   // Margin left of Video tag
//   const marginLeftBetweenWindowAndVideo = rect.left

//   // Because the seekBar is the center of the video 
//   const marginBetweenVideoAndSeekbar =
//     (video.offsetWidth - seekBar[0].offsetWidth) / 2
//   let realEvent =
//     event.clientX -
//     marginBetweenVideoAndSeekbar -
//     marginLeftBetweenWindowAndVideo

//   const startPositionOfProgressBar = marginLeftBetweenWindowAndVideo + marginBetweenVideoAndSeekbar

//   const tmv = thumbnailImages.filter(tm => (event.clientX - startPositionOfProgressBar - seekBar[0].offsetWidth * (tm.endTime ? tm.endTime : video.duration) / video.duration) < 0)[0]
//   const tmi = thumbnailImages.findIndex(tm => (event.clientX - startPositionOfProgressBar - seekBar[0].offsetWidth * (tm.endTime ? tm.endTime : video.duration) / video.duration) < 0)

//   if(tmv && tmi !== null) {
//     const thumbnailPixel = seekBar[0].offsetWidth / (video.duration / tmv.displayTime)

//     const thumbnail = document.getElementById('thumbnail-' + tmi)

//     if (realEvent < 0) {
//       realEvent = 0
//     }

//     if (realEvent > (seekBar[0].offsetWidth - marginBetweenVideoAndSeekbar)) {
//       realEvent = seekBar[0].offsetWidth - marginBetweenVideoAndSeekbar
//     }
//     const row = Math.floor((realEvent / thumbnailPixel) % tmv.row)
//     let column = Math.floor(realEvent / (tmv.row * thumbnailPixel))

//     for(let v of thumbnailImages) {
//       console.log(video.duration)
//     }
    
//     if(column >= 7) {
//       column = column - 7
//     }

//     thumbnail.style.display = 'block'
//     seekBar[0].style.cursor = 'pointer'
//     thumbnail.style.left =
//       event.clientX -
//       thumbnail.clientWidth / tmv.row +
//       80 -
//       marginLeftBetweenWindowAndVideo -
//       tmv.width * row +
//       'px'

//     thumbnail.style.top = rect.height - DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL - tmv.height * column + 'px'
//     console.log(`rect(${tmv.height * column}px, ${tmv.width *
//       (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`)
//     thumbnail.style.clip = `rect(${tmv.height * column}px, ${tmv.width *
//       (row + 1)}px, ${tmv.height * (column + 1)}px, ${tmv.width * row}px)`
//   }
// }

// function mouseLeave() {
//   for(i = 0; i < thumbnailImages.length; i++) {
//     const thumbnail = document.getElementById('thumbnail-' + i)
//     if (thumbnail) {
//       thumbnail.style.display = 'none'
//     }
//   }
// }

function onPlayerErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function onPlayerError(error) {
  // Handle player error
  console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function initFailed(event) {
  // Handle the failure to load; errorEvent.detail.reasonCode has a
  // shaka.ui.FailReasonCode describing why.
  console.error('Unable to load the UI library!');
}

document.addEventListener('DOMContentLoaded', initApp);