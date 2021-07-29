const boardContainer = document.getElementById('boardContainer');

const backgroundCanvasLayer = document.getElementById('background');
const backgroundSVGLayer = document.getElementById('background-svg');

const coreCanvasLayer = document.getElementById('core');
const coreSVGLayer = document.getElementById('core-svg');

const bodyCanvasLayer = document.getElementById('body');
const bodySVGLayer = document.getElementById('body-svg');

const outfitCanvasLayer = document.getElementById('outfit');
const outfitSVGLayer = document.getElementById('outfit-svg');

const coverageCanvasLayer = document.getElementById('coverage');
const coverageSVGLayer = document.getElementById('coverage-svg');

const effectsCanvasLayer = document.getElementById('effects');
const effectsSVGLayer = document.getElementById('effects-svg');


const horizontalSize = document.getElementById('horizontal');
const verticalSize = document.getElementById('vertical');
const buttonSetSize = document.getElementById('setSize');

//globalne stale sterujace
let globalSize = 800;
let globalUnitsCount = 12;
let globalUnitSize = globalSize / globalUnitsCount;
let globalHeight = globalSize;
let globalWidth = globalSize;

// Math constants
const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;

//stale dotyczace stylow dla warstw SVG
const svganStyle = 'style';
const svganFill = 'fill';
const svganClass = 'class';
const svganPathD = 'd';
const svganOffset = 'offset';

//wartosci dla SVG
const styleGrid = "fill: none; stroke: gray; stroke-width: 3;";
const idGrid = 'gridId';
const idPokeballPathTop = 'topPokeballPartId';
const idPokeballPathBottom = 'bottomPokeballPartId';
const idConglArcPathTop = 'topPartId';
const idConglArcPathBottom = 'bottomPartId';
const idRawPoint = 'rawPointId';
const idCoreOfSun = 'coreOfSunId';
const idRaysOfSun = 'raysOfSunId';
const idGradRing = 'gradRingId';
const idRing = 'ringId';
const idHex = 'hexId';

// zmienne pod obiekty
let conglArcPathTop = undefined;
let conglArcPathBottom = undefined;
let rawPointCount = 0;

// przechowalnie wartosci
let cfasx = undefined; // arcStartX.value
let cfasy = undefined; // arcStartY.value
let cfaex = undefined; // arcEndX.value
let cfaey = undefined; // arcEndY.value


initializeBoardContainer();
buttonSetSize.addEventListener('click', changeSize);

drawGridOfRowsAndColumns(effectsSVGLayer, 0, 0, globalWidth, globalHeight, styleGrid, globalUnitsCount, globalUnitsCount);
drawGraphics();

function initializeBoardContainer() {
	let horizontalWidth = 800;//horizontalSize.value;
	let verticalHeight = 800;//verticalSize.value;

	setNewSize(horizontalWidth, verticalHeight);
}

function changeSize(e) {
	console.log(`e.button = ${e.button}`);

	let horizontalWidth = horizontalSize.value;
	let verticalHeight = verticalSize.value;

	setNewSize(horizontalWidth, verticalHeight);
}

function setNewSize(width, height) {
	boardContainer.width = width;
	boardContainer.height = height;

	backgroundCanvasLayer.width = width;
	backgroundCanvasLayer.height = height;

	backgroundSVGLayer.width = width;
	backgroundSVGLayer.height = height;

	coreCanvasLayer.width = width;
	coreCanvasLayer.height = height;

	coreSVGLayer.width = width;
	coreSVGLayer.height = height;

	bodyCanvasLayer.width = width;
	bodyCanvasLayer.height = height;

	bodySVGLayer.width = width;
	bodySVGLayer.height = height;

	outfitCanvasLayer.width = width;
	outfitCanvasLayer.height = height;

	outfitSVGLayer.width = width;
	outfitSVGLayer.height = height;

	coverageCanvasLayer.width = width;
	coverageCanvasLayer.height = height;

	coverageSVGLayer.width = width;
	coverageSVGLayer.height = height;

	effectsCanvasLayer.width = width;
	effectsCanvasLayer.height = height;

	effectsSVGLayer.width = width;
	effectsSVGLayer.height = height;

}

function newSVGElemPathWithStyle(elemId, elemStyle) {
	let newSVGElemPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	newSVGElemPath.id = elemId;
	newSVGElemPath.setAttribute(svganStyle, elemStyle);
	return newSVGElemPath;
}

//siatka
function drawGridOfRowsAndColumns(svgElem, xStart, yStart, w, h, style, rowsCount, columnsCount) {
	//console.log(svgElem);
	let grid = newSVGElemPathWithStyle(idGrid, style);
	let spaceOnX = w - xStart;
	let spaceOnY = h - yStart;
	let rowH = spaceOnY / rowsCount;
	let colW = spaceOnX / columnsCount;
	let pathD = new String();
	let yVal = undefined;
	// najpierw dodaje poziome linie
	let xVal = xStart + w; //ustawiony na koniec siatki
	for (loop = 0; loop <= rowsCount; loop++) {
		yVal = yStart + rowH * loop;
		pathD = pathD.concat("M " + xStart + " " + yVal + " L " + xVal + " " + yVal + " ");
		//console.log(pathD);
	}
	// teraz dodaje pionowe linie
	yVal = yStart + h; // ustawiany na koniec siatki
	for (loop = 0; loop <= rowsCount; loop++) {
		xVal = xStart + colW * loop;
		pathD = pathD.concat("M " + xVal + " " + yStart + " L " + xVal + " " + yVal + " ");
		//console.log(pathD);
	}
	grid.setAttribute(svganPathD, pathD);
	svgElem.appendChild(grid);
}

// szkielet dla dodania elementu path do elementu nadrzednego
function drawPath(svgElem, oId, styleForPath, pathDString) {
	console.log(svgElem);
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.id = oId;
	path.setAttribute(svganStyle, styleForPath);
	path.setAttribute(svganPathD, pathDString);
	console.log(path);
	svgElem.appendChild(path);
	return path;
}

//figury geometryczne - podstawowe

// rysowanie prostokata
function drawRect(svgElem, oId, styleForRect, x, y, width, height) {
	console.log(svgElem);
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.id = oId;
	rect.setAttribute(svganStyle, styleForRect);
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	console.log(rect);
	svgElem.appendChild(rect);
	return rect;
}

