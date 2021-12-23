//Necesario para cifrar las contraseñas
const bcryptjs = require("bcryptjs");

const { Router, query } = require('express');
const router = Router();
const mysql = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

//CONSULTAR TODOS LOS USUARIOS
router.get('/usuarios', (req, res) => {
    const query = {};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DB_UsuariosEmpresasCañas");
        dbo.collection("usuarios").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});

//AGREGAR UN USUARIO
router.post('/usuarios', async(req, res) => {
    console.log(req.body);
    var json = req.body;

    //Funcion para encontrar cifrar la contraseña
    //Debemos ejecutar: 'npm i express bcryptjs nodemon'
    json.password = await bcryptjs.hash(json.password, 8);
    //Para comparar se usa:
    // let compare = bcryptjs.compareSync(json.contraseña, hashAComparar);


    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DB_UsuariosEmpresasCañas");
        dbo.collection("usuarios").insertOne(json, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});


//ELIMINAR DOCUMENTO
router.delete('/usuarios/:id', (req, res) => {
    console.log(" Entró ");
    var id = req.params.id;
    const query = {
        '_id': id
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DB_UsuariosEmpresasCañas");
        console.log(query);
        dbo.collection("usuarios").deleteOne(query, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result);
            db.close();
        });
    });
});


//INICIAR SESIÓN
router.get('/compare/:id/:contrasena', (req, res) => {
    var id = req.params.id;
    var contraRecibida = req.params.contrasena;

    const query = {
        '_id': id
    };

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DB_UsuariosEmpresasCañas");
        dbo.collection("usuarios").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);

            // Comparacion del hash de la contraseña
            let contraBD = result[0].password;
            let compare = bcryptjs.compareSync(contraRecibida, contraBD);

            if (compare) {
                res.json({ status: 'OK', username: result[0].nombre });
            } else {
                res.json('NO');
            }
            db.close();
        });
    });
});



//MODIFICAR UN USUARIO
// router.put('/usuarios/:id/:nombre/:apellido/:empresa/:contrasena', (req, res) => {
router.put('/usuarios/:id', (req, res) => {
    // console.log(" Entró ");
    var json = req.body;
    console.log(json);
    var miMapa = new Map();

    let id = req.params.id;

    miMapa.set("nombre", json.nombre);
    miMapa.set("apellido", json.apellido);
    miMapa.set("empresa", json.empresa);
    miMapa.set("contraseña", json.contraseña);

    const query = { '_id': id }
    let ajuste = {}

    for (var [clave, valor] of miMapa) {
        if (valor != undefined) {
            ajuste[clave] = valor;
            //console.log(clave + " = " + valor);
        }
    }
    console.log(query);
    console.log(ajuste);

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DB_EmpresasCañas");
        dbo.collection("usuarios").updateOne(query, {
            $set: ajuste
        }, function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});



module.exports = router;