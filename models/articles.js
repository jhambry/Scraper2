
//REQUIRE PACKAGE MONGOOSE
var mongoose = require("mongoose");
//USE MONGOOSE TO CREATE SCHEMA
var Schema = mongoose.Schema;

//CREATE ARTICLE SCHEMA
var ArticleSchema = new Schema({
	//REQUIRE STRING FOR TITLE
	title: {
		type: String,
		required: true,
		unique: true
	},
	//REQUIRE STRING FOR LINK
	link: {
		type: String,
		required: true
	},
	teaser: {
		type: String,
		required: false
	},
	imgLink: {
		type: String,
		required: false
	},
	note: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}]
});

//CREATE THE ARTICLE MODEL
var Articles = mongoose.model("Article", ArticleSchema);

//EXPORT THE MODEL FOR ARTICLES
module.exports = Articles;