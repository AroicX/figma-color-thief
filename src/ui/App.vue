<template>
  <div>
    <header class="c-header">
      <h4 class="c-header__text c-container">Generate</h4>
      <hr />
    </header>

    <main class="c-main c-container">

      <button class="button" @click="addSelection()">add</button>
      <div id="container"></div>

      <div class="c-image" v-if="image.src">
        <p class="c-image__title">{{ image.name }}</p>
        <div class="c-image__preview">
          <img id="preview-image" :src="image.src" :alt="image.name" height="100px" />
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
  import {
    b64toBlob,
    rgbToHex,
    colourName
  } from './utilis/transformers';

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
        const {
          type,
          name,
          data
        } = event.data.pluginMessage;

        if (type === 'image') {
          this.imageArr = []
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
      generatePalette() {
        var container = document.getElementById('container');
        container.innerHTML = '';
        var preview_image = document.getElementById('preview-image');

        var colorThief = new ColorThief();

        var colour = colorThief.getColor(preview_image);
        var palettes = colorThief.getPalette(preview_image);
        colour = rgbToHex(colour[0], colour[1], colour[2]);
        var colour_name = colourName(colour);
        container.innerHTML += `<h3 >Dominant Colour</h3>\n\
        <div ><button style=background-color:${colour}></button><br />\n\
        <p >${colour}</p><p >${colour_name}</p></div>`;
        container.innerHTML +=
          "<h3 >Colour Palette</h3>";
        palettes.forEach((palette) => {
          var colour = rgbToHex(palette[0], palette[1], palette[2]);
          var colour_name = colourName(colour);
          container.innerHTML += `<div >\n\
           <button  style=background-color:${colour}></button>\n\
          <p >${colour}</p><p >${colour_name}</p>\n\
          </div>`;
        });








      },
      addSelection() {
        this.notify = false;
        parent.postMessage({
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


        this.image.src = blobUrl;
        this.image.name = `${event.data.pluginMessage.name.replace(/\s+/g, '') ||
        'image'}`;


        console.log(this.image);
        this.blob = [];
        this.blob.push({
          name: event.data.pluginMessage.name,
          image: blob
        });
        setTimeout(() => {

          this.generatePalette();
        }, 100);
        console.log('The Blob', this.blob);
      }
    }
  };
</script>

<style lang="scss">
  @import '../figma/figma-ds/figma-plugin-ds';
</style>