// rysowanie okregu
function drawCircle(svgElem, oId, styleForCircle, cX, cY, cR) {
	console.log(svgElem);
	const kolo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	kolo.id = oId;
	kolo.setAttribute(svganStyle, styleForCircle);
	kolo.setAttribute('cx', cX);
	kolo.setAttribute('cy', cY);
	kolo.setAttribute('r', cR);
	console.log(kolo);
	svgElem.appendChild(kolo);
	return kolo;
}

// rysowanie elipsy
function drawEllipse(svgElem, oId, styleForEllipse, cX, cY, rX, rY) {
	console.log(svgElem);
	const eli = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
	eli.id = oId;
	eli.setAttribute(svganStyle, styleForEllipse);
	eli.setAttribute('cx', cX);
	eli.setAttribute('cy', cY);
	eli.setAttribute('rx', rX);
	eli.setAttribute('ry', rY);
	console.log(eli);
	svgElem.appendChild(eli);
	return eli;
}

function useTransformRotate(svgElem, rotateShapeId, rotateDegrees, rotationCenterX, rotationCenterY) {
	console.log(svgElem);
	const rot = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	rot.setAttribute('href', `#${rotateShapeId}`);
	rot.setAttribute('transform', `rotate(${rotateDegrees}, ${rotationCenterX}, ${rotationCenterY})`);
	console.log(rot);
	svgElem.appendChild(rot);
	return rot;
}

// rysowanie lukow

// rysowanie kwadratu przedzielonego lukiem na dwie wypelnione czesci
function drawSquareDividedByArc(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, cfSize, cfMargin, styleTop, styleBottom) {
	const innerArea = cfSize - 2 * cfMargin;
	const innerUnit = innerArea / 10;
	const x = 0;
	const y = 0;
	const width = innerArea;
	const height = innerArea;
	const arcControlX = 5 * innerUnit;
	const arcControlY = 12/2 * innerUnit;
	const arcEndY = 8 / 2 * innerUnit;

	const transX = cfMargin + x;
	const transY = cfMargin + y;
	const transWidth = cfMargin + width;
	const transHeight = cfMargin + height;
	const transArcControlX = cfMargin + arcControlX;
	const transArcControlY = cfMargin + arcControlY;
	const transArcEndY = cfMargin + arcEndY;

	drawRect(svgElemBottomShaded, idConglArcPathBottom, styleBottom, transX, transY, width, height);

	const pathDString = `M ${transX} ${transY} L ${transX} ${transArcEndY} Q ${transArcControlX} ${transArcControlY} ${transWidth} ${transArcEndY} L ${transWidth} ${transY} Z`;
	drawPath(svgElemTopLight, idConglArcPathTop, styleTop, pathDString);
}

function drawHexagonDividedByArc(svgElemTopLight, svgElemBottomShaded, hexTopId, hexBottomId, hexTopStyle, hexBottomStyle, cfSize, cfMargin) {
	const cX = cfSize / 2;
	const cY = cfSize / 2;
	const cR = cfSize /2 - cfMargin / 2;

	const innerArea = cfSize - 2 * cfMargin;
	const innerUnit = innerArea / 10;
	const arcControlX = 5 * innerUnit;
	const arcControlY = 35 / 6 * innerUnit;
	const arcEndY = 25 /6 * innerUnit;

	const transArcControlX = cfMargin + arcControlX;
	const transArcControlY = cfMargin + arcControlY;
	const transArcEndY = cfMargin + arcEndY;

	let pathD = pathDForHexagon(cX, cY, cR);
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = hexBottomId;
	path.setAttribute(svganStyle, hexBottomStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElemBottomShaded.appendChild(path);

	let raw = cR * Math.sqrt(3) / 2;
	let rawString = new String(raw);
	let restored = Number(rawString);
	let resultString = restored.toFixed(1);
	let h = Number(resultString);

	let xleft = Math.round(cX - h);
	let xmid = Math.round(cX);
	let xright = Math.round(cX + h);
	let ytop = Math.round(cY - cR);
	let yup = Math.round(cY - (cR/2));

	const pathDString = `M ${xmid} ${ytop} L ${xleft} ${yup} L ${xleft} ${transArcEndY} Q ${transArcControlX} ${transArcControlY} ${xright} ${transArcEndY} L ${xright} ${yup} Z`;
	drawPath(svgElemTopLight, hexTopStyle, hexTopStyle, pathDString);
}

//----------------------------------------rysowanie lukow wypelniajacych okrag------------------------------------------
function drawCircleFilledWithShading(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, cfSize, cfMargin, styleTop, styleBottom) {
	const cfHalfSize = cfSize / 2;
	const cfCentralX = cfHalfSize;
	const cfCentralY = cfHalfSize;
	const cfRadiusX= cfHalfSize - cfMargin;
	const cfRadiusY = cfHalfSize - cfMargin;
	const angleDegreesOffset = 10;
	const halfOfFullAngleInDegrees = 180;
	const degree = 1; // troche sztuczne, ale tak by nie zmieniac kodu narazie

	const startRotation = 0;
	const factor = π/180; // dla stopni = 2*π / 360, bo okrag ma 2*π radianow - wiec mnozymy radiany przez 2*π i dzielimy przez 360 zeby miec stopnie

	let adn = halfOfFullAngleInDegrees + 2 * angleDegreesOffset;
	let add = degree;
	let delta = factor * adn/add;

	let afn = -angleDegreesOffset; //tak, z minusem
	let afd = degree;
	let fi = factor * afn/afd;

	drawConglomerateArcPaths(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, cfCentralX, cfCentralY, cfRadiusX, cfRadiusY, startRotation, delta, fi, styleTop, styleBottom);
}

function drawPokeball(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, cfSize, cfMargin, styleTop, styleBottom) {
	const cfHalfSize = cfSize / 2;
	const cfCentralX = cfHalfSize;
	const cfCentralY = cfHalfSize;
	const cfRadiusX= cfHalfSize;
	const cfRadiusY = cfHalfSize;
	const angleDegreesOffset = 10;
	const halfOfFullAngleInDegrees = 180;
	const degree = 1; // troche sztuczne, ale tak by nie zmieniac kodu narazie

	const startRotation = 0;
	const factor = π/180; // dla stopni = 2*π / 360, bo okrag ma 2*π radianow - wiec mnozymy radiany przez 2*π i dzielimy przez 360 zeby miec stopnie

	let adn = halfOfFullAngleInDegrees + 2 * angleDegreesOffset;
	let add = degree;
	let delta = factor * adn/add;

	let afn = -angleDegreesOffset; //tak, z minusem
	let afd = degree;
	let fi = factor * afn/afd;

	drawConglomerateArcPaths(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, cfCentralX, cfCentralY, cfRadiusX, cfRadiusY, startRotation, delta, fi, styleTop, styleBottom);
}

function generateCircleArcPointsAndReturnFiArc(cx, cy, rx, ry, t1, deltaArg, φ) {
	let Δ = deltaArg % (2*π);
	const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
	const f_rotate_matrix = (x => [[cos(x),-sin(x)], [sin(x), cos(x)]]);
	const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

	const rotMatrix = f_rotate_matrix (φ);
	const [sX, sY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1), ry * sin(t1)] ), [cx,cy] ) );
	const [eX, eY] = ( f_vec_add ( f_matrix_times ( rotMatrix, [rx * cos(t1+Δ), ry * sin(t1+Δ)] ), [cx,cy] ) );
	const fA = ( (  Δ > π ) ? 1 : 0 );
	const fS = ( (  Δ > 0 ) ? 1 : 0 );
	cfasx = Math.round(sX);
	cfasy = Math.round(sY);
	cfaex = Math.round(eX);
	cfaey = Math.round(eY);
	flagArc = fA;
	flagSweep = fS;
	return φ / (2*π) *360;
}

