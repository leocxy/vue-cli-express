// Apollo
import { ApolloClient } from 'apollo-client'
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag';
import lowdb from 'lowdb';
import _ from 'lodash';

let express = require('express');
let router = express.Router();
let conf = require('../conf/index.js');

// Live Stock Search
router.get('/live-stock', (req, res) => {

	let { shop, product_id } = req.query;
    if (!shop) {
      return res.status(400).send('Missing shop parameter. Please add ?shop=your-shop.myshopify.com to your request');
    }

    if (!product_id) {
      return res.status(400).send('Missing product_id parameter. Please add ?product_id=your_product_id');
    }

    // Validate request from db
    let fileSync = require('lowdb/adapters/FileSync');
    let db = lowdb(new fileSync('shop.json'));
    let record = db.get('shops').find({id: shop}).value();

    if (!record || !record.token) {
      return res.status(400).send('Invalid shop parameter. Please reinstall this app!');
    }

    // Init ApolloClient
    let link = createHttpLink({
    	uri: 'https://' + shop + '/admin/api/' + conf.version + '/graphql.json', 
    	fetch, 
    	headers: {
	    	'X-Shopify-Access-Token': record.token
	    }
	});
    let client = new ApolloClient({
    	link: link,
    	cache: new InMemoryCache(),
    	ssrMode: true,
    });

    let query, json;

    query = gql`{
    	product(id: "gid://shopify/Product/${product_id}") {
    		title, totalInventory, totalVariants, options(first: 10) {
	    		name
	    	}
	    	variants(first: 100) {
	    		edges {
	    			node {
	    				displayName, inventoryQuantity, selectedOptions {
	    					name, value
	    				}
	    				inventoryItem {
	    					id
	    				}
	    			}
	    		}
	    	}
	    }
	}`

    // Query Product
    client.query({query: query}).then((result) => {
    	let locations = {}, 
    	items = {},
    	opKey = '',
    	query = '',
    	inventory_item_id = '',
    	ids = [], // inventory_item_id
    	info = result.data.product,
    	title = info.title;
    	// console.log(title);

    	info.variants.edges.map((item) => {
    		inventory_item_id = item.node.inventoryItem.id.split('/')
    		opKey = item.node.displayName.replace(title + ' - ', '');
    		inventory_item_id = inventory_item_id[inventory_item_id.length - 1];
    		items[inventory_item_id] = {name: opKey, locations: {}};
    		ids.push('inventory_item_id:' + inventory_item_id);
    	});

    	// Query for location & inventory
    	query = `first: ${ids.length}, query: "${ids.join(' OR ')}"`
    	query = gql`{
    		locations(first: 20) {
    			edges {
    				node {
    					id 
    					name
    					address {
    						city countryCode zip phone
    					}
    					inventoryLevels(${query}) {
    						edges {
    							node {
    								id
    								available
    							}
    						}
    					}
    				}
    			}
    		}
    	}`

    	client.query({query: query}).then((result) => {
    		let edges = result.data.locations.edges;
    		let node, location_id, location_name;

    		for (node of edges) {
				location_name = node.node.name;
				location_id   = node.node.id.split('/');
				location_id   = location_id[location_id.length - 1];

    			_.forEach(node.node.inventoryLevels.edges, (v, k) => {
    				let inventory = locations[location_id] || {
    					name: location_name, 
    					id: location_id, 
    					inventory: [], 
    					city: node.node.address.city, 
    					countryCode: node.node.address.countryCode, 
    					zip: node.node.address.zip,
    					phone: node.node.address.phone
    				};
    				let inventory_item_id = v.node.id;
    				inventory_item_id = inventory_item_id.split('=')[1];
    				inventory.inventory.push({inventory_item_id, available: v.node.available, name: items[inventory_item_id].name});
    				locations[location_id] = inventory;
    				items[inventory_item_id]['locations'][location_id] = {name: location_name, available: v.node.available}
    			});
    		}

    		res.json({locations, items});
    	}).catch((err) => {
    		console.log('error', err);
    		res.status(400).send(err);
    	});
    }).catch((err) => {
    	console.log('error', err);
    	res.status(400).send(err);
    });
});

module.exports = router;