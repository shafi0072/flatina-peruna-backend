const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://shafi:safi83351@cluster0.gmrnf.mongodb.net/Tienda?retryWrites=true&w=majority`;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('images'))
app.use(fileUpload());
const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});



function between() {  
    const MathFloor = Math.random() * 32000482224821;
    const pars = parseInt(MathFloor)
    const string = pars.toString()
    return string
  }

client.connect(err => {
    const collection = client.db("Tienda").collection("Products");
    const BuyerInfo = client.db("Signup").collection("BuyerInfo");
        const SubastasData = client
        .db("subastas")
        .collection("SubProducts");

    const TiendaCartProducts = client.db("Tienda").collection("Cart");

    // seller products upload start

    app.post('/tienda/postProducts', (req, res) => {
        const TiendaFile1 = req.files.File1;
        const TiendaFile2 = req.files.File2;
        const name = req.body.ProductsName;
        
        const description = req.body.Descipción;
        const price = req.body.price;
        const discount = req.body.discount;
        const ShippingFee = req.body.ShippingFee;
        const filePath = `${__dirname}/images/BN${TiendaFile1.md5}.jpeg`;
        const filePath2 = `${__dirname}/images/SN${TiendaFile2.md5}.jpeg`;
        console.log(name, TiendaFile1,"hello2",TiendaFile2, description, price, discount, ShippingFee,  between());
        TiendaFile1.mv(filePath, err => {
            if (err) {
                console.log('error')
                return res
                    .status(500)
                    .send({msg: error})
            }
        })
        TiendaFile2.mv(filePath2, err => {
            if (err) {
                console.log('error')
                return res
                    .status(500)
                    .send({msg: error})
            }
        })
        collection
                .insertOne({name, img:`BN${TiendaFile1.md5}`,img:`SN${TiendaFile2.md5}`, description, price,discount,ShippingFee, Key: between()})
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
    })
    app.get('/tiendaProducts', (req, res) => {
        collection
            .find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/findByID/:id', (req, res) => {

        collection
            .find({Key: req.params.id})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/cartforTienda', (req, res) => {
        const bodyZCart = req.body;
        console.log(bodyZCart);
        TiendaCartProducts.insertOne(bodyZCart)
        // .then(result => {
        //     res.send(result.insertedCount > 0)
        // })
        
    })


    // seller Products upload finish


    // signup for Buyer area start --->


    app.post('/signup', (req, res) => {
        const bodysFile = req.body
        console.log(bodysFile);
        BuyerInfo
        .insertOne(bodysFile)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
        
    });
    app.post('/login/buyer', (req, res) => {
        const bodyLog = req.body
        console.log(bodyLog);
        BuyerInfo.find(bodyLog)
        .toArray((err, document) => {
            if(document){
               res.send(document);
               console.log("it's working", document);
            }else{
                res.send(err)
                console.log("it's wrong", err);
            }
        })
    })
    


    // signup for Buyer area finished <--





    // subastas stamp Upload start

    app.post('/subastas/stamp', (req, res) => {
        const files2 = req.files.file;
        const email = req.body.email;
        const name = req.body.Nombre;
        const years = req.body.Año;
        const MNH = req.body.MNH;
        const MINT = req.body.MINT;
        const Usado = req.body.Usado;
        const sobre = req.body.sobre;
        const Origen = req.body.Origen;
        const No = req.body.No;
        const Si = req.body.Si;
        const Descipción = req.body.Descipción;
        const Ingresos = req.body.Ingresos;
        const Precio = req.body.Precio
        const filePath2 = `${__dirname}/images/BN${files2.md5}.jpeg`;
        console.log(name, years, MNH, MINT, Usado, sobre, Origen, No, Si, Descipción, Ingresos, Precio, files2);

        files2.mv(filePath2, err => {
            if (err) {
                console.log('error')
                return res
                    .status(500)
                    .send({msg: error})
            }
            SubastasData
                .insertOne({name, email, img:`BN${files2.md5}`, Descipción, Key: between(), years, MNH, MINT, Usado, sobre, Origen, No, Si, Ingresos, Precio})
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
        })
        

    })
    app.get('/subastasProducts', (req, res) => {
        SubastasData.find({})
        .toArray((err, documents) => {
            if(documents){
                res.send(documents)
                console.log('its working', documents);
            }
            else{
                res.send(err, 'its error');
                console.log('its error');
            }
        })
    })

    // subastas stam Upload finish

})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('This is server port')
});