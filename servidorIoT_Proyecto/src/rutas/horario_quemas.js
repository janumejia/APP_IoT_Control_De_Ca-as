const { Router } = require('express');
const router = Router();
const mysql = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

router.get('/datosm', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        dbo.collection("datosHorario").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

module.exports = router;

router.post('/datosm', (req, res) => {

    console.log(req.body);
    var json2 = req.body;

    let diaP = "24";
    let mesP = "04";
    let añoP = "2021";
    let horaIP = "9:00:00 AM";
    let horaFP = "5:00:00 PM";
    let zonaP = "zona_2";

    let f = "'" + añoP + '-' + mesP + '-' + diaP + ' ' + horaIP + "'";

    let fechaInicialP = new Date(añoP + '-' + mesP + '-' + diaP + ' ' + horaIP);
    let fechaFInalP = new Date(añoP + '-' + mesP + '-' + diaP + ' ' + horaFP);


    json2["HorasP"] = {
        "fechaInicialP": fechaInicialP,
        "fechaFInalP": fechaFInalP
    };
    json2["ZonaP"] = zonaP;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        dbo.collection("datosHorario").insertOne(json2, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.send("dato insertado");
});


router.delete('/datosm/delete/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    console.log(id);
    mongo = require('mongodb');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        //console.log(query);
        var query = { _id: new mongo.ObjectId(id) };
        console.log(query);
        dbo.collection("datosHorario").deleteOne(query, function (err, res) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
    res.send("dato eliminado");
});


router.delete('/datosm/delete', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        //console.log(query);
        var query = {};
        console.log(query);
        dbo.collection("datosHorario").deleteMany(query, function (err, res) {
            if (err) throw err;
            console.log("All documents deleted");
            db.close();
        });
    });
    res.send("datos eliminados");
});


router.put('/datosm/put/:id', (req, res) => {
    var id = req.params.id; //recogemos el parámetro enviado en la url
    mongo = require('mongodb');
    let diaP = "23";
    let mesP = "05";
    let añoP = "2021";
    let horaIP = "9:00:00 AM";
    let horaFP = "4:00:00 PM";
    let zonaP = "zona_34";

    let f = "'" + añoP + '-' + mesP + '-' + diaP + ' ' + horaIP + "'";

    let fechaInicialP = new Date(añoP + '-' + mesP + '-' + diaP + ' ' + horaIP);
    let fechaFInalP = new Date(añoP + '-' + mesP + '-' + diaP + ' ' + horaFP);


    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        //console.log(query);
        var query = {};
        console.log(query);
        dbo.collection("datosHorario").updateOne({ _id: new mongo.ObjectId(id) },
            {
                $set: {
                    "HorasP": {
                        "fechaInicialP": fechaInicialP,
                        "fechaFInalP": fechaFInalP
                    },
                    "ZonaP": zonaP
                }
            }
            , function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        res.send("dato actualizado");
    });

});



