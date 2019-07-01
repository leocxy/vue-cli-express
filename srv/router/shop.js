'use strict'
import { ApolloClient } from 'apollo-client'
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag';
// import _ from 'lodash';

let router = require('express').Router()
let conf   = require('../conf/index')
let db     = require('../conf/nedb')
let auth   = require('../conf/session-auth')

// Show Shopify Shop Info
router.get('/info', (req, res) => {
	// From Shopify Admin
	if (req.session.shop) {
		return db.shop.findOne({id: req.session.shop}, (err, ret) => {
			ret === null ? res.sendStatus(400) : res.json(ret)
		})
	}

	// From Storefront Proxy
	return db.shop.findOne({domain: req.header('x-forwarded-host')}, (err, ret) => {
		ret === null ? res.sendStatus(400) : res.json(ret)
	});
});

// Middle Auth
router.post('/info', auth, (req, res) => {
	let postData = req.body;

	db.shop.findOne({id: req.session.shop}, (err, ret) => {
		let link = createHttpLink({
			uri: `https://${req.session.shop}/admin/api/${conf.version}/graphql.json`,
			fetch, 
			headers: {
				'X-Shopify-Access-Token': ret.token
			}
		});
		let client = new ApolloClient({
			link: link,
			cache: new InMemoryCache(),
			ssrMode: true
		});

		let query, json;

		query = gql`{shop {
			name
			email
			url
			description
			id
			contactEmail
			currencyCode
		}}`

		client.query({query: query}).then((response) => {
			res.json({post: postData, shop: response.data.shop})
		}).catch((err) => {
			res.status(500).json(err);
		})
	});
});

module.exports = router