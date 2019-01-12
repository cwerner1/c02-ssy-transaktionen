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


let in_transaction = false;
let transaction_invoiceNr = 0;
let transaction_person = "";
let transaction_amount = 0;

function prepare(req, resp) {
    // { invoiceNr: 2, person: "Frida Flink", amount: 190 }

    if (in_transaction) {
        resp.status(409).end();
        return;
    }
    in_transaction = true;
    transaction_invoiceNr = req.body.invoiceNr;
    transaction_person = req.body.person;
    transaction_amount = req.body.amount;
    resp.status(200).end();
}

function commit(req, resp) {
    let invoice = invoiceCollection.get(transaction_invoiceNr);
    invoice.update({
        person: transaction_person,
        amount: transaction_amount
    });

    invoiceCollection.update(invoice);
    in_transaction = false;
    resp.status(200).end();
}

function cancel(req, resp) {
    in_transaction = false;
    resp.status(200).end();
}

module.exports = router;
