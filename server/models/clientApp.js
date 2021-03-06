'use strict';
var	mongoose = require('mongoose');



var clientAppSchema = mongoose.Schema({
	name: { type: String, required: true},
	access_groups: [String],			
	locale_codes: { type: [String], required: true },
	primary_locale_code: { type: String, required: true },
	created_by: { type: String, required: true},
	created_date: { type: Date, default: Date.now, required: true },
	last_modified_by: String,
	last_modified_date: { type: Date, default: Date.now }

});


clientAppSchema.index({ name: 1 });
clientAppSchema.set('autoIndex', false);
var ClientApp = mongoose.model('ClientApp', clientAppSchema, 'ClientApp'); 	//3rd argument is collection
ClientApp.ensureIndexes(function (err) {
	  if (err) {
	  	console.log('Error in indexing ClientApp Collection');
	  }
});

module.exports = ClientApp;