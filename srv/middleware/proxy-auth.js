'use strict'
import crypto from 'crypto';
import querystring from 'querystring'
// Proxy Auth
module.exports = (req, res, next) => {
	let {shop, path_prefix, timestamp, signature } = req.query,
	conf = require('../conf/index'),
	map = Object.assign({}, req.query), hash, x;
	delete map['signature']
	hash = Object.keys(map).sort().map(key => {
		x = Array.isArray(map[key]) ? map[key].join(',') : map[key]
		return `${key}=${x}`
	})
	hash = crypto.createHmac('sha256', conf.apiSecret).update(hash).digest('hex')

	return hash !== signature ? res.status(401).send('Invalid proxy request!') : next()
}