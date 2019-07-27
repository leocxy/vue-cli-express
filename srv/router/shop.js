'use strict'
import { GraphQLClient } from 'graphql-request'
// import _ from 'lodash';

let router   = require('express').Router(),
conf         = require('../conf/index'),
db           = require('../conf/nedb'),
session_auth = require('../middleware/session-auth'),
proxy_auth   = require('../middleware/proxy-auth')

// Hack override
if ('development' === process.env.NODE_ENV) {
    proxy_auth = (req, res, next) => {
        req.query['shop'] = conf.devStore;
        return next()
    }

    session_auth = (req, res, next) => {
		req.session.shop = conf.devStore;
		return next()
    }
}

// Middleware
router.use(require('express').json())
router.use(require('express').urlencoded({extended: true}))

// Show Shopify Shop Info
router.get('/info', proxy_auth, (req, res) => {
	let { shop } = req.query,
	queryCallback = (err, ret) => {
		null === ret ? res.sendStatus(401) : res.json(ret);
	}

	return db.shop.findOne({id: shop}, queryCallback);
});

// Middle Auth
router.post('/info', session_auth, (req, res) => {
	let postData = req.body, client,
	stepTwo = (ret) => {
		client = new GraphQLClient(`https://${ret.id}/admin/api/${conf.version}/graphql.json`, {
			headers: {'X-Shopify-Access-Token' : ret.token}
		})
		client.request(require('../schema/shop')()).then(({shop}) => {
			res.json({post: postData, shop: shop})
		}).catch(err => {
			console.error(err)
			res.status(500).json(err)
		})
	},
	stepOne = (err, ret) => {
		null === ret ? res.sendStatus(401) : stepTwo(ret)
	}

	db.shop.findOne({id: req.session.shop}, stepOne);
});

module.exports = router