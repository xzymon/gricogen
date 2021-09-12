const boardContainer = document.getElementById('boardContainer');

const backgroundCanvasLayer = document.getElementById('background');
const backgroundSVGLayer = document.getElementById('background-svg');

const coreCanvasLayer = document.getElementById('core');

document.addEventListener('DOMContentLoaded', loadHeatUnitIcon);

let globalSize = 800;

const svganFill = 'fill';

function loadHeatUnitIcon(e) {
	let canvas = coreCanvasLayer;
	let ctx = canvas.getContext('2d');
	let imgObj = new Image();

	imgObj.onload = function () {
		let maxAxisSpace = globalSize;

		let w = globalSize;
		let h = globalSize;

		let scaleUnitToProduction = 4 / 5;

		let snw = maxAxisSpace * scaleUnitToProduction;
		let snh = maxAxisSpace * scaleUnitToProduction;
		let bdx = (w - snw) / 2;
		let bdy = (h - snh) / 2;

		console.log(`loadOxygenIcon: w=${w} h=${h} snw=${snw} snh=${snh} bdx=${bdx} bdy=${bdy}`);
		ctx.drawImage(imgObj, bdx, bdy, snw, snh);
	};

	imgObj.src = '../img/heatUnit.png';

	/*
	const colorBackgroundRGB = 'rgb(81, 55, 38)';
	const colorBackground = '#513726';
	const styleBackgroundRect = `fill: ${colorBackground}`;
	drawRect(backgroundCanvasLayer, 'backgroundRectId', styleBackgroundRect, 0, 0, globalSize, globalSize );
	 */
}

// rysowanie prostokata
function drawRect(svgElem, oId, styleForRect, x, y, width, height) {
	console.log(svgElem);
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.id = oId;
	rect.setAttribute(svganFill, styleForRect);
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	console.log(rect);
	svgElem.appendChild(rect);
	return rect;
}