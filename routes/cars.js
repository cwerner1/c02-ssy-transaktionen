const express = require('express');
const router = express.Router();
const db = require('../src/database');
const Car = require('../src/Car');

router.post('/', newCar);
router.get('/', listAllCars);
router.get('/:carNr', getCar);
router.patch('/:carNr/renter', updateRenter);

router.post('/prepare', prepare);
router.post('/commit', commit);
router.post('/cancel', cancel);


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

let in_transaction = {};
let transaction_carNr = {};

function prepare(req, resp) {
    // { carNr: 2, renter: "Frida Flink" }

    if ( in_transaction[req.body.carNr] ) {
        resp.status(409).end();
        return;
    }
    in_transaction[req.body.carNr] = true;
    transaction_carNr[req.body.carNr] = req.body.renter;
    resp.status(200).end();
}

function commit(req, resp) {
    let car = carCollection.get(req.body.carNr);
    car.setRenter(transaction_carNr[req.body.carNr]);
    carCollection.update(car);
    in_transaction[req.body.carNr] = false;
    resp.status(200).end();
}

function cancel(req, resp) {
    in_transaction[req.body.carNr] = false;
    resp.status(200).end();
}

module.exports = router;
