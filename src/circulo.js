export class Circulo {
    constructor(gl, radio, h = 0, k = 0) {

        /**
         *             3      2
         *             
         *       4                  1
         *        	
         *    5                         0
         *    
         *       6                  9
         *        
         *             7      8		
         */

        /* Las coordenadas cartesianas (x, y) */
        var vertices = [];
        this._color = [1.0, 0.0, 0.0, 1.0];
        this._h = h;
        this._k = k;
        this._radio = radio;

        /* Lee los vértices (x,y) y colores (r,g,b,a) */
        for (var i = 0; i < 360; i++) {
            vertices.push(this._h + this._radio * Math.cos(i * Math.PI / 180));
            vertices.push(this._k + this._radio * Math.sin(i * Math.PI / 180));
        }

        /* Se crea el objeto del arreglo de vértices (VAO) */
        this.circuloVAO = gl.createVertexArray();

        /* Se activa el objeto */
        gl.bindVertexArray(this.circuloVAO);


        /* Se genera un nombre (código) para el buffer */
        var codigoVertices = gl.createBuffer();

        /* Se asigna un nombre (código) al buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);

        /* Se transfiere los datos desde la memoria nativa al buffer de la GPU */
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        /* Se habilita el arreglo de los vértices (indice = 0) */
        gl.enableVertexAttribArray(0);

        /* Se especifica los atributos del arreglo de vértices */
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


        /* Se desactiva el objeto del arreglo de vértices */
        gl.bindVertexArray(null);

        /* Se deja de asignar un nombre (código) al buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }

    dibuja(gl, llenado, uColor) {

        /* Se activa el objeto del arreglo de vértices */
        gl.bindVertexArray(this.circuloVAO);
        gl.uniform4f(uColor, this._color[0], this._color[1], this._color[2], this._color[3]);
        /* Se renderiza las primitivas desde los datos del arreglo */
        gl.drawArrays((llenado) ? gl.TRIANGLE_FAN : gl.LINE_LOOP, 0, 360);

        /* Se desactiva el objeto del arreglo de vértices */
        gl.bindVertexArray(null);

    }

    set color(value) {
        this._color = value;
    }

    get radio() {
        return this._radio;
    }

    get h() {
        return this._h;
    }

    get k() {        
        return this._k;
    }

    static distancia(x0, y0, x1, y1) {
        return (x1 - x0) ** 2 + (y1 - y0) ** 2;
    }

    static pointInCircle(x0, y0, x1, y1, radius) {
        console.log(x0, y0, x1, y1, radius);
        return this.distancia(x0, y0, x1, y1) < radius ** 2;
    }
}