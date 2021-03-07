import { hexToRgb, getTextColor } from '../ui/utilis/transformers';

console.clear();
const start = Date.now();

// show UI
figma.showUI(__html__, {
  width: 500,
  height: 570
});

let timesSelected = 0;

function getContent(selection: any) {
  if (!selection && timesSelected > 0) {
    figma.notify('Please select an image');
    return;
  } else if (!selection && timesSelected === 0) {
    figma.closePlugin('Please Select An Image Or A Frame 😒');
    return;
  }

  if (
    selection.fills &&
    selection.fills[0]?.type !== 'IMAGE' &&
    timesSelected > 0
  ) {
    figma.notify('Please select an image');
    return;
  }

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

        timesSelected += 1;

        // console.log(imageLink);
      } else {
        figma.closePlugin('Please Select An Image Or A Frame 😒');
      }
      break;

    default:
      figma.closePlugin('Please Select An Image Or A Frame 😒');
      break;
  }
}

const createFrame = (width: number, paletteLength: number, spacing: number) => {
  const nodes: SceneNode[] = [];
  const frame = figma.createFrame();
  frame.resize(width * paletteLength + spacing * paletteLength + spacing, 1000);
  nodes.push(frame);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
  frame.name = 'Color Thief';

  return frame;
};

const createRects = (
  color: { r: number; g: number; b: number },
  width: number,
  height: number
) => {
  const rect = figma.createRectangle();

  rect.resize(width, height);

  rect.fills = [
    {
      type: 'SOLID',
      color
    }
  ];

  return rect;
};

const createText = async (rect: RectangleNode, color: string) => {
  // Load fonts to use on canvas.
  await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });

  const textNode = figma.createText();
  textNode.y = rect.y + 30;
  textNode.x = 20 + rect.x;
  const textColor = getTextColor(color);
  textNode.fills = [
    {
      type: 'SOLID',
      color: textColor
    }
  ];

  textNode.textCase = 'UPPER';
  textNode.characters = color;
  textNode.fontSize = 20;
  selection.parent.appendChild(textNode);
};

const exportPalette = (palettes: []): void => {
  const rectWidth = 400;
  const rectHeight = 80;
  const spacing = 40;
  const frame = createFrame(rectWidth, palettes.length, spacing);

  palettes.forEach(({ palette }: { palette: [] }, i) => {
    const nodes: BaseNode[] = [];
    palette.forEach(async (color, i) => {
      const rgbValue = hexToRgb(color);
      const rect = createRects(rgbValue, rectWidth, rectHeight);
      rect.y = i * rectHeight;
      nodes.push(rect);
      createText(rect, color);
    });
    const group = figma.group(nodes, frame);

    group.y = spacing;
    group.x = i * rectWidth + spacing * (i + 1);
  });

  figma.closePlugin();
};

const selection = figma.currentPage.selection['0'];

getContent(selection);
// console.log(selection);

figma.ui.onmessage = event => {
  if (event.type === 'close') {
    figma.closePlugin();
  }
  if (event.type === 'add-selection') {
    let selected = figma.currentPage.selection['0'];
    getContent(selected);
  }
  if (event.type === 'export-palettes') {
    exportPalette(event.palettes);
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
