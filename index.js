
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");

app.use("/static", express.static('public'));


app.get("/", (req,res)=>{
    res.render("index");
});



 
function getUser(req,res){
    const username = req.body.username;
    app.get(`/${username}`, (req,res)=>{
        const https = require('https');
        const request = https.get(`https://teamtreehouse.com/${username}.json`, (response) => {
            if (response.statusCode === 200){
                let incomingData = '';
                response.on('data', (d) => {
                    incomingData += d.toString();
                });
        
                response.on("end", (d)=>{
                    //parse the data
                    const parsedD = JSON.parse(incomingData);
                    // console.dir(parsedD);
                    const name = req.cookies.username;
                    res.render("profile", {parsedD, name});
              
        
        
                });

            }else{

                console.log("An error has occured", response.statusCode)
            }
    

    
        });
        
        request.on('error', (e) => {
        console.error(e);
        });
    
    
    });


}

app.use((req,res,next)=>{
    getUser(req,res);
    next();

});









app.post("/profile", (req,res)=>{
    // console.dir(req.body);
    res.cookie("username", req.body.username);
    res.redirect(`/${req.body.username}`);
});












app.listen(3000, ()=>{
    console.log("app is running on port:3000");
});
