export class Klant {
    constructor(naam, admin) {
        this.naam = naam;
        this.admin = admin;
    }
}

export class Mandje {
    constructor(klant) {
        this.klant = klant;
        this.artikelen = [];
    }
}

export class Artikel {
    constructor(id, naam, prijs) {
        this.id = id;
        this.naam = naam;
        this.prijs = prijs;
    }
}
