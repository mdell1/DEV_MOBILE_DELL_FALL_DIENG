function calculerIMC() {

    var poids  = parseFloat(document.getElementById("poids").value);
    var taille = parseFloat(document.getElementById("taille").value);

    // Fermer le clavier
    document.activeElement.blur();

    if (!poids || !taille || poids <= 0 || taille <= 0) {
        alert("Veuillez entrer un poids et une taille valides.");
        return;
    }

    var tailleM    = taille / 100;
    var imc        = poids / (tailleM * tailleM);
    var imcArrondi = Math.round(imc * 10) / 10;

    var label, couleur;

    if (imc < 18.5) {
        label   = "Insuffisance pondérale";
        couleur = "color-bleu";
    } else if (imc < 25) {
        label   = "Corpulence normale";
        couleur = "color-vert";
    } else if (imc < 30) {
        label   = "Surpoids";
        couleur = "color-orange";
    } else {
        label   = "Obésité";
        couleur = "color-rouge";
    }

    document.getElementById("imcNumber").textContent = imcArrondi;
    document.getElementById("imcLabel").textContent  = label;

    var resultat = document.getElementById("resultat");
    resultat.className = "resultat " + couleur;
    resultat.style.display = "block";
}

function reset() {
    document.getElementById("poids").value  = "";
    document.getElementById("taille").value = "";
    document.getElementById("resultat").style.display = "none";
}