function drawConglomerateArcPaths(svgElemTopLight, svgElemBottomShaded, idConglArcPathTop, idConglArcPathBottom, pathCenterX, pathCenterY, radiusX, radiusY, startRotation, delta, fi, styleTop, styleBottom) {
	let fiArc = generateCircleArcPointsAndReturnFiArc(pathCenterX, pathCenterY, radiusX, radiusY, startRotation, delta, fi);
	conglArcPathTop = replaceAndDrawConglomerateArcPath(svgElemTopLight, conglArcPathTop, idConglArcPathTop, styleTop, pathCenterX, pathCenterY, radiusX, radiusY, fiArc, 0, 0);
	conglArcPathBottom = replaceAndDrawConglomerateArcPath(svgElemBottomShaded, conglArcPathBottom, idConglArcPathBottom, styleBottom, pathCenterX, pathCenterY, radiusX, radiusY, fiArc, 1, 1);
}

function replaceAndDrawConglomerateArcPath(svgElem, conglomerateArcPath, oId, styleForPath, pcX, pcY, prX, prY, fiArc, flagArc, flagSweep) {
	if (conglomerateArcPath !== undefined) {
		console.log("removing object:");
		console.log(conglomerateArcPath);
		svgElem.removeChild(conglomerateArcPath);
	}
	conglomerateArcPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	conglomerateArcPath.id = oId;
	conglomerateArcPath.setAttribute(svganStyle, styleForPath);
	let pathD = "M ";
	pathD = pathD.concat([cfaex, cfaey ].join(" "));
	pathD = pathD.concat(" Q ");
	pathD = pathD.concat([pcX, (7 * pcY / 6), cfasx ,cfasy ]);
	pathD = pathD.concat(" A ");
	pathD = pathD.concat([ prX , prY , fiArc, flagArc, flagSweep, cfaex, cfaey ].join(" "));
	conglomerateArcPath.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(conglomerateArcPath);
	svgElem.appendChild(conglomerateArcPath);
	return conglomerateArcPath;
}

//kropla
function drawVerticalDroplet(svgElem, gradId, dropletId, dropletStyle, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	drawRadialGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue);
	let pathD = "M 400 88 L 541 358 A 160 160 -28 1 1 259 358";
	pathD = pathD.concat(" Z");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = dropletId;
	path.setAttribute(svganFill, "url(#" + gradId + ")");
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

function drawWave(svgElem, gradId, waveId, waveStyle, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	drawVerticalGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue);
	let pathD = "M -50 510 Q 0 510 50 465 Q 100 420 150 420 Q 200 420 250 465 Q 300 510 350 510 Q 400 510 450 465 Q 500 420 550 420 Q 600 420 650 465 Q 700 510 750 510 Q 800 510 850 465 L 850 800 L -50 800 Z";
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = waveId;
	path.setAttribute(svganFill, "url(#" + gradId + ")");
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

