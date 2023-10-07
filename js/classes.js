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

export class Bericht {
    constructor(date, time, klant, nickname, titel, text) {
        this.date = date;
        this.time = time;
        this.klant = klant;
        this.nickname = nickname;
        this.titel = titel;
        this.text = text;
    }
}
