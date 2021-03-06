'use strict';
var	mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	created_date: { type: Date, default: Date.now, required: true },
	created_by: { type: String, required: true },
	statuses: [ {
		status: { type: String, required: true },
		date: { type: Date, default: Date.now, required: true }
	} ],
	last_modified_by: String,	//This will eventualy be changed to a user_id for a User object - outside the scope of my implementation
	last_modified_date: { type: Date, default: Date.now },
	assets: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' } ]
});



projectSchema.index({ name: 1, assets: -1 });
projectSchema.set('autoIndex', false);
var Project = mongoose.model('Project', projectSchema, 'Project'); 	//3rd argument is collection
Project.ensureIndexes(function (err) {
	  if (err) {
	  	console.log('Error in indexing Project Collection');
	  }
});

module.exports = Project;
