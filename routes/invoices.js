const express = require('express');
const router = express.Router();
const db = require('../src/database');
const Invoice = require('../src/Invoice');

router.post('/', newInvoice);
router.get('/', listAllInvoices);
router.get('/:invoiceNr', getInvoice);
router.put('/:invoiceNr', updateInvoice);

router.post('/prepare', prepare);
router.post('/commit', commit);
router.post('/cancel', cancel);


let invoiceCollection = db.getCollection('invoices');

function newInvoice(request, response) {
    let invoice = new Invoice(
        request.body.person,
        request.body.amount
    );
    invoiceCollection.insert(invoice);
    response.json(invoice);
}

function listAllInvoices(request, response) {
    response.json(invoiceCollection.find());
}

function getInvoice(request, response) {
    let invoice = invoiceCollection.get(request.params.invoiceNr);
    response.json(invoice);
}

function updateInvoice(request, response) {
    let invoice = invoiceCollection.get(request.params.invoiceNr);
    invoice.update(request.body);
    invoiceCollection.update(invoice);

    response.json(invoice);
}


let in_transaction = {};
let transaction_person = {};
let transaction_amount = {};

function prepare(req, resp) {
    // { invoiceNr: 2, person: "Frida Flink", amount: 190 }

    if (in_transaction[req.body.invoiceNr]) {
        resp.status(409).end();
        return;
    }
    in_transaction[req.body.invoiceNr] = true;
    transaction_person[req.body.invoiceNr] = req.body.person;
    transaction_amount[req.body.invoiceNr] = req.body.amount;
    resp.status(200).end();
}

function commit(req, resp) {
    let invoice = invoiceCollection.get(req.body.invoiceNr);
    invoice.update({
        person: transaction_person[req.body.invoiceNr],
        amount: transaction_amount[req.body.invoiceNr]
    });

    invoiceCollection.update(invoice);
    transaction_person[req.body.invoiceNr] = null
    transaction_amount[req.body.invoiceNr] = null;
    in_transaction[req.body.invoiceNr] = false;
    resp.status(200).end();
}

function cancel(req, resp) {
    transaction_person[req.body.invoiceNr] = null
    transaction_amount[req.body.invoiceNr] = null;
    in_transaction[req.body.invoiceNr] = false;
    resp.status(200).end();
}

module.exports = router;
