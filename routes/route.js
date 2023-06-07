const router = require('express').Router();
const { getAllAuthor, getAuthorDetail } = require('../controllers/author');
const { getAllBook, getBookById, createBook, deleteBook, updateBook } = require('../controllers/book');
const { createCustomer, deleteCustomer } = require('../controllers/customer');
const { getAllGenre } = require('../controllers/genre');
const { getAllPublisher } = require('../controllers/publisher');
const { getAllRetail, getRetailDetails } = require('../controllers/retail');
const { getAllSupplier } = require('../controllers/supplier');


router.get('/', getAllBook);
router.get('/book/:book_id', getBookById);
router.get('/author/:author_id', getAuthorDetail)
router.get('/retail/:retail_id', getRetailDetails)
router.post('/book', createBook)
router.post('/customer', createCustomer)
router.delete('/book/:book_id', deleteBook)
router.delete('/customer/:customer_id', deleteCustomer)
router.put('/book/:book_id', updateBook)
router.get('/publisher', getAllPublisher)
router.get('/author', getAllAuthor)
router.get('/retail', getAllRetail)
router.get('/genre', getAllGenre)
router.get('/supplier', getAllSupplier)

module.exports = router;