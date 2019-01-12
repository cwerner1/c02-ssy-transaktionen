const Request = require('request');
const Helper = require('./helper');

function startTransaction(label, carNr, renter, amount) {
    console.log(label + ' wird gestartet mit carNr=' + carNr + ', renter=' + renter + ', amount=' + amount);
    Request.post({
        url: 'http://127.0.0.1:3000/coordinator/start_transaction',
        json: {
            carNr: carNr,
            renter: renter,
            amount: amount
        }
    }, transactionResponse);

    function transactionResponse(err, resp, body) {
        console.log(label + ' mit Status ' + resp.statusCode + ' durchgeführt');
        console.log(label + ' Body: ' + body);
        if (resp.statusCode == 409) {
            // nach 100ms nochmal probieren
            setTimeout(startTransaction, 100, label, carNr, renter, amount)
        }
    }
}

// alle drei Transaktionen sind letztlich erfolgreich
startTransaction('Transaktion 1', 1, 'Fiona Flott', 90);
startTransaction('Transaktion 2', 1, 'Rupert Renner', 110);
startTransaction('Transaktion 3', 1, 'Sofie Schnell', 95);

helper = new Helper('Datenbank');
helper.delay(1000, helper.showCarAndInvoice, 1, 1, 'Endergebnis');