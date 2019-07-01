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
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
  });

  // Restful Api
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // Session
  let session_options = {
    secret: process.env.SHOPIFY_API_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true,
  }
  // Using Cookie Secure
  if (app.get('env') == 'production') {
    app.set('trust proxy', 1)
    session_options = Object.assign(session_options, {cookie: { secure: true }})
  }
  app.use(session(session_options));


  // Shopify App
  app.use('/shopify', require('./router/shopify.js'));

  // Example Api
  app.use('/shop', require('./router/shop.js'));

  // 404
  app.use((req, res, next) => {
    return res.sendStatus(404);
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

