// shopify.js - Shopify Auth route module
import nonce from 'nonce';
import crypto from 'crypto';
import cookie from 'cookie';
import request from 'request-promise';
import querystring from 'querystring'
import lowdb from 'lowdb';

let express = require('express');
let router = express.Router();
let conf = require('../conf/index.js');

// Install
router.get('/', (req, res) => {
	let shop = req.query.shop;
    if (!shop) {
      return res.status(400).send('Missing shop parameter. Please add ?shop=your-shop.myshopify.com to your request');
    }

    // Redirect
    let state = nonce();
    let redirectUri = conf.redirect_uri + '/api/shopify/callback';
    let installUrl = 'https://' + shop + 
    '/admin/oauth/authorize?client_id=' + conf.apiKey + 
    '&scope=' + conf.scopes +
    '&state=' + state + 
    '&redirect_uri=' + redirectUri;

    res.cookie('state', state);
    res.redirect(installUrl);
});

// Callback
router.get('/callback', (req, res) => {
	const { shop, hmac, code, state } = req.query;

    // Validate request is from Shopify
    if (shop && hmac && code) {
      let map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      let msg = querystring.stringify(map)
      let provideHmac = Buffer.from(hmac, 'utf-8');
      let hash = Buffer.from(crypto
        .createHmac('sha256', conf.apiSecret)
        .update(msg)
        .digest('hex'), 'utf-8');

      let hashEquals = false;
      try {
        hashEquals = crypto.timingSafeEqual(hash, provideHmac)
      } catch (e) {
        hashEquals = false;
      }

      if (hashEquals) {
        return res.status(400).send('HMAC validation failed');
      }

      // Generate AccessToken
      let tokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      let tokenPayload = {
        client_id: conf.apiKey,
        client_secret: conf.apiSecret,
        code,
      }

      request.post(tokenRequestUrl, {json: tokenPayload}).then((tokenRes) => {
        // Store shop and token
        let token = tokenRes.access_token;
        let fileSync = require('lowdb/adapters/FileSync');
        let db = lowdb(new fileSync('shop.json'));

        db.defaults({shops: []}).write();

        if (!db.get('shops').find({id: shop}).value()) {
          db.get('shops').push({id: shop, token: token}).write();
        } else {
          db.get('shops').find({id: shop}).assign({token: token}).write();
        }

        // Get store info
        let requestUrl = 'https://' + shop + '/admin/api/' + conf.version + '/shop.json';
        request.get(requestUrl, {headers: {'X-Shopify-Access-Token': token}}).then((response) => {
          response = JSON.parse(response)['shop']
          db.get('shops').find({id: shop}).assign({domain: res.domain, scopes: conf.scopes}).write();
          // redirect back to shopify admin
          return res.redirect('https://' + shop + '/admin/apps');
        }).catch((error) => {
          return res.status(error.statusCode).send(error.error.error_description);
        });

        return null
      }).catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
    }
});

// Valid Request - Embedded App
router.get('/valid', (req, res) => {
  const { shop, hmac, locale } = req.query;
  let hashEquals = false, state = 400, message = 'Invalid Requst', extra = '';

  // Validate is the request from shopify
  if (shop && hmac && locale) {
    let map = Object.assign({}, req.query);
    delete map['hmac'];
    let msg = querystring.stringify(map);
    let provideHmac = Buffer.from(hmac, 'utf-8');
    let hash = Buffer.from(crypto
      .createHmac('sha256', conf.apiSecret)
      .update(msg)
      .digest('hex'), 'utf-8');

    try {
      hashEquals = crypto.timingSafeEqual(hash, provideHmac)
    } catch(e) {
      hashEquals = false
    }

    if (!hashEquals) {
      extra = 'HMAC validation failed';
    } else {
      // Valid Install Or not
      let fileSync = require('lowdb/adapters/FileSync');
      let db = lowdb(new fileSync('shop.json'));
      db.defaults({shops: []}).write();

      if (!db.get('shops').find({id: shop}).value()) {
        extra = 'Invalid Shopify Store';
        state = 401;
      } else {
        // set the session
        req.session.shop = shop;
        message = 'Thank you for using our app!';
        state = 0;
      }
    }
  }

  res.json({state, message, extra});
});

module.exports = router;