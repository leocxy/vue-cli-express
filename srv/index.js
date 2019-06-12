// import express from 'express';
// import socketIO from "socket.io";

const path = require('path');
const express = require('express');
const session = require('express-session');

export default (app, http) => {

  // CORS
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Restful Api
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // Session
  app.use(session({
    secret: process.env.SHOPIFY_API_SECRET,
    resave: true,
    saveUninitialized: true
  }))

  // Shopify App
  app.use('/shopify', require('./router/shopify.js'));

  // Custom Stuff
  app.use('/product', require('./router/product.js'));
  app.use('/playground', require('./router/playground.js'));

  // 404
  app.use((req, res, next) => {
    return res.status(404).send('Unknow Url')
  });

  // app.use(express.json());
  //
  // app.get('/foo', (req, res) => {
  //   res.json({msg: 'foo'});
  // });
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  //
  // optional support for socket.io
  //
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
}

