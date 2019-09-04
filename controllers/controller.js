//PACKAGES
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();


// db
var db = require("./models");


// IMPORT NOTES.JS AND ARTICLES.JS
var Notes = require("../notes");
var Articles = require("../articles");

//GET REQUEST
router.get("/", function (req, res) {
    res.render("index");
});

//A GET REQUEST TO SCRAPE NPR
router.get("/scrape", function (req, res) {
    //WEBSITE
    request("http://www.npr.org/sections/news/", function (error, response, html) {
        //LOAD INTO CHEERIO
        var $ = cheerio.load(html);
        var num = 0;
        //EMPTY ARRAY TO HOLD ARTICLES
        var articles = [];
        //GRAB IMAGE AND TITLE FROM ATRICLE 
        $(".item.has-image").each(function (i, element) {
            num = (i);
            //SAVE AND INTO RESULT EMPTY ARRAY
            var result = {};
            //CREATE OBJECT AND SAVE USING CHILDREN INFO
            result.title = $(this).children(".item-info").find("h2.title").text();
            result.link = $(this).children(".item-info").find("h2.title").find("a").attr("href");
            result.teaser = $(this).children(".item-info").find("p.teaser").text();
            result.imgLink = $(this).children(".item-image").find("a").find("img").attr("src");
            //PUSH OBJECT INTO ARRAY HERE
            // if (result.title && result.link && result.teaser && result.imgLink) {
            //     articles.push(result);

            // }
            articles.push(result);

            console.log("this is the information" + articles);
        });
       
        var hbsObject = { article: articles, num: num };
        console.log("this is a random variable...maybe" + hbsObject)
        //REDIRECTS INTO ARTICLE PAGE
    });

});

//POST ROUTE TO SAVE ARTICLES
router.post("/save", function (req, res) {
    var newArticle = new Articles(req.body);
    newArticle.save(function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.send("Article has been saved");
        }
    })
});

//ARTICLES TO DISPLAY ARTICLES
//DISPLAYS SCRAPED ARTICLES
router.get("/articles", function (req, res) {
    //GRABS DOCS IN ARTICLES ARRAY
    //SORTS THEM AND POPULATES WITH NOTE
    Articles.find().sort({ "_id": -1 })
        .populate("note").
        exec(function (err, doc) {
            console.log(doc);
            //IF ERROR LOG 
            if (err) {
                console.log(err);
            }
            //RETURN TO BROWSER AS JSON OBJECT
            else {
                var hbsObject = {
                    savedArticles: doc
                };
                res.render("saved", hbsObject);
            }
        });
});

//DELETES ARTICLE BY ID
router.delete("/delete/:id", function (req, res) {
    //DELETES NOTES OF ARTICLE
    Articles.findOne({ "_id": req.params.id }, function (err, data) {
        if (err) {
            console.log(err);
        } else if (data.note) {
            console.log("deleting note");
            var noteIDs = data.note;
            //LOOPS THROUGH NOTE ARRAY
            for (var i = 0; i < noteIDs.length; i++) {
                Notes.findByIdAndRemove(noteIDs[i], function (error, doc) {
                    if (error) {
                        console.log(error)
                    }
                });
            }
        }
    });

    //DELETES ARTICLE USING FIND BY ID AND REMOVE
    Articles.findByIdAndRemove(req.params.id, function (error, doc) {
        if (error) {
            console.log(error);
        }
        res.send(doc);
    });
});

//POST ROUTE TO ADD NEW NOTE
router.post("/articles/:id", function (req, res) {
    //CREATES A NOTE AND REQ.BODY TO ENTRY
    var newNote = new Notes(req.body);
    //SAVES NOTES TO NEW DB
    newNote.save(function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            //UPDATES ARTICLE BY NOTES
            Articles.findOneAndUpdate({ "_id": req.params.id }, { $push: { "note": doc._id } }, { new: true })
                //ERROR 
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/articles");
                    }
                });
        }
    });
});

//DELETES A NOTE
router.delete("/delete/notes/:id", function (req, res) {
    var id = req.params.id;

    Notes.findByIdAndRemove({ "_id": req.params.id }, function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
});


//EXPORT ROUTE TO DELETE NOTES
module.exports = router;
