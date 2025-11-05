class Poem {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.book_id = data.book_id;
        this.content = data.content;
        this.page_number = data.page_number;
        this.verses_count = data.verses_count;
        this.stanzas_count = data.stanzas_count;
        this.style = data.style;
        this.theme = data.theme;
        this.notes = data.notes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        if (data.book_title) this.book_title = data.book_title;
        if (data.poet_name) this.poet_name = data.poet_name;
    }
}

module.exports = Poem;
