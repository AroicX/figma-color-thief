<template>
  <div class="brix">
    <section class="header">
      <span class="type ">Color Thief </span>
      <button class='button button--primary' @click="addSelection">Add Selection</button>
    </section>

    <div class="message" v-if="notify">
      <span>Successfully uploaded</span>
    </div>
    <div class="warning" v-if="warning">
      <span>{{this.warning}}</span>
    </div>


    <div class="image-grid" id="image-holder">


    </div>

  </div>
</template>

<script>
  import "../figma/figma-ds/js/selectMenu";
  import "../figma/figma-ds/js/iconInput";
  import "../figma/figma-ds/js/disclosure";
  import {

    b64toBlob,

    formatBytes,

  } from "./utilis/transformers";





  export default {
    data() {
      return {
        imageArr: [],
        blob: [],
        notify: false,
        warning: null
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



        if (event.data.pluginMessage.type === 'image') {
          this.imageArr.push({
            name: event.data.pluginMessage.name.replace(/\s+/g, ''),
            image: event.data.pluginMessage.data
          });

          let b64Data = `${event.data.pluginMessage.data}`
          this.imageHandler(event, b64Data);

        }
       

      };
    },
    methods: {
      addSelection() {
        this.notify = false
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

        // create temporary url 
        let parent = document.getElementById('image-holder');
        var div = document.createElement('div');
        var imageName = document.createElement('span');
        var input = document.createElement('input');
        var img = document.createElement('img');
        img.src = blobUrl;
        img.height = 200;
        imageName.className = 'font-sm';
        imageName.innerHTML =
          `${event.data.pluginMessage.name.replace(/\s+/g, '') || 'image'} <br/> <b class="bold">Size:</b> ${formatBytes(blob.size)}`;
       
        div.appendChild(img);
        div.appendChild(imageName);

        // 
        parent.appendChild(div);
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
  @import "../figma/figma-ds/figma-plugin-ds";
</style>