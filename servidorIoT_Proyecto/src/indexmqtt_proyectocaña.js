let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://localhost');//PC
//let client = mqtt.connect('mqtt://ec2-18-206-56-233.compute-1.amazonaws.com:1883');//Server
const mysql = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
const { json } = require('express');
let url = "mongodb://localhost:27017/"; //PC
//let url ="mongodb://ec2-18-206-56-233.compute-1.amazonaws.com:27017/"//Server
let detectada;

client.on('connect', function () {
    client.subscribe('topico1', function (err) {
        if (err) {
            console.log("error en la subscripcion")
        }
    })
})


client.on('message', function (topic, message) {
    // message is Buffer
    json1 = JSON.parse(message.toString()); //de esta manera se convierte el mensaje recibido en un json
    temp = json1.datos_nodo.temperatura; //de esta manera se obtiene un valor asociado a una clave en el json
    co2 = json1.datos_nodo.concentracion;
    latitud = json1.datos_nodo.ubicacion.lat;
    longitud = json1.datos_nodo.ubicacion.lng;
    let today = new Date().toLocaleString('es-CO',{ timeZone: "America/Bogota" });
    let date = new Date(today);
    //zonas y horas programadas
    let program_zona = "zona_2";
    let program_fhI = new Date('2021-4-27 9:00:00 AM');
    let program_fhF = new Date('2021-4-27 7:00:00 PM');
    //////
    let idZona = asignarZona(latitud, longitud);
    let quema_detectada = detectarIncendio(co2, temp);
    let quema_controlada;
    if (detectada == 1) { quema_controlada = quemaControlada(idZona, date, program_zona, program_fhI, program_fhF); }

    console.log("estas son las horas de hoy " + date.getHours());

    //console.log(message.toString())

    // message is Buffer
    json1 = JSON.parse(message.toString());
    json1["fecha_hora"] = date;
    json1["id_zona"] = idZona;
    if (detectada == 1) { json1["alertas"] = { "quema_detectada": quema_detectada, "quema_controlada": quema_controlada } }
    else { json1["alertas"] = { "quema_detectada": quema_detectada } }



   

    console.log(json1);
    //client.publish('topico2', 'mensaje recibido')
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        dbo.collection("datosNodo").insertOne(json1, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });

        //client.end() //si se habilita esta opción el servicio termina

    })

})

function detectarIncendio(concentracion, temperatura) {
    let alerta = "";
    detectada = 0;
    if (temperatura > 500 && concentracion > 2500) {
        alerta = "Hay quema";
        detectada = 1;
    }
    else {
        alerta = "No hay quema";
    }
    return alerta;
}

function quemaControlada(Nodo_zona, Nodo_fechahora, Program_zona, Program_fechahoraI, Program_fechahoraF) {
    //ojo a esto con lo de las dos fechas para el sig corte xd
    let alerta = "";

    if (Nodo_zona == Program_zona && Nodo_fechahora.getDate() == Program_fechahoraI.getDate()
        && Nodo_fechahora.getFullYear() == Program_fechahoraI.getFullYear()
        && Nodo_fechahora.getMonth() == Program_fechahoraI.getMonth() &&
        Nodo_fechahora.getHours() >= Program_fechahoraI.getHours() && Nodo_fechahora.getHours() <= Program_fechahoraF.getHours()) {
        alerta = "Quema controlada";
    }
    else {
        alerta = "Quema no controlada";
    }



    return alerta;
}

function asignarZona(latitud, longitud) {

    let zona = "3";

    if (latitud >= 3.584063 && latitud < 3.586440 && longitud >= -76.282985 && longitud <= -76.280276) {
        zona = "zona_1";
        console.log("entro a zona 1");
    }
    else if (latitud >= 3.586440 && latitud <= 3.589096 && longitud >= -76.285764 && longitud < -76.282985) {
        zona = "zona_2";
        console.log("entro a zona 2");
    }
    return zona;
}