//trojkacik
function drawSymmetricVerticalTriangle(svgElem, triangleId, triangleStyle, xH, aY, h, halfA) {
	let ytop = aY - h;
	let ybottom = aY;
	let xleft = xH - halfA;
	let xmid = xH;
	let xright = xH + halfA;

	let points = new Array();

	points.push(xmid, ytop);
	points.push(xright, ybottom);
	points.push(xleft, ybottom);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = triangleId;
	path.setAttribute(svganStyle, triangleStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

//rysowanie szescianow
function pathDForHexagon(cX, cY, cR) {
	let raw = cR * Math.sqrt(3) / 2;
	let rawString = new String(raw);
	let restored = Number(rawString);
	let resultString = restored.toFixed(1);
	let h = Number(resultString);

	let xleft = Math.round(cX - h);
	let xmid = Math.round(cX);
	let xright = Math.round(cX + h);
	let ytop = Math.round(cY - cR);
	let yup = Math.round(cY - (cR/2));
	let ydown = Math.round(cY + (cR/2));
	let ybottom = Math.round(cY + cR);

	console.log(`xleft: ${xleft}`);

	let points = new Array();

	points.push(xmid, ytop);
	points.push(xright, yup);
	points.push(xright, ydown);
	points.push(xmid, ybottom);
	points.push(xleft, ydown);
	points.push(xleft, yup);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	return pathD;
}

function drawAntiHexagon(svgElem, hexId, hexStyle, cX, cY, cR) {
	let raw = cR * Math.sqrt(3) / 2;
	let rawString = new String(raw);
	let restored = Number(rawString);
	let resultString = restored.toFixed(1);
	let h = Number(resultString);

	let xleft = Math.round(cX - h);
	let xmid = Math.round(cX);
	let xright = Math.round(cX + h);
	let yup = Math.round(cY - (cR/2));
	let ydown = Math.round(cY + (cR/2));
	let max = 800;
	let min = 0;

	let pointsLeft = new Array();
	pointsLeft.push(min, min);
	pointsLeft.push(xmid, min);
	pointsLeft.push(xleft, yup);
	pointsLeft.push(xleft, ydown);
	pointsLeft.push(xmid, max);
	pointsLeft.push(min, max);

	let pathLeftD = new String("M " + pointsLeft[0] + " " + pointsLeft[1]);
	for (let lineI = 2; lineI < pointsLeft.length; lineI += 2) {
		pathLeftD = pathLeftD.concat(" L " + pointsLeft[lineI] + " " + pointsLeft[lineI+1]);
	}
	pathLeftD = pathLeftD.concat(" Z");

	const pathLeft = document.createElementNS("http://www.w3.org/2000/svg", "path");
	pathLeft.id = hexId + 'Left';
	pathLeft.setAttribute(svganStyle, hexStyle);
	pathLeft.setAttribute(svganPathD, pathLeftD);
	console.log("adding object:");
	console.log(pathLeft);
	svgElem.appendChild(pathLeft);

	let pointsRight = new Array();
	pointsRight.push(max, min);
	pointsRight.push(xmid, min);
	pointsRight.push(xright, yup);
	pointsRight.push(xright, ydown);
	pointsRight.push(xmid, max);
	pointsRight.push(max, max);
	let pathRightD = new String("M " + pointsRight[0] + " " + pointsRight[1]);
	for (let lineI = 2; lineI < pointsRight.length; lineI += 2) {
		pathRightD = pathRightD.concat(" L " + pointsRight[lineI] + " " + pointsRight[lineI+1]);
	}

	pathRightD = pathRightD.concat(" Z");
	const pathRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
	pathRight.id = hexId + 'Right';
	pathRight.setAttribute(svganStyle, hexStyle);
	pathRight.setAttribute(svganPathD, pathRightD);
	console.log("adding object:");
	console.log(pathRight);
	svgElem.appendChild(pathRight);
}



function drawHexagon(svgElem, hexId, hexStyle, cX, cY, cR) {
	//let unit = size / 12;

	let pathD = pathDForHexagon(cX, cY, cR);
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = hexId;
	path.setAttribute(svganStyle, hexStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}


// bardziej wyrafinowane funkcje rysujace

// stworzenie liniowego pionowego gradientu na elemencie (i dodanie gradientu do elementu)
function drawVerticalGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	const gradientDef = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
	gradient.id = gradId;
	gradient.setAttribute('x1', "0%");
	gradient.setAttribute('y1', "0%");
	gradient.setAttribute('x2', "0%");
	gradient.setAttribute('y2', "100%");
	console.log(gradient);
	const stopTop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stopTop.setAttribute(svganOffset, "0%");
	stopTop.setAttribute(svganStyle, "stop-color:rgb(" + grad1Red + "," + grad1Green + "," + grad1Blue + ");stop-opacity:1");
	gradient.appendChild(stopTop);
	const stopBottom = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stopBottom.setAttribute(svganOffset, "100%");
	stopBottom.setAttribute(svganStyle, "stop-color:rgb(" + grad2Red + "," + grad2Green + "," + grad2Blue + ");stop-opacity:1");
	gradient.appendChild(stopBottom);
	gradientDef.appendChild(gradient);
	svgElem.appendChild(gradientDef);
}

// stworzenie katowego gradientu na elemencie (i dodanie gradientu do elementu)
function drawRadialGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	const gradientDef = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
	const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
	gradient.id = gradId;
	gradient.setAttribute('x1', "0%");
	gradient.setAttribute('y1', "0%");
	gradient.setAttribute('x2', "0%");
	gradient.setAttribute('y2', "100%");
	console.log(gradient);
	const stopTop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stopTop.setAttribute(svganOffset, "0%");
	stopTop.setAttribute(svganStyle, "stop-color:rgb(" + grad1Red + "," + grad1Green + "," + grad1Blue + ");stop-opacity:1");
	gradient.appendChild(stopTop);
	const stopBottom = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
	stopBottom.setAttribute(svganOffset, "100%");
	stopBottom.setAttribute(svganStyle, "stop-color:rgb(" + grad2Red + "," + grad2Green + "," + grad2Blue + ");stop-opacity:1");
	gradient.appendChild(stopBottom);
	gradientDef.appendChild(gradient);
	svgElem.appendChild(gradientDef);
}

// okrag wypelniony liniowym pionowym gradientem
function drawCircleWithVerticalGradient(svgElem, gradId, circleId, cX, cY, cR, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	console.log(svgElem);
	drawVerticalGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue);
	const kolo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	kolo.id = circleId;
	kolo.setAttribute(svganFill, "url(#" + gradId + ")");
	kolo.setAttribute('cx', cX);
	kolo.setAttribute('cy', cY);
	kolo.setAttribute('r', cR);
	console.log(kolo);
	svgElem.appendChild(kolo);
	return kolo;
}

// okrag wypelniony liniowym pionowym gradientem
function drawRectWithVerticalGradient(svgElem, gradId, rectId, x, y, width, height, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	console.log(svgElem);
	drawVerticalGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue);
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.id = rectId;
	rect.setAttribute(svganFill, "url(#" + gradId + ")");
	rect.setAttribute('x', x);
	rect.setAttribute('y', y);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	console.log(rect);
	svgElem.appendChild(rect);
	return rect;
}

// szesciokat wypelniony gradientem
function drawHexagonWithVerticalGradient(svgElem, gradId, hexId, cX, cY, cR, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue) {
	console.log(svgElem);
	drawVerticalGradientOnElement(svgElem, gradId, grad1Red, grad1Green, grad1Blue, grad2Red, grad2Green, grad2Blue);
	let pathD = pathDForHexagon(cX, cY, cR);
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = hexId;
	path.setAttribute(svganFill, "url(#" + gradId + ")");
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
	return path;
}

//operacje na okregu

//-------------------------------obrot figury o kat - poprzez obrot jej punktow o kat-----------------------------------
function rotateShape(cX, cY, pointsXYsMerged, angleAsPartOfFullCircleLength) {
	if (pointsXYsMerged !== undefined && Array.isArray(pointsXYsMerged) && pointsXYsMerged.length % 2 === 0) {
		const resultXYMerged = new Array();
		let len = pointsXYsMerged.length;
		let subresult = undefined;
		for (let i = 0; i < len; i += 2) {
			subresult = rotateByPartOfFullCircleLength(cX, cY, pointsXYsMerged[i], pointsXYsMerged[i+1], angleAsPartOfFullCircleLength);
			resultXYMerged.push(subresult[0], subresult[1]);
		}
		return resultXYMerged;
	} else {
		console.log("There were errors");
	}
}

