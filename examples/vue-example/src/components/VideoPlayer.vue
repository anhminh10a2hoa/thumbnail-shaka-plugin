<template>
  <div 
    id="container" 
    class="shadowLg mxAuto maxWFull size"
    data-shaka-player-container
  >
    <video
      class="wFull hFull"
      id="video"
      poster="../assets/Big.Buck.Bunny.-.Opening.Screen.png"
      autoplay
      data-shaka-player
    >
    </video>
  </div>
</template>

<script>
import image1 from '../assets/big-bunny-1-320-2-160-90.jpeg';
import image2 from '../assets/big-bunny-2-276-2-160-90.jpeg';

const shaka = require('shaka-player/dist/shaka-player.ui.js');
const manifestUri = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const options = {
  thumbnails: 
  [
    {
      src: image1,
      width: 160,
      height: 90,
      row: 20,
      displayTime: 2,
      startTime: 0,
      endTime: 320
    },
    {
      src: image2,
      width: 160,
      height: 90,
      row: 20,
      displayTime: 2,
      startTime: 320,
    }
  ]
}
const ShakaPlugin = require('./index.js')

export default {
  props: {
    licenseServer: {
      type: String,
      required: true
    },
    posterUrl: {
      type: String,
      required: false,
      default: ''
    }
  },
  mounted() {
    this.initApp()
  },
  methods: {
    initApp() {
      // Install built-in polyfills to patch browser incompatibilities.
      shaka.polyfill.installAll();

      // Check to see if the browser supports the basic APIs Shaka needs.
      if (shaka.Player.isBrowserSupported()) {
        // Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
        document.addEventListener('shaka-ui-loaded', this.initPlayer);
        // Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
        // to load (e.g. due to lack of browser support).
        document.addEventListener('shaka-ui-load-failed', this.initFailed);
      } else {
        // This browser does not have the minimum set of APIs we need.
        console.error('Browser not supported!');
      }
    },
    onError(error) {
      console.error('Error code', error.code, 'object', error);
    },
    async initPlayer() {
      // When using the UI, the player is made automatically by the UI object.
      const video = document.getElementById('video');
      const player = new shaka.Player(video)
      const ui = video.ui

      // Attach player and ui to the window to make it easy to access in the JS console.
      window.player = player;
      window.ui = ui;

      // Listen for error events.
      player.addEventListener('error', this.onPlayerErrorEvent);
      // controls.addEventListener('error', onUIErrorEvent);

      // Try to load a manifest.
      // This is an asynchronous process.
      try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
      } catch (error) {
        this.onPlayerError(error);
      }

      let ShakaPlugina = new ShakaPlugin(video, options)
      ShakaPlugina.initialize()
    },
    onPlayerErrorEvent(event) {
      // Extract the shaka.util.Error object from the event.
      this.onPlayerError(event.detail);
    },
    onPlayerError(error) {
      // Handle player error
      console.error('Error code', error.code, 'object', error);
    },
    onUIErrorEvent(event) {
      // Extract the shaka.util.Error object from the event.
      this.onPlayerError(event.detail);
    },
    initFailed() {
      // Handle the failure to load; errorEvent.detail.reasonCode has a
      // shaka.ui.FailReasonCode describing why.
      console.error('Unable to load the UI library!');
    },
  }
};
</script>

<style>

.shadowLg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.maxWFull {
  max-width: 100%;
}
.wFull {
  width: 100%;
}
.hFull {
  height: 100%;

  /* max-height: 100vh; */
}
</style>