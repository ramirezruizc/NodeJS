const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Configura la IP del ESP32-CAM
const ESP32_IP = 'http://192.168.1.100';

// Ruta para ver el stream de la cámara
app.get('/stream', (req, res) => {
  axios({
    method: 'get',
    url: `${ESP32_IP}/stream`,
    responseType: 'stream'
  })
  .then(response => {
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
    response.data.pipe(res);
  })
  .catch(error => {
    console.error('Error al obtener el stream:', error);
    res.status(500).send('Error al obtener el stream');
  });
});

// Ruta para capturar una imagen bajo demanda
app.get('/capture', (req, res) => {
  axios({
    method: 'get',
    url: `${ESP32_IP}/capture`,
    responseType: 'arraybuffer'
  })
  .then(response => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="captura.jpg"');
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error al capturar la imagen:', error);
    res.status(500).send('Error al capturar la imagen');
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

