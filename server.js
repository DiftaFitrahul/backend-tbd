const knex = require("knex");
const express = require('express');
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const port = 5000;

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

// allow cross-origin requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());

const bookroute = require('./routes/route');
app.use('/',bookroute)
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})



