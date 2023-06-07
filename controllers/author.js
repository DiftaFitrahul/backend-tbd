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

exports.getAuthorDetail = async (req, res) =>{
    try{
        const {author_id} = req.params;
        const query = `
        SELECT a.name, a.birth_date, a.email 
        FROM author a
        WHERE a.author_id = ${author_id}
        `;
        await db.raw(query).then((result) => {
            return res.status(200).json(result.rows);
        }).catch((error) => {
            return res.status(500).json(error.message);
        }) 
    }catch(err){
        return res.status(500).json(err.message)
    }
}

exports.getAllAuthor = (req, res) => {
    try{
        const query = `
        SELECT *
        FROM author
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