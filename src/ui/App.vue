<template>
  <div>
    <header class="c-header">
      <h4 class="c-header__text c-container">Generate</h4>
      <hr />
    </header>

    <main class="c-main c-container">
      <div class="c-image" v-if="image.src">
        <p class="c-image__title">{{ image.name }}</p>
        <div class="c-image__preview">
          <img :src="image.src" :alt="image.name" />
        </div>
      </div>

      <button class="c-generate">
        Generate Palette
      </button>
    </main>

    <div class="message" v-if="notify">
      <span>Successfully uploaded</span>
    </div>
    <div class="warning" v-if="warning">
      <span>{{ this.warning }}</span>
    </div>
  </div>
</template>

<script>
import '../figma/figma-ds/js/selectMenu';
import '../figma/figma-ds/js/iconInput';
import '../figma/figma-ds/js/disclosure';
import { b64toBlob, formatBytes } from './utilis/transformers';

export default {
  data() {
    return {
      imageArr: [],
      blob: [],
      notify: false,
      warning: null,
      image: {
        src: null,
        name: ''
      }
    };
  },

  components: {
    // Welcome
  },

  mounted() {
    // Initialize the figma-ds components
    window.selectMenu.init();
    window.iconInput.init();
    window.disclosure.init();

    window.onmessage = event => {
      const { type, name, data } = event.data.pluginMessage;

      if (type === 'image') {
        this.imageArr.push({
          name: name.replace(/\s+/g, ''),
          image: data
        });

        let b64Data = `${data}`;
        this.imageHandler(event, b64Data);
      }
    };
  },
  methods: {
    addSelection() {
      this.notify = false;
      parent.postMessage(
        {
          pluginMessage: {
            type: 'add-selection'
          }
        },
        '*'
      );
    },
    imageHandler(event, b64Data, type) {
      var contentType = 'image/png';
      var blob = b64toBlob(b64Data, contentType);
      console.log(blob);
      var blobUrl = URL.createObjectURL(blob);

      // create temporary url
      // let parent = document.getElementById('image-holder');
      // var div = document.createElement('div');
      // var imageName = document.createElement('span');
      // var input = document.createElement('input');
      // var img = document.createElement('img');
      // img.src = blobUrl;
      this.image.src = blobUrl;
      this.image.name = `${event.data.pluginMessage.name.replace(/\s+/g, '') ||
        'image'}`;
      // img.height = 200;
      // imageName.className = 'font-sm';
      // imageName.innerHTML = `${event.data.pluginMessage.name.replace(
      //   /\s+/g,
      //   ''
      // ) || 'image'} <br/> <b class="bold">Size:</b> ${formatBytes(blob.size)}`;

      // div.appendChild(img);
      // div.appendChild(imageName);

      //
      // parent.appendChild(div);

      console.log(this.image);
      this.blob = [];
      this.blob.push({
        name: event.data.pluginMessage.name,
        image: blob
      });
      console.log('The Blob', this.blob);
    }
  }
};
</script>

<style lang="scss">
@import '../figma/figma-ds/figma-plugin-ds';
</style>
