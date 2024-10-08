const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');

// Configuración del servidor MQTT
const mqttClient = mqtt.connect('mqtt://localhost:1883');  // Ajusta según tu configuración
mqttClient.on('connect', () => {
    console.log('Conectado al broker MQTT');
});

// Configuración de HTTPS
const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

const app = express();
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

app.post('/command', (req, res) => {
    const command = req.body.command.toLowerCase();

    if (removeAccents(command).includes('jeffrey llamar emergencias')) {
        mqttClient.publish('recovoz/llamada_emergencia', 'true');
    } else if (removeAccents(command).includes('jeffrey desconectar alarma')) {
        mqttClient.publish('recovoz/desconectar_alarma', 'false');
    } else if (removeAccents(command).includes('jeffrey conectar alarma')) {
        mqttClient.publish('recovoz/conectar_alarma', 'true');
    } else if (removeAccents(command).includes('jeffrey encender salon frio')) {
        mqttClient.publish('recovoz/encender_salon1_frio', '000000FF00');
    } else if (removeAccents(command).includes('jeffrey encender salon')) {
	mqttClient.publish('recovoz/encender_salon1', 'ON');
    } else if (removeAccents(command).includes('jeffrey apagar salon')) {
	mqttClient.publish('recovoz/apagar_salon1', 'OFF');
    } else if (removeAccents(command).includes('jeffrey salon al 25%')) {
        mqttClient.publish('recovoz/salon1_X%', '25');
    } else if (removeAccents(command).includes('jeffrey salon al 50%')) {
        mqttClient.publish('recovoz/salon1_X%', '50');
    } else if (removeAccents(command).includes('jeffrey salon al 75%')) {
        mqttClient.publish('recovoz/salon1_X%', '75');
    } else if (removeAccents(command).includes('jeffrey salon al 100%')) {
	mqttClient.publish('recovoz/salon1_X%', '100')};

    res.send('Comando recibido');
});

// Crear el servidor HTTPS
https.createServer(options, app).listen(3000, () => {
    console.log('Servidor web escuchando en https://localhost:3000');
});

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