//cX = center of rotation, X coordinate
//cY = center of rotation, Y coordinate
//ptrX = point to rotate, X coordinate
//ptrY = point to rotate, Y coordinate
// returns: point as Array from X & Y coordinates
function rotateByPartOfFullCircleLength(cX, cY, ptrX, ptrY, angleAsPartOfFullCircleLength) {
	let deltaX = ptrX - cX;
	let deltaY = ptrY - cY;
	let r = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	let sin = deltaX/r;
	let arc = Math.asin(sin);
	let arcDegreesOffset = arc / (2*π);
	//console.log("sin(" + deltaX + "/" + r + ") = " + sin + ";     arcsin(" + sin + ") = " + arc + ";    arcDegreesOffset = " + arcDegreesOffset);
	let factor = 1;
	let degrees = factor * angleAsPartOfFullCircleLength;
	let xPrim = rotateOnAxisX(degrees + arcDegreesOffset, r, cX);
	let yPrim = rotateOnAxisY(degrees + arcDegreesOffset, r, cY);
	return [ xPrim, yPrim ];
}

//delta - kat obrotu w stosunku do kata pelnego (czyli 360 stopni)
//r - promien
//dx - wspolrzedne srodka wielokata po osi X
function rotateOnAxisX(delta, r, dx) {
	let intAxisX = 1; // interpretacja osi X : o X jest zgodna (wartosci rosna gdy idziemy w prawo)
	let ysin = intAxisX * sin(delta * 2*π);
	let rysin = ysin * r;
	let result = rysin + dx;
	//console.log("rotateOnAxisX(delta=" + delta + ", r=" + r + ", dx=" + dx + ") -> y*sin=" + ysin + ", r*y*sin=" + rysin + ", result=" + result);
	return Math.round(result);
}

//delta - kat obrotu w stosunku do kata pelnego (czyli 360 stopni)
//r - promien
//dy - wspolrzedna srodka wielokata po osi Y
function rotateOnAxisY(delta, r, dy) {
	let intAxisY = -1; // interpretacja osi Y : o Y jest odwrcona (wartosci rosna gdy idziemy w dol)!
	let ycos = intAxisY * cos(delta * 2*π);
	let rycos = ycos * r;
	let result = rycos + dy; // bylo jeszcze + dy
	//console.log("rotateOnAxisY(delta=" + delta + ", r=" + r + ", dy=" + dy + ") -> y*cos=" + ycos + ", r*y*cos=" + rycos + ", result=" + result);
	return Math.round(result);
}

