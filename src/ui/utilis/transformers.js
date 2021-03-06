import {
  rejects
} from 'assert';
import axios from 'axios';
var fs = require('fs');
import FileReader from 'filereader';

const ACCESS_TOKEN = '140347-4084f1f3-b692-4478-82f0-6142a7278af4';

export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function generatePalette() {
  var container = document.getElementById('container');
  container.innerHTML = '';
  var preview_image = document.getElementById('preview-image');




  var vibrant = new Vibrant(preview_image);
  var swatches = vibrant.swatches()
  for (var swatch in swatches) {
    console.log(swatches);

    if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
      var div = document.createElement('div');
      div.style.width = '200px'
      div.style.height = '50px'
      div.style.padding = '20px'
      div.style.background = swatches[swatch].getHex()

      div.innerHTML = swatches[swatch].getHex();



      container.append(div)
      // console.log(swatch, swatches[swatch].getHex())

    }

  }






  /*
   * Results into:
   * Vibrant #7a4426
   * Muted #7b9eae
   * DarkVibrant #348945
   * DarkMuted #141414
   * LightVibrant #f3ccb4
   */
}


export const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return toUpper(hex.length === 1 ? "0" + hex : hex);
    })
    .join("");

    export const toUpper = (string) => {
  var replacedText = string.replace(/[^A-Z0-9]/g, function (match) {
    if (match != undefined) {
      return match.toUpperCase();
    }
  });
  return replacedText;
};

export const colourName = (colour) => {
  return ntc.name(colour)[1];
};
