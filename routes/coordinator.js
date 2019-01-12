const express = require('express');
const router = express.Router();
const Request = require('request');

router.post('/start_transaction', startTransaction);

function startTransaction(req, resp) {
    /* { carNr: 7,
         renter: "Frida Flink",
         amount: 190
       }
     */
    Request.post({
        url: 'http://127.0.0.1:3000/cars/prepare',
        json: {
            carNr: req.body.carNr,
            renter: req.body.renter
        }
    }, carResponse);

    function carResponse(err, resp, body) {
        Request.post({
            url: 'http://127.0.0.1:3000/invoices/prepare',
            json: {
                invoiceNr: req.body.carNr,
                person: req.body.renter,
                amount: req.body.amount
            }
        }, invoiceResponse);
    }

    function invoiceResponse(err, resp, body) {
        Request.post({
            url: 'http://127.0.0.1:3000/cars/commit',
            json: true
        });
        Request.post({
            url: 'http://127.0.0.1:3000/invoices/commit',
            json: true
        });
    }

}



module.exports = router;