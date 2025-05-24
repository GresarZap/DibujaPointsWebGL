#version 300 es
uniform mat4 uMatrizProyeccion;
layout(location = 0) in vec2 aVertices;
uniform float uPointSize;

void main() {
    gl_Position = uMatrizProyeccion * vec4(aVertices, 0.0, 1.0);
    gl_PointSize = 1.0;
}
