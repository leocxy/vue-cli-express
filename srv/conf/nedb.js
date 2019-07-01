'use strict'
// Export nedb object
const path = require('path')
const nedb = require('nedb')

var db = {
	shop: new nedb({
		filename: path.join(path.resolve('db'), 'app.db'),
		autoload: true
	})
};

module.exports = db;