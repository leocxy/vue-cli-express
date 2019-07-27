'use strict'
// shopify.js - Shopify Auth route module
import crypto from 'crypto';
import cookie from 'cookie';
import request from 'request-promise';
import querystring from 'querystring'

let router = require('express').Router(),
conf       = require('../conf/index.js'),
db         = require('../conf/nedb.js'),
nonce      = require('nonce')();

// Middleware
router.use(require('express').json())
router.use(require('express').urlencoded({extended: true}))

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

  // Cookie Check
  let cookie = require('cookie');
  if (state !== cookie.parse(req.headers.cookie).state) {
    return res.status(403).send('Request origin cannot be verified')
  }

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

    if (!hashEquals) {
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

      db.shop.findOne({id: shop}, (err, ret) => {
        // Callback
        let getShop = (err, ret) => {
          // Get Shop info
          let shopRequestUrl = `https://${shop}/admin/api/${conf.version}/shop.json`
          request.get(shopRequestUrl, {headers: {'X-Shopify-Access-Token': token}}).then((response) => {
            // keep shop info
            response = JSON.parse(response).shop
            db.shop.update({id: shop}, {$set: {domain: response.domain, scopes: conf.scopes, data: response }}, (err, ret) => {
              return res.redirect(`https://${shop}/admin/apps/${conf.apiKey}`);
            });

            return null
          }).catch((err) => {
            res.status(err.statusCode).send(err.error.error_description);
          })
        }

        if (ret === null) {
          db.shop.insert({id: shop, token: token}, getShop)
        } else {
          db.shop.update({id: shop}, {$set: {token: token}}, getShop)
        }
      });
      return null
    }).catch((err) => {
      res.status(err.statusCode).send(err.error.error_description);
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
      return res.json({state, message, extra});
    }

    // Valid Install Or not
    db.shop.findOne({id: shop}, (err, ret) => {
      if (ret === null) {
        extra = 'Invalid Shopify Store';
        state = 401;
      } else {
        req.session.shop = shop;
        message = 'Thank you for using our app!';
        state = 0;
      }
      res.json({state, message, extra});
    });
  }
});

module.exports = router;