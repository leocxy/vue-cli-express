'use strict'
import crypto from 'crypto';
import querystring from 'querystring'

const conf = require('../conf')

// Webhook auth
module.exports = (req, res, next) => {
	let secret = conf.apiSecret,
	getRawBody = require('raw-body'), hash;

	getRawBody(req, {
    	length: req.header('content-length'),
    	limit: '1mb',
    	encoding: 'utf8'
    }).then(buff => {
		// verify
		hash = crypto.createHmac('sha256', secret)
		.update(buff, 'utf8', 'hex').digest('base64')

		if (hash == req.header('x-shopify-hmac-sha256')) {
			// Convert buffer to JSON
			req.body = JSON.parse(buff.toString())
			next()
		} else {
			res.sendStatus(403)
		}
	}).catch(err => {
		console.log(err)
		res.sendStatus(403)
	})
}