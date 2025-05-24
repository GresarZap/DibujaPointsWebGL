export async function loadFile(path) {
    try {

        let url = buildUrl(path);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al cargar el archivo: ' + url);
        }
        
        return response.text();  // Devuelve el contenido del archivo como texto
    } catch (error) {
        console.error('Error al cargar el archivo: ', error);  // Muestra el error en consola
    }
}


function buildUrl(path) {
    const baseUrl = window.location.origin; // Obtiene la URL base (dominio + puerto)
    const shaderUrl = new URL(path, baseUrl); // Construye la URL completa
    return shaderUrl.href; // Devuelve la URL completa
}