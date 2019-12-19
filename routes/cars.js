const express = require('express');
const router = express.Router();
const db = require('../src/database');
const Car = require('../src/Car');

router.post('/', newCar);
router.get('/', listAllCars);
router.get('/:carNr', getCar);
router.patch('/:carNr/renter', updateRenter);

router.post('/prepare', prepare);
// die /commit- und /cancel-Nachrichten müssen nun auch die Car-Nummer enthalten,
// da wir sonst nicht wissen, welche Transaktion comitted bzw. abgebrochen werden soll
router.post('/commit/:carNr', commit);
router.post('/cancel/:carNr', cancel);



let carCollection = db.getCollection('cars');

function newCar(request, response) {
    let car = new Car(
        request.body.brand,
        request.body.model,
        request.body.color,
        request.body.renter
    );
    carCollection.insert(car);
    response.json(car);
}

function listAllCars(request, response) {
    response.json(carCollection.find());
}

function getCar(request, response) {
    let car = carCollection.get(request.params.carNr);
    response.json(car);
}

function updateRenter(request, response) {
    let car = carCollection.get(request.params.carNr);
    car.setRenter(request.body.renter);
    carCollection.update(car);

    response.json(car);
}

// Umstellen auf Locking je Car: Objekte, statt einfache Variable
let in_transaction = {};
// let transaction_carNr = {}; // wird nicht mehr benötigt, da carNr bereits Teil von commit/cancel-Nachricht
let transaction_renter = {};

function prepare(req, resp) {
    // { carNr: 2, renter: "Frida Flink" }
    let carNr = req.body.carNr;

    if (in_transaction[carNr] === true) {
        resp.status(409).end();
        return;
    }
    in_transaction[carNr] = true;
    transaction_renter[carNr] = req.body.renter;
    resp.status(200).end();
}

function commit(req, resp) {
    // parseInt(), da req.params immer Strings sind, für collection.get() aber String "3" !==  Int 3
    // (und initial wird Record mit CarNr als Integer angelegt)
    let carNr = parseInt(req.params.carNr);
    let car = carCollection.get(carNr);
    car.setRenter(transaction_renter[carNr]);
    carCollection.update(car);
    in_transaction[carNr] = false;
    resp.status(200).end();
}

function cancel(req, resp) {
    let carNr = parseInt(req.params.carNr);
    in_transaction[carNr] = false;
    resp.status(200).end();
}

module.exports = router;
