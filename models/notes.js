
//REQUIRE PACKAGE MONGOOSE
var mongoose = require("mongoose");
//USE MONGOOSE TO CREATE SCHEMA
var Schema = mongoose.Schema;

//CREATE NOTES SCHEMA
var NoteSchema = new Schema({
    //REQUIRE STRING FOR TITLE
    title: {
        type: String
    },
 //REQUIRE STRING FOR BODY
    body: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});


//CREATE NOTE MODEL WITH MONGOOSE
var Notes = mongoose.model("Note", NoteSchema);

//EXPORT
module.exports = Notes;