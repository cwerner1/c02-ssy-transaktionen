const Invoice = require('../src/Invoice');
const Helper = require('./helper');

///////////////////////////////////////
// "Prozess 1"

let prozess1 = new Helper("Prozess 1");
prozess1.delay(
    10, prozess1.updateRenter,
    2, 'Frida Flink',
    "Vermietung durchführen"
);
prozess1.delay(
    500, prozess1.updateInvoice,
    2, new Invoice('Frida Flink', 110),
    "Rechnung eintragen"
);



///////////////////////////////////////
// "Prozess 2"

let prozess2 = new Helper("Prozess 2");
prozess2.delay(200, prozess2.showCarAndInvoice, 2, 2);



///////////////////////////////////////
// Finales Resultat

let resultat = new Helper("Endergebnis");
resultat.delay(750, resultat.showCarAndInvoice, 2, 2);
