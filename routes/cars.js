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

let in_transaction = false;
let transaction_carNr = 0;
let transaction_renter = "";

function prepare(req, resp) {
    // { carNr: 2, renter: "Frida Flink" }

    if (in_transaction) {
        resp.status(409).end();
        return;
    }
    in_transaction = true;
    transaction_carNr = req.body.carNr;
    transaction_renter = req.body.renter;
    resp.status(200).end();
}

function commit(req, resp) {
    let car = carCollection.get(transaction_carNr);
    car.setRenter(transaction_renter);
    carCollection.update(car);
    in_transaction = false;
    resp.status(200).end();
}

module.exports = router;
