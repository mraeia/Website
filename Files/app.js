var express  = require("express"),
    mongoose = require("mongoose"),
    app      = express(),
    bodyParser = require("body-parser"),
    request = require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/mywebsite');

var projectSchema = new mongoose.Schema({
    title: String,
    image: [String],
    body: String,
    //created: {type: Date, default: Date.now}
});

var pictureSchema = new mongoose.Schema({
    url: String,
    description: String,
});

var Project = mongoose.model("Project", projectSchema);
var Picture = mongoose.model("Picture", pictureSchema);

// Picture.create({
//         url: "https://s23.postimg.org/r2hzvd7wb/Screen_Shot_2016_12_26_at_9_53_22_PM.png",
//         description: "This image is showcasing the navigation feature for the map. After the user chooses a start and end point for their desired route, this feature provides information about the direction and distance required to travel on each road segment. The current segment the user is currently on is highlighted in yellow as can be seen above. It can be disabled by toggling the \"Directions\" button in the options pane.",
//     },function(err,newPicture){
//         if(err){
//             console.log("Error");
//         }
//         else
//         {
//             console.log("success");
//         }
//     });

app.get("/", function(req, res){
    res.render("home");
});

app.get("/projects", function(req, res){
    Project.find({},function(err,projects){
        if(err){
           console.log("ERROR!");
       } else {
          res.render("projects", {projects: projects}); 
       }
    });
});

app.get("/resume",function(req,res){
    res.render("resume");
});

app.get("/projects/*",function(req,res){
    var url = "https:\/\/" + req.params["0"];
    Picture.findOne({
        url : url
    }, function(err,picture){
        if (err)
        {
            console.log("ERROR!");
        }
        else {
            res.render("picture",{picture:picture});
        }
    });
});

app.get("/instagram",function(req,res){
   request("https://api.instagram.com/v1/users/self/media/recent/?access_token=431654788.fe1459a.0e23308d248644fba0f6964c07c4326c", function (error, response, body){
       var parsedData = JSON.parse(body);
       var imgSources = [];
       parsedData["data"].forEach(function(post){
           imgSources.push(post.images.standard_resolution.url);
       });
       res.render("images",{images:imgSources});
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening!!!"); 
});