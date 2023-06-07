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

exports.getRetailDetails = async (req, res) => {
    try{
        const {retail_id} = req.params;
        const query = `
        SELECT r.name, r.city, r.email 
        FROM retail r
        WHERE  r.retail_id = ${retail_id}

        `;

        await db.raw(query).then((result) => {
            return res.status(200).json(result.rows)
        }).catch((err) =>{
            return res.status(500).send(err.message)
        })
    }catch(err){
        return res.status(500).json(err.message)
    }

}

exports.getAllRetail = (req, res) => {
    try{
        const query = `
        SELECT *
        FROM retail
        `;
        db.raw(query).then((result) => {
            return res.status(200).json(result.rows)
        }).catch((err) => {
            return res.status(500).json(err.message)
        })
    }catch(err){
        return res.status(500).json(err.message)
    }
}