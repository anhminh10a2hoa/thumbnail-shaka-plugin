const manifestUri = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

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

  // Thumbnail
  const seekBar = document.getElementsByClassName('shaka-seek-bar')
  if(video && video.duration && player && seekBar) {
    let thumbnail = document.createElement('img')
    thumbnail.id = 'thumbnail'
    thumbnail.src= './assets/big-bunny-1-320-2-160-90.jpeg'
    thumbnail.className = 'shaka-thumbnail'
    thumbnail.style.position = 'absolute'
    thumbnail.style.display = 'none'

    container.appendChild(thumbnail)

    seekBar[0].addEventListener('mousemove', mouseEnter)
    seekBar[0].addEventListener('mouseleave', mouseLeave)
    seekBar[0].addEventListener('touchmove', mouseEnter)
    seekBar[0].addEventListener('touchend', mouseLeave)
    seekBar[0].addEventListener('touchcancel', mouseLeave)
  }
}

function mouseEnter(event) {
  const video = document.getElementById('video')
  const seekBar = document.getElementsByClassName('shaka-seek-bar')
  const thumbnail = document.getElementById('thumbnail')

  var rect = video.getBoundingClientRect()

  const THUMBNAIL_DURATION = 2
  const THUMBNAIL_WIDTH = 160
  const THUMBNAIL_HEIGHT = 90
  const THUMBNAIL_ROW = 20
  const DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL = 150

  // Calculate 1 thumbnail takes how many pixel
  const thumbnailPixel = seekBar[0].offsetWidth / (video.duration / THUMBNAIL_DURATION)
  // Because the seekBar is the center of the video and the video is the center of the window

  const marginLeftBetweenWindowAndVideo = rect.left
  const marginBetweenWindowAndVideo =
    (window.innerWidth - video.offsetWidth) / 2
  const marginBetweenVideoAndSeekbar =
    (video.offsetWidth - seekBar[0].offsetWidth) / 2
  let realEvent =
    event.clientX -
    marginBetweenVideoAndSeekbar -
    marginBetweenWindowAndVideo

  if (realEvent < 0) {
    realEvent = 0
  }
  if (realEvent > seekBar[0].offsetWidth) {
    realEvent = seekBar[0].offsetWidth
  }
  const row = Math.floor((realEvent / thumbnailPixel) % THUMBNAIL_ROW)
  const column = Math.floor(realEvent / (THUMBNAIL_ROW * thumbnailPixel))

  thumbnail.style.display = 'block'
  seekBar[0].style.cursor = 'pointer'
  thumbnail.style.left =
    event.clientX -
    thumbnail.clientWidth / THUMBNAIL_ROW +
    80 -
    marginLeftBetweenWindowAndVideo -
    THUMBNAIL_WIDTH * row +
    'px'
  thumbnail.style.top = rect.height - DISTANCE_BETWEEN_PROGRESS_BAR_AND_THUMBNAIL - THUMBNAIL_HEIGHT * column + 'px'
  thumbnail.style.clip = `rect(${THUMBNAIL_HEIGHT * column}px, ${THUMBNAIL_WIDTH *
    (row + 1)}px, ${THUMBNAIL_HEIGHT * (column + 1)}px, ${THUMBNAIL_WIDTH * row}px)`
}

function mouseLeave(event) {
  const thumbnail = document.getElementById('thumbnail')
  if (thumbnail) {
    thumbnail.style.display = 'none'
  }
}

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