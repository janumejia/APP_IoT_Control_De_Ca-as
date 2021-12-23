const { Router } = require('express');
const router = Router();
const mysql = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/datosnodo', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DB_ManuelitaCañas");
        dbo.collection("datosNodo").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

router.get('/datosnodo/:id_zona', (req, res) => { 

    let idZona = req.params.id_zona; //recogemos el parámetro enviado en la url
  
    const query = {
         "id_zona": idZona
    };
    //console.log(query);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("DB_ManuelitaCañas");
      dbo.collection("datosNodo").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });
    });
});


router.get('/datosnodo/:id_zona/:id_nodo', (req, res) => {
    let idZona = req.params.id_zona;  //recogemos el parámetro enviado en la url
    let idNodo = req.params.id_nodo;
  
    const query = {
      'id_zona': idZona,
      'id_nodo': parseInt(idNodo) 
    }; 

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("DB_ManuelitaCañas");
      dbo.collection("datosNodo").find(query).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });
    });
  });


    module.exports = router; 