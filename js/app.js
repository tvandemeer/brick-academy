class Klant {
  constructor(klant_id, naam) {
    this.klant_id = klant_id;
    this.naam = naam;
  }
}

class Mandje {
  constructor(mandje_id, klant_id, artikelen) {
    this.mandje_id = mandje_id;
    this.klant_id = klant_id;
    this.artikelen = [];
  }
}

class Artikel {
  constructor(part_num, naam, prijs) {
    this.part_num = part_num;
    this.naam = naam;
    this.prijs = prijs;
  }
}
