const Invoice = require('../src/Invoice');
const Helper = require('./helper');

///////////////////////////////////////
// "Prozess 1"

let prozess1 = new Helper("Prozess 1");
prozess1.delay(
    10,//ms
    prozess1.updateRenter, 3, 'Hilda Hurtig',
    "Vermietung durchführen"
);
prozess1.delay(
    500,//ms
    prozess1.updateInvoice, 3, new Invoice('Hilda Hurtig', 110),
    "Rechnung eintragen"
);

///////////////////////////////////////
// "Prozess 2"

let prozess2 = new Helper("Prozess 2");
prozess2.delay(
    150,//ms
    prozess2.updateRenter, 3, 'Leo Lasch',
    "Vermietung durchführen"
);
prozess2.delay(
    300,//ms
    prozess2.updateInvoice, 3, new Invoice('Leo Lasch', 140),
    "Rechnung eintragen"
);



///////////////////////////////////////
// Finales Resultat

let resultat = new Helper("Endergebnis");
resultat.delay(750, resultat.showCarAndInvoice, 3, 3);
