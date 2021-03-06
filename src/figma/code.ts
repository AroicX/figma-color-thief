console.clear();
const start = Date.now();

// show UI
figma.showUI(__html__, {
  width: 480,
  height: 570
});

function getContent(selection: any) {
  switch (selection.type) {
    case 'RECTANGLE':
      if (selection.fills && selection.fills[0]?.type === 'IMAGE') {
        const { imageHash } = selection.fills[0];

        var imageLink;
        figma
          .getImageByHash(imageHash)
          .getBytesAsync()
          .then(res => {
            const buffer = Buffer.from(res);

            const base64String = buffer.toString('base64');

            var imageName = 'test';
            figma.ui.postMessage({
              type: 'image',
              name: `${selection.name || 'test'}.png`,
              data: base64String
            });
            imageLink = `background-image: url('./images/"${imageName}.png')}`;
          });

        console.log(imageLink);
      } else {
        figma.closePlugin('Please Select An Image Or A Frame 😒');
      }
      break;

    default:
      figma.closePlugin('Please Select An Image Or A Frame 😒');
      break;
  }
}

const selection = figma.currentPage.selection['0'];

getContent(selection);
console.log(selection);

figma.ui.onmessage = event => {
  if (event.type === 'close') {
    figma.closePlugin();
  }
  if (event.type === 'add-selection') {
    let selected = figma.currentPage.selection['0'];
    getContent(selected);
  }
};

//time taken
const end = Date.now();
const time = ((end - start) / 1000).toFixed(2);
figma.ui.postMessage({
  type: 'time',
  data: `Completed in : ${time}s`
});
console.log('Completed in:', time + 's');
