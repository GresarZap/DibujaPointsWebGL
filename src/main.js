import { loadFile } from "../utils/load_file.js";
import { Circulo } from "./circulo.js";
import { ortho } from "./mat4.js";

let gl;
let shaderDeVertice;
let shaderDeFragmento;
let programaID;
let uColor;
let uPointSize;
let imgData;
let vertices = [];
let pointVAO;
let canvas;

let MatrizProyeccion = new Array(16);
let uMatrizProyeccion;

let MatrizModelo = new Array(16);
let uMatrizModelo;

async function main() {
    console.log('leyendo archivo...');
    const imgDataText = await loadFile('pixel_data.json');
    console.log('archivo leido');
    imgData = await JSON.parse(imgDataText);

    iniWebgl();
    await creaShader();
    vinculaShader();
    background([0, 0, 0, 1]);
    proyeccion(0, imgData.dimensions.width, imgData.dimensions.height, 0, -1, 1);
    variablesUniform();

    cargarDatos();
    dibujar();
}

function iniWebgl() {
    // 2. Inicializacion de webgl
    canvas = document.getElementById("webglcanvas");
    resizeCanvas();
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("WebGL 2.0 no es compatible con este navegador.");
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

async function creaShader() {
    // 3. Creacion de Shaders
    // Shader Vertex
    shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
    const vertexCode = await loadFile('../shaders/shader.vert');
    gl.shaderSource(shaderDeVertice, vertexCode.trim());
    gl.compileShader(shaderDeVertice);

    if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeVertice));
    }

    // Shader Fragment
    shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
    const fragCode = await loadFile('../shaders/shader.frag');
    gl.shaderSource(shaderDeFragmento, fragCode.trim());
    gl.compileShader(shaderDeFragmento);

    if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeFragmento));
    }
}

function vinculaShader() {
    programaID = gl.createProgram();

    gl.attachShader(programaID, shaderDeVertice);
    gl.attachShader(programaID, shaderDeFragmento);
    gl.linkProgram(programaID);

    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(programaID));
    }

    gl.useProgram(programaID);

    return programaID;
}

function cargarDatos() {
    // 5. Carga de datos en los buffers
    cargarVertices();
    console.log('cargando datos al buffer...');
    pointVAO = gl.createVertexArray();
    gl.bindVertexArray(pointVAO);

    const codigoVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    console.log('datos cargados al buffer');

    return pointVAO;
}

function cargarVertices() {
    console.log('cargando vertices...');
    for (let i = 0; i < imgData.pixels.length; i++) {
        vertices.push(imgData.pixels[i].x);
        vertices.push(imgData.pixels[i].y);
    }
    console.log('vertices cargados');
}

function background(bg) {
    // 6. Configuración del color de limpieza
    gl.clearColor(...bg);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function variablesUniform() {
    // 7. Configuración de valores uniform
    uColor = gl.getUniformLocation(programaID, "uColor");
    uPointSize = gl.getUniformLocation(programaID, "uPointSize");
}

function proyeccion(left, right, bottom, top, near, far) {
    // 7.1 Transformacion

    const uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
    ortho(MatrizProyeccion, left, right, bottom, top, near, far);
    gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);
}

function dibujar() {
    console.log('dibujando...');
    gl.bindVertexArray(pointVAO);
    for (let i = 0; i < imgData.pixels.length; i++) {
        gl.uniform4f(uColor, imgData.pixels[i].red, imgData.pixels[i].green, imgData.pixels[i].blue, 1);
        gl.drawArrays(gl.POINTS, i, 1);
    }
    gl.bindVertexArray(null);
    console.log('dibujo terminado');
}

function resizeCanvas() {
    canvas.width = imgData.dimensions.width;
    canvas.height = imgData.dimensions.height;

    void canvas.offsetHeight; // Forzar reflow

}

window.onload = main;