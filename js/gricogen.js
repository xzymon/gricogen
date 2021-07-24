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

//drawGridOfRowsAndColumns(effectsSVGLayer, 0, 0, globalWidth, globalHeight, styleGrid, globalUnitsCount, globalUnitsCount);
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

// rysowanie okregu
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

function drawBuildingShape(svgElem, thunderId, thunderStyle, size) {
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
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.id = thunderId;
	path.setAttribute(svganStyle, thunderStyle);
	path.setAttribute(svganPathD, pathD);
	console.log("adding object:");
	console.log(path);
	svgElem.appendChild(path);
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

// tlen
function drawOxygen(svgElem, oxygenFrontId, oxygenBackId, oxygenStyle, size) {
	const cX = 60 / 144 * size;
	const cY = 84 / 144 * size;
	const oxyRadius = 24 / 144 * size;

	drawCircle(svgElem, oxygenBackId, oxygenStyle, cX, cY, oxyRadius);
	drawCircle(svgElem, oxygenFrontId, oxygenStyle, cY, cX, oxyRadius);
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

function drawOceanCategoryIcon() {
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

function drawHexCategoryIcon() {
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

function drawUnitIcon() {
	let gVertGrad = coreSVGLayer;
	let gFillShad = bodySVGLayer;
	let gCircle = outfitSVGLayer;

	const colorArcPathTop = '#555';
	const colorArcPathBottom = '#222';
	const styleConglArcPathTop = "fill: " + colorArcPathTop + "; stroke: " + colorArcPathTop + "; stroke-width: 1";
	const styleConglArcPathBottom = "fill: " + colorArcPathBottom + "; stroke: " + colorArcPathBottom + "; stroke-width: 1";
	const styleCircleOuterBlack = "fill: none; stroke: black; stroke-width: " + (globalUnitSize * 1/2);
	const styleOxygen = "fill: red";

	const margin = globalUnitSize / 4 ;
	const borderSize = globalSize - globalUnitSize / 2;

	drawRectWithVerticalGradient(gVertGrad, idGradRing, idRing, 0, 0, globalSize, globalSize, 119, 119, 119, 34, 34, 34);
	drawSquareDividedByArc(gFillShad, gFillShad, 'filledSquareTopId', 'filledSquareBottomId', globalSize, globalUnitSize, styleConglArcPathTop, styleConglArcPathBottom);

	drawRect(gCircle, 'outerRectEmptyId', styleCircleOuterBlack, margin, margin, borderSize, borderSize );
	// your shape
}

function drawGraphics() {
	//drawEnergyCategoryIcon();
	//drawBuildingCategoryIcon();
	//drawSpaceCategoryIcon();
	//drawOceanCategoryIcon();

	drawOxygenIcon();

	//drawUnitIcon();
}