// strzalka wydarzenia
function drawArrow(svgElem, thunderId, thunderStyle, size) {
	let unit = size / 48;
	let points = new Array();
	points.push(19 * unit, 10 * unit);
	points.push(19 * unit, 25 * unit);
	points.push(14 * unit, 25 * unit);
	points.push(24 * unit, 39 * unit);
	points.push(34 * unit, 25 * unit);
	points.push(29 * unit, 25 * unit);
	points.push(29 * unit, 10 * unit);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = thunderId;
	path.setAttribute(svganStyle, thunderStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

// wyrafinowane ksztalty
function drawThunder(svgElem, thunderId, thunderStyle, size) {
	let unit = size / 12;
	let points = new Array();
	points.push(25/3 * unit, 8/3 * unit);
	points.push(19/3 * unit, 11/2 * unit);
	points.push(22/3 * unit, 7 * unit);
	points.push(11/3 * unit, 28/3 * unit);
	points.push(17/3 * unit, 13/2 * unit);
	points.push(14/3 * unit, 5 * unit);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = thunderId;
	path.setAttribute(svganStyle, thunderStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

function drawHeat(svgElem, heatId, heatStyle, size, offsetX) {
	let unit = size / 36;
	let points = new Array();
	points.push((18 + offsetX) * unit, 5 * unit);
	points.push((18 + offsetX) * unit, 16 * unit);
	points.push((22 + offsetX) * unit, 18 * unit);
	points.push((18 + offsetX) * unit, 31 * unit);
	points.push((18 + offsetX) * unit, 20 * unit);
	points.push((14 + offsetX) * unit, 18 * unit);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = heatId;
	path.setAttribute(svganStyle, heatStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
}

function drawTitanium(svgElem, heatId, heatStyle) {
	let points = new Array();
	points.push(400,167);
	points.push(478,292);
	points.push(622,328);
	points.push(526,441);
	points.push(537,589);
	points.push(400,533);
	points.push(263,589);
	points.push(274,441);
	points.push(178,328);
	points.push(322,292);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	drawPath(svgElem, heatId, heatStyle, pathD);
}

function drawSteel(svgElem, steelId, steelStyle) {
	let points = new Array();

	points.push(214, 277);
	points.push(214, 191);
	points.push(153, 227);
	points.push(153, 309);
	points.push(214, 336);
	points.push(199, 622);

	points.push(199 + 34 * 2, 622);
	points.push(214 + 19*2, 336);
	points.push(153 + (47+33)*2, 309);
	points.push(153 + (47+33)*2, 227);
	points.push(214 + 19*2, 191);
	points.push(214 + 19*2, 277);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	drawPath(svgElem, steelId, steelStyle, pathD);
}

function drawSteelHammer(svgElem, steelId, steelStyle) {
	let points = new Array();
	points.push(350, 227);
	points.push(350, 316);
	points.push(465, 316);
	points.push(453, 622);
	points.push(531, 622);
	points.push(519, 316);
	points.push(638, 316);
	points.push(585, 227);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	drawPath(svgElem, steelId, steelStyle, pathD);
}

function drawBuildingShape(svgElem, buildingId, buildingStyle, size) {
	let unit = size / 12;
	let points = new Array();
	points.push(6 * unit, 3 * unit);
	points.push(10 * unit, 5 * unit);
	points.push(10 * unit, 7 * unit);
	points.push(2 * unit, 7 * unit);
	points.push(2 * unit, 5 * unit);
	let pathD = new String("M " + points[0] + " " + points[1]);
	for (let lineI = 2; lineI < points.length; lineI += 2) {
		pathD = pathD.concat(" L " + points[lineI] + " " + points[lineI+1]);
	}
	pathD = pathD.concat(" Z");
	drawPath(svgElem, buildingId, buildingStyle, pathD);
}

//--------------------------------------------rysowanie Slonca!---------------------------------------------------------
function generateSingleRayOfSunPoints(cX, cY, rayFarthestMargin, rayHalfWidth, rayClosestToSunYMargin) {
	let result = new Array();
	result.push(cX, rayFarthestMargin);
	result.push(cX - rayHalfWidth, cY - rayClosestToSunYMargin);
	result.push(cX + rayHalfWidth, cY - rayClosestToSunYMargin);
	return result;
}

function drawSunWith8Rays(svgElem, sunId, sunRaysId, sunStyle, cX, cY, sunRadius, rayFarthestMargin, rayHalfWidth, rayClosestToSunYMargin) {
	let raysCount = 8;
	let singleRayPoints = generateSingleRayOfSunPoints(cX, cY, rayFarthestMargin, rayHalfWidth, rayClosestToSunYMargin);
	let rotatedRayPoints = undefined;
	let sunPathD = new String();
	for (let rayI = 0; rayI < raysCount; rayI++) {
		rotatedRayPoints = rotateShape(cX, cY, singleRayPoints, rayI / raysCount);
		sunPathD = sunPathD.concat(" M " + rotatedRayPoints[0] + " " + rotatedRayPoints[1]);
		sunPathD = sunPathD.concat(" L " + rotatedRayPoints[2] + " " + rotatedRayPoints[3]);
		sunPathD = sunPathD.concat(" L " + rotatedRayPoints[4] + " " + rotatedRayPoints[5]);
		sunPathD = sunPathD.concat(" L " + rotatedRayPoints[0] + " " + rotatedRayPoints[1]);
	}
	const sunPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	sunPath.id = sunRaysId;
	sunPath.setAttribute(svganStyle, sunStyle);
	sunPath.setAttribute(svganPathD, sunPathD);
	console.log("adding object:");
	console.log(sunPath);
	svgElem.appendChild(sunPath);
	drawCircle(svgElem, sunId, sunStyle, cX, cY, sunRadius);
}

// atom
function drawScience(svgElem, baseEllipseId, style, size) {
	const cX = 72 / 144 * size;
	const cY = 72 / 144 * size;
	const rX = 12 / 144 * size;
	const rY = 44 / 144 * size;

	drawCircle(svgElem, 'centralPoint', style, cX, cY, 6);
	drawEllipse(svgElem, baseEllipseId, style, cX, cY, rX, rY);
	useTransformRotate(svgElem, baseEllipseId, 60, cX, cY);
	useTransformRotate(svgElem, baseEllipseId, 120, cX, cY);
}

// atom
function drawVegetation(svgElem, style) {
	const pathTailDString = "M 258 468 Q 208 532 161 507 Q 182 621 281 504 Z";
	drawPath(svgElem, 'leafTailId', style, pathTailDString);

	const pathLeafDString = "M 633 267 Q 257 184 250 425 Q 256 496 315 529 Q 410 576 502 516 C 584 441 523 392 633 267 Z";
	drawPath(svgElem, 'leafBodyId', style, pathLeafDString);
}

// tlen
function drawOxygen(svgElem, oxygenFrontId, oxygenBackId, oxygenStyle, size) {
	const cX = 60 / 144 * size;
	const cY = 84 / 144 * size;
	const oxyRadius = 24 / 144 * size;

	drawCircle(svgElem, oxygenBackId, oxygenStyle, cX, cY, oxyRadius);
	drawCircle(svgElem, oxygenFrontId, oxygenStyle, cY, cX, oxyRadius);
}

function drawForest(svgElem, forestId, forestStyle) {
	let points = [];
	//points.push(329, 400);
	points.push(329, 400);
	points.push(307, 391); //L
	points.push(253, 432, 180, 394); //Q
	points.push(157, 316, 232, 310); //Q
	points.push(206, 193, 316, 223); //Q
	points.push(319, 161, 372, 162); //Q
	points.push(482, 173, 471, 309); //Q
	points.push(536, 362, 471, 403); //Q
	points.push(439, 417, 386, 398); //Q
	points.push(363, 503.5, 402, 609); //Q
	points.push(397, 614); //L
	points.push(364, 601, 331, 617); //Q
	points.push(327, 614.5, 323, 612); //Q
	points.push(346, 505.5, 327, 399); //Q
	 //Z

	let pathD = new String("M " + forestScaleX(points[0]) + " " + forestScaleY(points[1]));
	pathD.concat(" L " + forestScaleX(points[2]) + " " + forestScaleY(points[3]));
	for (let lineI = 4; lineI < 36; lineI += 4) {
		pathD = pathD.concat(" Q " + forestScaleX(points[lineI]) + " " + forestScaleY(points[lineI+1]) + " " + forestScaleX(points[lineI+2]) + " " + forestScaleY(points[lineI+3]));
	}
	console.log(`about to line to ${points[36]}, ${points[37]}`);
	pathD.concat(" L " + forestScaleX(points[36]) + " " + forestScaleY(points[37]));
	for (let lineI = 38; lineI < 50; lineI += 4) {
		pathD = pathD.concat(" Q " + forestScaleX(points[lineI]) + " " + forestScaleY(points[lineI+1]) + " " + forestScaleX(points[lineI+2]) + " " + forestScaleY(points[lineI+3]));
	}
	pathD.concat(" Z ");

	drawPath(svgElem, forestId, forestStyle, pathD);
}

function drawCity(svgElem, forestId, colorCity, colorMask, size) {
	const unit = size / 12;
	const u = 1/144 * size;
	const styleEmpty = `fill: none; stroke: ${colorCity}; stroke-width: ${unit * 1/8}`;
	const styleFilled = `fill: ${colorCity}`;
	const styleMask = `fill: ${colorMask}`;

	const cX = 72 * u;
	const cY = 72 * u;
	const r = 40 * u;

	drawCircle(svgElem, 'cityDomeId', styleEmpty, cX, cY, r);

	drawRect(svgElem, 'baseId', styleFilled, 30 * u, 72 * u, 84 * u, 6 * u);

	drawRect(svgElem, 'skyscraper01Id', styleFilled, 36 * u, 68 * u, 4 * u, 4 * u);
	drawRect(svgElem, 'skyscraper02Id', styleFilled, 42 * u, 66 * u, 4 * u, 6 * u);
	drawRect(svgElem, 'skyscraper03Id', styleFilled, 48 * u, 52 * u, 2 * u, 20 * u);
	drawRect(svgElem, 'skyscraper04Id', styleFilled, 52 * u, 50 * u, 4 * u, 22 * u);
	drawRect(svgElem, 'skyscraper05Id', styleFilled, 56 * u, 62 * u, 4 * u, 10 * u);
	drawRect(svgElem, 'skyscraper06Id', styleFilled, 51 * u, 68 * u, 23 * u, 6 * u);
	drawRect(svgElem, 'skyscraper07Id', styleFilled, 64 * u, 58 * u, 4 * u, 14 * u);
	drawRect(svgElem, 'skyscraper08Id', styleFilled, 70 * u, 44 * u, 4 * u, 28 * u);
	drawRect(svgElem, 'skyscraper09Id', styleFilled, 76 * u, 54 * u, 4 * u, 18 * u);
	drawRect(svgElem, 'skyscraper10Id', styleFilled, 82 * u, 60 * u, 4 * u, 12 * u);
	drawRect(svgElem, 'skyscraper11Id', styleFilled, 86 * u, 68 * u, 2 * u, 6 * u);
	drawRect(svgElem, 'skyscraper12Id', styleFilled, 90 * u, 60 * u, 8 * u, 12 * u);
	drawRect(svgElem, 'skyscraper13Id', styleFilled, 94 * u, 54 * u, 4 * u, 18 * u);
	drawRect(svgElem, 'skyscraper14Id', styleFilled, 100 * u, 66 * u, 4 * u, 6 * u);
	drawRect(svgElem, 'skyscraper15Id', styleFilled, 106 * u, 68 * u, 4 * u, 4 * u);

	drawRect(svgElem, 'maskId', styleMask, 30 * u, 78 * u, 84 * u, 36 * u);
}

function forestScaleX(value) {
	return (value * 1.2) - 10;
}

function forestScaleY(value) {
	return (value * 1.2) - 65;
}

// cale ksztalty
function drawEventCategoryIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#fee921';
	const colorArcPathBottom = '#fec82d';
	const colorGradientBottom = '#000';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleSymbolIcon = `fill: ${colorGradientBottom}; stroke: #000000; stroke-width: 12`;
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 255, 248, 0, 252, 153, 30);
	drawCircleFilledWithShading(gFillShad, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);
	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawArrow(gCircle, 'arrowId', styleSymbolIcon, globalSize);
}

// cale ksztalty
function drawCityCategoryIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorSymbol = '#000';
	const colorHexTop = '#b4b4b4';
	const colorHexBottom = '#6a6a6a';

	const styleConglArcPathTop = `fill: ${colorHexTop}`;
	const styleConglArcPathBottom = `fill: ${colorHexBottom}`;

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);


	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 196, 196, 196, 42, 42, 42);
	drawCircleFilledWithShading(gFillShad, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);
	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));

	drawCity(gCircle, 'outerGreenId', colorSymbol, colorHexBottom, globalSize);
}

