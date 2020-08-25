const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
}); 

app.post('/', function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    var email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "Subscribed",
                merge_fields: {
                    FNAME:  firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/5fa0943cc9";

    const options = {
        method: "POST",
        auth: "anytext: 9b5c42ffeb24883a3289da38b8c0fd3d-us17"
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            // res.send("Success");
            res.sendFile(__dirname+"/success.html")
        } else {
            // res.send("Failed! " + response.statusCode);
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
            
        });
    });

    request.write(jsonData);
    request.end();
    
});

app.post("/failure" , function(req, res) {
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running at 3000");
});


//API KEY
// 9b5c42ffeb24883a3289da38b8c0fd3d-us17

//unique id for audience
// 5fa0943cc9