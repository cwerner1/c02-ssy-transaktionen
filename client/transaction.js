const Request = require('request');
const Helper = require('./helper');

// Transaktion durchführen
Request.post({
    url: 'http://127.0.0.1:3000/coordinator/start_transaction',
    json: {
        renter: "Sigi Sauser",
        carNr: 1,
        amount: 120
    }
}, transactionResponse);

function transactionResponse(err, resp, body) {
    console.log('Transaktion mit Status ' + resp.statusCode + ' durchgeführt');
    console.log(body);

    helper = new Helper('Transaktion 1');
    helper.showCarAndInvoice(1, 1, 'Resultat');
}
