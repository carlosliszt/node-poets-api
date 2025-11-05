CREATE DATABASE IF NOT EXISTS poesia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) UNIQUE NOT NULL,
                                     email VARCHAR(100) UNIQUE,
                                     password VARCHAR(255) NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     INDEX idx_username (username),
                                     INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS poets (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
                                     pseudonym VARCHAR(100),
                                     birth_year INT,
                                     death_year INT,
                                     nationality VARCHAR(50),
                                     literary_movement VARCHAR(100),
                                     biography TEXT,
                                     photo_url VARCHAR(255),
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     INDEX idx_name (name),
                                     INDEX idx_nationality (nationality),
                                     INDEX idx_movement (literary_movement)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS books (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     title VARCHAR(200) NOT NULL,
                                     poet_id INT NOT NULL,
                                     isbn VARCHAR(20) UNIQUE,
                                     publication_year INT,
                                     publisher VARCHAR(100),
                                     pages INT,
                                     language VARCHAR(30) DEFAULT 'Português',
                                     edition INT DEFAULT 1,
                                     description TEXT,
                                     cover_url VARCHAR(255),
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     FOREIGN KEY (poet_id) REFERENCES poets(id) ON DELETE CASCADE ON UPDATE CASCADE,
                                     INDEX idx_title (title),
                                     INDEX idx_poet (poet_id),
                                     INDEX idx_year (publication_year),
                                     INDEX idx_isbn (isbn)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS poems (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     title VARCHAR(200) NOT NULL,
                                     book_id INT NOT NULL,
                                     content TEXT NOT NULL,
                                     page_number INT,
                                     verses_count INT,
                                     stanzas_count INT,
                                     style VARCHAR(50),
                                     theme VARCHAR(100),
                                     notes TEXT,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE,
                                     INDEX idx_title (title),
                                     INDEX idx_book (book_id),
                                     INDEX idx_theme (theme),
                                     INDEX idx_style (style)
) ENGINE=InnoDB;


INSERT INTO users (username, email, password) VALUES
    ('admin', 'admin@poesias.com', '$2a$10$X7vLhEUhP9z4xqYvF5J5.eDGKqKqV8QhGZgqYvKqJ5oRzKqJ5oRzK');

INSERT INTO poets (name, pseudonym, birth_year, death_year, nationality, literary_movement, biography) VALUES
                                                                                                           ('Carlos Drummond de Andrade', NULL, 1902, 1987, 'Brasileira', 'Modernismo', 'Um dos mais influentes poetas brasileiros do século XX. Sua obra abrange temas universais como amor, morte, memória e crítica social.'),
                                                                                                           ('Cecília Meireles', NULL, 1901, 1964, 'Brasileira', 'Modernismo', 'Poetisa, pintora, professora e jornalista brasileira. Sua poesia é marcada pelo lirismo, musicalidade e temas transcendentais.'),
                                                                                                           ('Fernando Pessoa', 'Álvaro de Campos', 1888, 1935, 'Portuguesa', 'Modernismo', 'Poeta, filósofo e escritor português. Criou heterônimos com personalidades e estilos literários distintos.'),
                                                                                                           ('Vinicius de Moraes', NULL, 1913, 1980, 'Brasileira', 'Modernismo', 'Poeta, diplomata, dramaturgo e compositor brasileiro. Um dos grandes nomes da bossa nova.'),
                                                                                                           ('Manuel Bandeira', NULL, 1886, 1968, 'Brasileira', 'Modernismo', 'Poeta, crítico literário e de arte, professor de literatura e tradutor brasileiro.');

INSERT INTO books (title, poet_id, isbn, publication_year, publisher, pages, edition, description) VALUES
                                                                                                       ('Sentimento do Mundo', 1, '978-8535908770', 1940, 'Companhia das Letras', 128, 1, 'Coletânea de poemas que marcou a segunda fase da obra de Drummond, com forte crítica social.'),
                                                                                                       ('A Rosa do Povo', 1, '978-8535911450', 1945, 'Companhia das Letras', 160, 1, 'Obra de poesia social de Carlos Drummond de Andrade.'),
                                                                                                       ('Viagem', 2, '978-8526020313', 1939, 'Global Editora', 200, 1, 'Obra que consagrou Cecília Meireles na poesia brasileira.'),
                                                                                                       ('Mensagem', 3, '978-8525406347', 1934, 'Ática', 96, 1, 'Única obra em português publicada em vida por Fernando Pessoa.'),
                                                                                                       ('Antologia Poética', 4, '978-8535911237', 1954, 'Companhia das Letras', 256, 1, 'Seleção dos melhores poemas de Vinicius de Moraes.'),
                                                                                                       ('Libertinagem', 5, '978-8520935637', 1930, 'Nova Fronteira', 112, 1, 'Uma das mais importantes obras da poesia modernista brasileira.');

INSERT INTO poems (title, book_id, content, page_number, verses_count, stanzas_count, style, theme) VALUES
                                                                                                        ('No Meio do Caminho', 1, 'No meio do caminho tinha uma pedra\ntinha uma pedra no meio do caminho\ntinha uma pedra\nno meio do caminho tinha uma pedra.\n\nNunca me esquecerei desse acontecimento\nna vida de minhas retinas tão fatigadas.\nNunca me esquecerei que no meio do caminho\ntinha uma pedra\ntinha uma pedra no meio do caminho\nno meio do caminho tinha uma pedra.', 42, 11, 2, 'Verso Livre', 'Obstáculos da vida'),
                                                                                                        ('José', 2, 'E agora, José?\nA festa acabou,\na luz apagou,\no povo sumiu,\na noite esfriou,\ne agora, José?\ne agora, você?\nvocê que é sem nome,\nque zomba dos outros,\nvocê que faz versos,\nque ama, protesta?\ne agora, José?', 15, 12, 1, 'Verso Livre', 'Existencialismo'),
                                                                                                        ('Motivo', 3, 'Eu canto porque o instante existe\ne a minha vida está completa.\nNão sou alegre nem sou triste:\nsou poeta.', 15, 4, 1, 'Quadra', 'Essência da poesia'),
                                                                                                        ('Mar Português', 4, 'Ó mar salgado, quanto do teu sal\nSão lágrimas de Portugal!\nPor te cruzarmos, quantas mães choraram,\nQuantos filhos em vão rezaram!\nQuantas noivas ficaram por casar\nPara que fosses nosso, ó mar!', 28, 6, 1, 'Ode', 'Descobrimentos'),
                                                                                                        ('Soneto de Fidelidade', 5, 'De tudo ao meu amor serei atento\nAntes, e com tal zelo, e sempre, e tanto\nQue mesmo em face do maior encanto\nDele se encante mais meu pensamento.', 120, 4, 1, 'Soneto', 'Amor'),
                                                                                                        ('Pneumotórax', 6, 'Febre, hemoptise, dispneia e suores noturnos.\nA vida inteira que podia ter sido e que não foi.\nTosse, tosse, tosse.\nMandou chamar o médico:', 35, 4, 1, 'Verso Livre', 'Doença e vida');