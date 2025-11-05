class Poet {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.pseudonym = data.pseudonym;
        this.birth_year = data.birth_year;
        this.death_year = data.death_year;
        this.nationality = data.nationality;
        this.literary_movement = data.literary_movement;
        this.biography = data.biography;
        this.photo_url = data.photo_url;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

module.exports = Poet;

