const knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});

exports.getAllBook = async (req, res) => {
    const query = `
    SELECT b.book_id as book_id, b.publisher_id as publisher_id, b.title as title , b.language as language, b.synopsis as synopsis, b.publication_year as publication_year, g.name as genre, s.price * 1.05 as book_price 
    FROM book b
    JOIN book_genre fg ON b.book_id = fg.book_id
    JOIN supply s ON b.book_id = s.book_id
    JOIN genre g ON fg.genre_id = g.genre_id`

    try{
        await db.raw(query).then((result) =>{
            return res.status(200).json(result.rows)
        }).catch((err) =>{
            return res.status(500).json(err.message)
        })
    } catch (err) {
        return res.status(500).json(err.message)
    }
    
} 


exports.getBookById = async (req, res) =>{
    try{
        const {book_id} = req.params;
        const query = `
        SELECT b.publisher_id as publisher_id, b.title as title , b.language as language, b.synopsis as synopsis, b.publication_year as publication_year, g.name as genre, s.price * 1.05 as book_price,
        p.name as publisher_name, a.name as author_name, r.name as retail_name, a.author_id as author_id, r.retail_id as retail_id
        from book b
        JOIN write w ON w.book_id = b.book_id
        JOIN author a ON a.author_id = w.author_id
        JOIN book_retail br ON br.book_id = b.book_id
        JOIN retail r ON r.retail_id = br.retail_id
        JOIN publisher p ON p.publisher_id = b.publisher_id
        JOIN book_genre fg ON b.book_id = fg.book_id
        JOIN supply s ON b.book_id = s.book_id
        JOIN genre g ON fg.genre_id = g.genre_id
        WHERE b.book_id = ${book_id};
        `;
        await db.raw(query).then((result) => {
            return res.status(200).json(result.rows);
        }).catch((error) => {
            console.log(error.message);
        })
    }catch(err){
        return res.status(500).json(err.message)
    }
}

exports.createBook = async(req, res) => {
    try {
        const {title, language, synopsis, publication_year, publisher_id, genre_id, author_id, retail_id, price, quantity, date, paymen_status, supplier_id} = req.body;
        const queryNumberBook = `
        SELECT MAX(book_id) AS max_book_id
        FROM book;
        `
        await db.raw(queryNumberBook).then( async (result) =>{
            const book_id = result.rows[0]['max_book_id'] + 1 ;
            

            const queryCreateBook = `
                BEGIN; 
                INSERT INTO book (book_id, title, language, synopsis, publication_year, publisher_id)
                VALUES (${book_id}, '${title}', '${language}', '${synopsis}', ${publication_year}, ${publisher_id});

                INSERT INTO supply (book_id, supplier_id, price, quantity, date, paymen_status)
                VALUES (${book_id}, ${supplier_id}, ${price}, ${quantity}, '${date}', '${paymen_status}');

                INSERT INTO book_genre (book_id, genre_id)
                VALUES (${book_id}, ${genre_id});

                INSERT INTO write (book_id, author_id)
                VALUES (${book_id}, ${author_id});

                INSERT INTO book_retail (book_id, retail_id)
                VALUES (${book_id}, ${retail_id});

                COMMIT;
            `;

            await db.raw(queryCreateBook).then((result) => {
                return res.status(200).json({"status" : "Success to create book"})
            }).catch((err) => {
                return res.status(500).json(err.message)
            })
        }).catch((err) =>{
            return res.status(500).json(err.message)
        })


    }catch(err){
        return res.status(500).json(err.message)
    }
}

exports.deleteBook = async (req, res) => {
    try{
        const {book_id}  = req.params

        const query = `
        BEGIN;
        DELETE FROM book_genre
        WHERE book_id = ${book_id};

        DELETE FROM write
        WHERE book_id = ${book_id};

        DELETE FROM supply
        WHERE book_id = ${book_id};

        DELETE FROM book_retail
        WHERE book_id = ${book_id};

        DELETE FROM bought
        WHERE book_id = ${book_id};

        DELETE FROM book
        WHERE book_id = ${book_id};

        COMMIT;
        `;

        await db.raw(query).then((result) => {
            return res.status(200).json({"status" : "success to delete book"});
        }).catch((err) => {
            return res.status(500).json(err.message)
        })
    }catch(err){
        return res.status(500).json(err.message)
    }
}

exports.updateBook = async (req, res) => {
    try {
      const {book_id} = req.params;
      const { title, language, synopsis, publication_year, publisher_id, genre_id, author_id, retail_id, price, quantity, date, payment_status, supplier_id } = req.body;
      const queryUpdateBook = `
        UPDATE book
        SET title = '${title}',
            language = '${language}',
            synopsis = '${synopsis}',
            publication_year = ${publication_year},
            publisher_id = ${publisher_id}
        WHERE book_id = ${book_id};
  
        UPDATE supply
        SET supplier_id = ${supplier_id},
            price = ${price},
            quantity = ${quantity},
            date = '${date}',
            paymen_status = '${payment_status}'
        WHERE book_id = ${book_id};
  
        UPDATE book_genre
        SET genre_id = ${genre_id}
        WHERE book_id = ${book_id};
  
        UPDATE write
        SET author_id = ${author_id}
        WHERE book_id = ${book_id};
  
        UPDATE book_retail
        SET retail_id = ${retail_id}
        WHERE book_id = ${book_id};
      `;
  
      await db.raw(queryUpdateBook).then((result) => {
        return res.status(200).json({'status' : 'succes to update book'})
      }).catch((err) => {
          console.log(err.message)
        return res.status(500).json({'status' : err.message})
      })
    } catch (err) {
        console.log(err.message)
      return res.status(500).json(err.message);
    }
  };
  
