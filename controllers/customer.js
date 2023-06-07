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

exports.createCustomer = async (req, res) => {
    try{
        const {name, email, phone, paymen_method, city, book_id, price, quantity, date} = req.body;
        const queryNumberCustomer = `
        SELECT MAX(customer_id) AS max_customer_id
        FROM customer;
        `;
        await db.raw(queryNumberCustomer).then(async (result) => {
            const customer_id = result.rows[0]['max_customer_id'] +1;

            const queryCustomer = `
            BEGIN; 
            INSERT INTO customer (customer_id, name, email, phone, paymen_method, city)
            VALUES (${customer_id}, '${name}', '${email}', '${phone}', '${paymen_method}', '${city}');

            INSERT INTO bought (book_id, customer_id, price, quantity, date)
            VALUES (${book_id}, ${customer_id}, ${price}, ${quantity}, '${date}');
            COMMIT;
            `;
            await db.raw(queryCustomer).then((result) => {
                return res.status(200).json({"status" : "Success to buy book"});
            }). catch((error) =>{
                return res.status(500).json(error.message)
            })

        })

    }catch(err){
        return res.status(500).json(err.message)
    }
}

exports.deleteCustomer = async (req, res) => {
    try{
        const {customer_id} = req.params;
        const query = `
        BEGIN;
        DELETE FROM bought
        WHERE customer_id = ${customer_id};

        DELETE FROM customer
        WHERE customer_id = ${customer_id};

        COMMIT;
        `;
        await db.raw(query).then((result) => {
            return res.status(200).json({'status' : 'success to delete customer'});
        }).catch((err) => {
            return res.status(500).json({'status' : err.message});
        })
    }catch(err){
        return res.status(500).json(err.message)
    }
}