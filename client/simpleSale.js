const Invoice = require('../src/Invoice');
const Helper = require('./helper');

let helper = new Helper('Simple Sale');

// Wagen 1 wird vermietet
helper.updateRenter(1, 'Sigi Sauser', "Vermietung durchführen");

// Rechnung 1 aktualisieren...
let newInvoice = new Invoice("Sigi Sauser", 190);
helper.updateInvoice(1, newInvoice, "Rechnung eintragen");

// wir schauen uns das Resultat an ...
// ... aber zeitverzögert, weil wir sehen wollen, was in der DB übrig bleibt
helper.delay(500, helper.showCarAndInvoice, 1, 1, "Endresultat");