// cale ksztalty
function drawEnergyCategoryIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#707';
	const colorArcPathBottom = '#505';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const thunderStyle = "fill: white; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 153, 0, 153, 51, 0, 51);
	drawCircleFilledWithShading(gFillShad, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);
	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawThunder(gCircle, 'thunderId', thunderStyle, globalSize);
}

function drawBuildingCategoryIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillLight = bodySVGLayer;
	let gFillShad = coverageSVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = 'rgb(169, 122, 78)';
	const colorArcPathBottom = 'rgba(67, 41, 24, 0.5)';
	const colorBuildingTop = 'rgb(81, 55, 38)';
	const colorGradientTop = 'rgb(149, 101, 64)';
	const colorGradientBottom = 'rgb(71, 44, 26)';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleCircleInner = "fill: " + colorArcPathTop;
	const buildingStyle = "fill: " + colorBuildingTop + "; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 149, 101, 64, 71, 44, 26);
	drawCircle(gCircle, 'innerCircleFilledId', styleCircleInner, globalSize/2, globalSize/2, (globalSize/2) - globalUnitSize);
	drawCircleFilledWithShading(gFillLight, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);
	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawBuildingShape(gCircle, 'buildingShapeId', buildingStyle, globalSize);
}

function drawSpaceCategoryIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#555';
	const colorArcPathBottom = '#222';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleSun = "fill: yellow";

	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 119, 119, 119, 34, 34, 34);
	drawCircleFilledWithShading(gFillShad, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);
	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4) );
	drawSunWith8Rays(gCircle, idCoreOfSun, idRaysOfSun, styleSun, globalSize/2, globalSize/2, globalUnitSize, 2*globalUnitSize, globalUnitSize/3, 4/3 * globalUnitSize);
}

function drawScienceIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleCircleInnerPastel = "fill: #eeeeee";
	const scienceStyle = "fill: none; stroke: #000000; stroke-width: 12";
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 255, 255, 255, 60, 60, 60);
	drawCircle(gFillShad, 'innerCircleFilledId', styleCircleInnerPastel, globalSize/2, globalSize/2, (globalSize/2) - globalUnitSize);

	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawScience(gCircle, 'baseEllipseId', scienceStyle, globalSize);
}

function drawOceanIcon() {
	let gVertGrad = backgroundSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;
	let gBorder = coverageSVGLayer;

	const colorDroplet = '#00566d';
	const colorDropletStroke = '#00adc9';
	const colorAntiHexagonBackground = '#646464';

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	const styleAntiHexagonBackground = "fill: " + colorAntiHexagonBackground;
	const styleDroplet = "fill: " + colorDroplet + "; stroke: " + colorDropletStroke + "; stroke-width: " + (globalUnitSize * 1/8);
	const styleWave = "fill: " + colorDroplet;

	const hexStyle = "fill: white; stroke: black; stroke-width: " + (globalUnitSize * 1/8);

	//drawHexagon(gCircle, idHex, hexStyle, globalSize/2, globalSize/2, globalSize/2);

	// top: rgb(123,175,210) #7bafd2  // 109, 191, 210 #6dbfd2
	// bottom: rgb(190, 204, 229) #becce5 // 189, 225, 229 #bde1e5
	drawHexagonWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 109, 191, 210, 189, 225, 229);

	//drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 153, 0, 153, 51, 0, 51);

	drawAntiHexagon(gBorder, 'antiHexagonBackgroundId', styleAntiHexagonBackground, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));
	drawHexagon(gBorder, 'outerHexagonEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));

	drawVerticalDroplet(gCircle, 'dropletGradId', 'dropletId', styleDroplet, 0, 173, 201, 0, 86, 109);
	drawWave(gFillShad, 'waveGradId', 'waveId', styleWave, 0, 86, 109, 0, 173, 201);
}

function drawOxygenIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleCircleInnerPastel = "fill: #dccb9b";
	const oxygenStyle = "fill: #ff0000; stroke: #aa0000; stroke-width: " + (globalUnitSize * 1/4);
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 255, 255, 255, 255, 255, 255); //grad2 = po 34
	drawCircle(gFillShad, 'innerCircleFilledId', styleCircleInnerPastel, globalSize/2, globalSize/2, (globalSize/2) - globalUnitSize);

	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawOxygen(gCircle, 'oxygenFrontId', 'oxygenBackId', oxygenStyle, globalSize);
}

function drawVegetationIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const colorArcPathTop = '#81b300';
	const colorArcPathBottom = '#58a400';
	const colorGradientBottom = '#229000';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleSymbolIcon = `fill: ${colorGradientBottom}; stroke: #000000; stroke-width: 12`;
	drawCircleWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 140, 196, 0, 44, 124, 44);
	drawCircleFilledWithShading(gFillShad, gFillShad, idConglArcPathTop, idConglArcPathBottom, globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawCircle(gCircle, 'outerCircleEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 4));
	drawVegetation(gCircle, styleSymbolIcon);
}

function drawForestIcon() {
	let gVertGrad = backgroundSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;
	let gBorder = coverageSVGLayer;

	const colorDroplet = '#00566d';
	const colorDropletStroke = '#00adc9';
	const colorAntiHexagonBackground = '#646464';

	const colorHexTop = '#00dd00';
	const colorHexBottom = '#00bb00';

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	const styleGreenOuterBlack = "fill: #008800; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	const styleAntiHexagonBackground = "fill: " + colorAntiHexagonBackground;
	const hexTopStyle = "fill: " + colorHexTop;
	const hexBottomStyle = "fill: " + colorHexBottom;

	const hexStyle = "fill: white; stroke: black; stroke-width: " + (globalUnitSize * 1/8);

	drawHexagonWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 0, 248, 0, 0, 137, 0);

	drawAntiHexagon(gBorder, 'antiHexagonBackgroundId', styleAntiHexagonBackground, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));
	drawHexagon(gBorder, 'outerHexagonEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));

	//drawHexagon(gFillShad, 'outerGreenHexagonEmptyId', styleGreenOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 2));
	drawHexagonDividedByArc(gFillShad, gFillShad, 'hexForestTopId', 'hexForestBottomId', hexTopStyle, hexBottomStyle, globalSize, globalUnitSize);
	drawForest(gBorder, 'outerGreenId', styleGreenOuterBlack);
}

function drawCityIcon() {
	let gVertGrad = backgroundSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;
	let gBorder = coverageSVGLayer;

	const colorAntiHexagonBackground = '#646464';

	const colorSymbol = '#000';
	const colorHexTop = '#b4b4b4';
	const colorHexBottom = '#6a6a6a';

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/8);
	const styleAntiHexagonBackground = "fill: " + colorAntiHexagonBackground;
	const hexTopStyle = "fill: " + colorHexTop;
	const hexBottomStyle = "fill: " + colorHexBottom;

	drawHexagonWithVerticalGradient(gVertGrad, idGradRing, idRing, globalSize/2, globalSize/2, globalSize/2, 196, 196, 196, 42, 42, 42);

	drawAntiHexagon(gBorder, 'antiHexagonBackgroundId', styleAntiHexagonBackground, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));
	drawHexagon(gBorder, 'outerHexagonEmptyId', styleCircleOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 16));

	//drawHexagon(gFillShad, 'outerGreenHexagonEmptyId', styleGreenOuterBlack, globalSize/2, globalSize/2, (globalSize/2) - (globalUnitSize / 2));
	drawHexagonDividedByArc(gFillShad, gFillShad, 'hexForestTopId', 'hexForestBottomId', hexTopStyle, hexBottomStyle, globalSize, globalUnitSize);
	drawCity(gBorder, 'outerGreenId', colorSymbol, colorHexBottom, globalSize);
}

function drawEnergyUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const color = 'rgb(153, 0, 153)'
	const colorArcPathTop = '#707';
	const colorArcPathBottom = '#505';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const thunderStyle = "fill: white; stroke: black; stroke-width: " + (globalUnitSize * 1/8);

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 153, 0, 153, 51, 0, 51);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	drawThunder(gCircle, 'thunderId', thunderStyle, globalSize);
}

function drawHeatUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#c00';
	const colorArcPathBottom = '#a00';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const heatStyle = "fill: yellow; stroke: black; stroke-width: " + (globalUnitSize * 1/8);

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 255, 0, 0, 109, 0, 0);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	drawHeat(gCircle, 'heat1Id', heatStyle, globalSize, -10);
	drawHeat(gCircle, 'heat2Id', heatStyle, globalSize, 0);
	drawHeat(gCircle, 'heat3Id', heatStyle, globalSize, 10);
}

function drawTitaniumUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#555';
	const colorArcPathBottom = '#222';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const titaniumStyle = "fill: none; stroke: yellow; stroke-width: " + (globalUnitSize * 2/3);

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 119, 119, 119, 34, 34, 34);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	drawTitanium(gCircle, 'titaniumId', titaniumStyle);
}

function drawSteelUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = 'rgb(169, 122, 78)';
	const colorArcPathBottom = 'rgb(149, 101, 64)';
	const colorGradientBottom = 'rgb(71, 44, 26)';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const steelStyle = "fill: " + colorGradientBottom + "; stroke: black; stroke-width: " + (globalUnitSize * 1/8);

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 149, 101, 64, 71, 44, 26);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	drawSteel(gCircle, 'steelId', steelStyle);
	drawSteelHammer(gCircle, 'steelHammerId', steelStyle);
}

function drawVegetationUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const colorArcPathTop = '#81b300';
	const colorArcPathBottom = '#58a400';
	const colorGradientBottom = '#229000';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleSymbolIcon = `fill: ${colorGradientBottom}; stroke: #005500; stroke-width: 12`;

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 140, 196, 0, 44, 124, 44);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	drawVegetation(gCircle, styleSymbolIcon);
}

function drawScienceUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorPlainSquare = '#eeeeee';
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const stylePlainSquare = "fill: " + colorPlainSquare;
	const scienceStyle = "fill: none; stroke: #000000; stroke-width: 12";

	const plainSquareMargin = globalUnitSize;
	const plainSquareBorderSize = globalSize - globalUnitSize *2;

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 255, 255, 255, 60, 60, 60);
	drawRect(gFillShad, 'plainSquareId', stylePlainSquare, plainSquareMargin, plainSquareMargin, plainSquareBorderSize, plainSquareBorderSize );

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );

	drawScience(gCircle, 'baseEllipseId', scienceStyle, globalSize);
}

function drawGraphics() {
	//drawEventCategoryIcon();
	//drawCityCategoryIcon();
	//drawEnergyCategoryIcon();
	//drawBuildingCategoryIcon();
	//drawSpaceCategoryIcon();

	//drawOxygenIcon();
	//drawVegetationIcon();
	//drawScienceIcon();

	//drawForestIcon();
	drawCityIcon();
	//drawOceanIcon();

	//drawEnergyUnitIcon();
	//drawHeatUnitIcon();
	//drawTitaniumUnitIcon();
	//drawSteelUnitIcon();
	//drawVegetationUnitIcon();

	//drawScienceUnitIcon();
}