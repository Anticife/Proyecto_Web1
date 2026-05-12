const express = require ('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>!Hola Mundo</h1><p>Bienvenida al cachon de Juanse.</p>');
});

app.listen(port, () => {
    console.log('servidor web activo. Entra a http://localhost:${port} desde tu navegador.');
});