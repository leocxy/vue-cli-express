'use strict'

let router = require('express').Router(),
conf       = require('../conf/index'),
db         = require('../conf/nedb');

// Router Middleware
router.use(require('../middleware/webhook-auth'));

router.post('/', (req, res, next) => {
	console.log(req.body);
	res.sendStatus(200)
})

// Erase Shop Data
router.post('/shop/redact', (req, res, next) => {
	let { shop_domain } = req.body
	db.shop.remove({id: shop_domain}, { multi: true}, (err, num) => {
		return num > 0 ? res.sendStatus(200) : res.sendStatus(500);
	})
})

// Customer request deletion of data
router.post('/customers/redact', (req, res, next) => {
	let { shop_domain } = req.body
	db.shop.findOne({id: shop_domain}, (err, ret) => {
		return null === ret ? res.sendStatus(500) : res.sendStatus(200);
	})
})

// Customer data??
router.post('/customers/data_request', (req, res, next) => {
	let { shop_domain } = req.body
	db.shop.findOne({id: shop_domain}, (err, ret) => {
		return null === ret ? res.sendStatus(500) : res.sendStatus(200);
	})
})

// For more info
// https://help.shopify.com/en/api/guides/gdpr-resources

module.exports = router