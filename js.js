let getRGBValues = (e) => {
  let style = window.getComputedStyle(e.target, "");
  let color = style.getPropertyValue("background-color");
  const rgbstring = color.substr(4, color.length - 5);
  const rgbValues = rgbstring.split(',');
  return rgbValues;
}


let darkenRGBVals = (e, rgbValues) => {
  const darkenIncrement = 40;
  for (let i = 0; i < rgbValues.length; i++) {
    if (rgbValues[i] > darkenIncrement) {
      rgbValues[i] = rgbValues[i] - darkenIncrement;
    }
  }
  setSquareColor(e, rgbValues);
}


let setSquareColor = (e, rgbValues) => {
  let rgbString = 'rgb(' + rgbValues[0] + ', ' + rgbValues[1] + ', ' + rgbValues[2] + ')';
  e.target.style.backgroundColor = rgbString;
}


let darkenSquare = (e) => {
  rgbValues = getRGBValues(e);
  if (paintMode === 'hover' || (paintMode === 'click' && gridClick)) {
    darkenRGBVals(e, rgbValues);
  }
}

let calcRGBFromHex = (color) => {
  r = color.slice(1,3);
  g = color.slice(3,5);
  b = color.slice(5,7);
  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  let rgbFromHex =[r,g,b]
  console.log(rgbFromHex)
  return rgbFromHex
}

let colorSquare = (e) => {
    if (paintMode === 'hover' || (paintMode === 'click' && gridClick)) {
      setSquareColor(e, userRGBVals)
    }
}

let eraseSquare = (e) => {
  if (paintMode === 'hover' || (paintMode === 'click' && gridClick)) {
    setSquareColor(e,[229,225,238])
  }
}

let getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let rainbowSquare = (e) => {
  r = getRandomInt(255);
  g = getRandomInt(255);
  b = getRandomInt(255);
  let rgbValues = [r, g, b];
  if (paintMode === 'hover' || (paintMode === 'click' && gridClick)) {
    setSquareColor(e, rgbValues);
  }
}

let onSquareEnter = (e) => {

  if (brushMode == 'color') {
    colorSquare(e);
  }
  else if (brushMode == 'darken') {
    darkenSquare(e);
  }
  else if (brushMode == 'rainbow') {
    rainbowSquare(e);
  }
  else if (brushMode == 'eraser') {
    eraseSquare(e);
  }
  
}

let clearGrid = () => {
  grid.innerHTML = ''
}

let buildGrid = (totalSquares) =>{
  grid.style["grid-template-columns"] = "repeat(" + gridColumns + ", 1fr)";
  grid.style["grid-template-rows"] = "repeat(" + gridRows + ", 1fr)";
  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');
    square.addEventListener('mouseenter', onSquareEnter);
    grid.appendChild(square);
  }
}

let reloadGrid = () => {
  clearGrid();
  buildGrid(totalSquares);
}

let updateText = (squares) => {
  squareDisplayX[0].innerHTML = squares;
  squareDisplayX[1].innerHTML = squares;
}

let clearButtonClicks = (id) => {
  if (id != 'color-button') {
    colorButton.classList.remove('clicked');
    colorButton.style.color = '#FFF9FB';
    colorButton.style.backgroundColor = '#0A2E36';
    colorButton.style.borderColor ='#FFF9FB'
  }
  if (id != 'darken-button') {
    darkenButton.classList.remove('clicked');
  }
  if (id != 'rainbow-button') {
    rainbowButton.classList.remove('clicked');
  }
  if (id != 'eraser-button') {
    eraserButton.classList.remove('clicked');
  }
}

let setBrushMode = (id, buttonOn) => {
  if (!buttonOn) {
    brushMode = ''
    return;
  }
  if (id === 'color-button') {
    brushMode = 'color';
    if (color === '#000000') {
      colorButton.style.backgroundColor = '#000000';
    }
  }
  else if (id === 'darken-button') {
    brushMode = 'darken';
  }
  else if (id === 'rainbow-button') {
    brushMode = 'rainbow';
  }
  else if (id ==='eraser-button') {
    brushMode = 'eraser';
  }
}

let handleBrushClicks = (e) => {
  clearButtonClicks(e.id);
  let buttonOn = e.classList.toggle('clicked');
  setBrushMode(e.id, buttonOn);
}

let createBrushListeners = (e) => {
  e.addEventListener('click', () => {
    handleBrushClicks(e);
  });
}

let handleModeClicks = (e) => {
  if (e.id === 'hover-button' && hoverButton.classList.contains('clicked')) {
    return;
  }
  else if (e.id === 'click-button' && clickButton.classList.contains('clicked')) {
    return;
  }
  else {
    hoverButton.classList.toggle('clicked');
    clickButton.classList.toggle('clicked');
    if (paintMode === 'hover') {
      paintMode = 'click';
    }
    else {
      paintMode = 'hover';
    }
  }
}

let createModeListeners = (e) => {
  e.addEventListener('click', () => {
    handleModeClicks(e);
  });
}

let handleSlider = (sliderValue) => {
  sliderValue = parseInt(sliderValue);
  updateText(sliderValue)
  gridColumns = parseInt(sliderValue);
  gridRows = parseInt(sliderValue);
  totalSquares = gridColumns * gridRows;
  reloadGrid();
}

/* ---------- Script ---------- */

let gridColumns = 16;
let gridRows = 16;
let totalSquares = gridColumns * gridRows;
let brushMode = '';
let paintMode = 'click';
const grid = document.querySelector('.grid');
const slider = document.querySelector('.slider');
const squareDisplayX = document.querySelectorAll('.square-count-display');
const brushButtons = document.querySelectorAll('.brush-button');
const colorButton = document.getElementById('color-button');
const darkenButton = document.getElementById('darken-button');
const rainbowButton = document.getElementById('rainbow-button');
const eraserButton = document.getElementById('eraser-button');
const resetButton = document.querySelector('.reset-button');
const hoverButton = document.getElementById('hover-button');
const clickButton = document.getElementById('click-button');
const modeButtons = document.querySelectorAll('.mode-button');
const body = document.querySelector('body');
const colorPicker = document.createElement('input');
colorPicker.type = 'color'
let gridClick = false;
let color = '#000000';
let userRGBVals = '';


grid.ondragstart = () => {return false};

buildGrid(totalSquares);

body.addEventListener('mousedown', () => {gridClick = true});
body.addEventListener('mouseup', () => {gridClick = false});

modeButtons.forEach(e => createModeListeners(e));

brushButtons.forEach(e => createBrushListeners(e));

resetButton.addEventListener('click', reloadGrid);

slider.onchange = () => handleSlider(slider.value);

colorButton.addEventListener('click', () => {
  if (colorButton.classList.contains('clicked')){
    colorButton.style.color = '#FFF9FB';
    colorButton.style.backgroundColor = '#000000';
    colorButton.style.borderColor ='#FFF9FB';
    userRGBVals = [000, 000, 000];
    colorPicker.addEventListener('change', () =>{
      console.log('input');
      color = colorPicker.value;
      colorButton.style.backgroundColor = color;
      if (parseInt(color.slice(1,7), 16) > 9000000) {
        colorButton.style.color = '#0A2E36';
        colorButton.style.borderColor ='#0A2E36'
      }
      else {
        colorButton.style.color = '#FFF9FB'
      }
      userRGBVals = calcRGBFromHex(color);
    })
    colorPicker.click();
  }
  else {
    colorButton.style.color = '#FFF9FB';
    colorButton.style.backgroundColor = '#0A2E36';
    colorButton.style.borderColor ='#FFF9FB'
  }
});