class Book {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.poet_id = data.poet_id;
        this.isbn = data.isbn;
        this.publication_year = data.publication_year;
        this.publisher = data.publisher;
        this.pages = data.pages;
        this.language = data.language;
        this.edition = data.edition;
        this.description = data.description;
        this.cover_url = data.cover_url;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        if (data.poet_name) this.poet_name = data.poet_name;
    }
}

module.exports = Book;
