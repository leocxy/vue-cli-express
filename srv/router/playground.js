// Apollo
import { ApolloClient } from 'apollo-client'
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag';

// Playgroupd
let express = require('express');
let router = express.Router();
let conf = require('../conf/index.js');

router.get('/', (req, res) => {
	let token, shop;
    shop = 'demo-cl.myshopify.com';
    token = '6722edf221c5abb6a9a763813fca5d4d';

    let uri = 'https://' + shop + '/admin/api/2019-04/graphql.json';
    let httpLink = createHttpLink({uri: uri, fetch: fetch, headers: {
        'X-Shopify-Access-Token': token
      }});
    let cache = new InMemoryCache()

    let client = new ApolloClient({
      link: httpLink,
      cache,
      ssrMode: true,
      connectToDevTools: true,
    });

    let product_id = '2989048234065';
    
    client.query({query: gql`{locations(first: 20) {
  edges {node {
    name, id,
    inventoryLevels(first: 1, query:"inventory_item_id:24088611291217") {
      edges {
        node {
          available
        }
      }
    }
  }}
}}`}).then((result) => {
		res.send(result);
	}).catch((err) => {
		console.error(err);
    	let json = JSON.parse(JSON.stringify(err));
    	res.status(json.networkError.statusCode).send(json.message);
    });
});


module.exports = router;