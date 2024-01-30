// packages config section


const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors("*"));
require("dotenv").config();

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

app.listen(3000,()=>{
  console.log('Listening on port 3000!');
});

let ejs = require("ejs");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/////////////////////////////////////////////////////
// MONGOOSE CONFIG
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let {mongoose, Food, User, userSchema ,foodSchema, unregisteredAccountName} = require("./server/mongo");

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ACCOUNT MANAGEMENT 
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let {session , AccountManagerSetup  } = require("./server/accounts");
AccountManagerSetup(app, User);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTES
/////////////////////////////////////////////////////////////////////////////////////////////////////////


app.use(express.static("public/styles"));
app.use(express.static("public/scripts"));
app.get("/", (req, res) => {
  res.render(__dirname + "/views/main");
});

app.get("/addproduct", (req, res) => {
  res.render(__dirname + "/views/AddProduct");
});
app.get("/addrecipe", (req, res) => {
  res.render(__dirname + "/views/AddRecipe");
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/views/favicon.ico");
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// FOOD API
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function AddProduct(product,done) {
  let f = new Food(product);
  f.save((err,data)=>{
      if (err) {
        console.log('err', err.message);
        done(err.message,0);
      } else {
        console.log('success:',data);
        done(`${data['name']} added`,1);
      }    
    });
};

function UpdateProduct(productName,newData,user,done) {
  let target = {name: productName['name'], brand: productName['brand'], author:user};
  Food.findOneAndUpdate(target,newData, (err,data)=>{
      if (err) {
        console.log('err', err.message);
        done(err.message,0);
      } else {
        (data)?
          done(`${data['name']} was updated`,1)
          :done(`${target['name']} ${target['brand']}of user ${user} not found`,0);
      }   
  })
};

function RemoveProduct(productName,user,done) {
  let target = {name: productName['name'], brand: productName['brand'], author:user};
  console.log(target);
  Food.findOneAndRemove(target, (err,data)=>{
      if (err) {
        console.log('err', err.message);
        done(err.message,0);
      } else {
        (data)?
          done(`${data['name']} was removed`,1)
          :done(`${target['name']} ${target['brand']}of user ${user} not found`,0);
      }   
  });
}

app.post("/api/addp",(req,res)=>{
    let p =req.body;
    let u = req.session.userId;
    if (u) {
      p.author = u; 
    } else {  //we are dubling author.default key here, but anyway
      p.author = unregisteredAccountName;
    }
    AddProduct(p,(msg,status)=>{
      res.json({msg: msg, status:status});
      });
  });

app.post("/api/updatep",(req,res)=>{
    let p =req.body;
    let u = req.session.userId;
    if (!u) {
      u = unregisteredAccountName;
    }
    let target = p['target'];
    delete p['target'];
    UpdateProduct(target,p,u,(msg,status)=>{
        res.json({msg: msg, status:status}); 
      })
  });

app.post("/api/removep",(req,res)=>{
    let target =req.body;
    let u = req.session.userId;
    if (!u) {
      u = unregisteredAccountName;
    }   
    RemoveProduct(target,u,(msg,status)=>{
        res.json({msg: msg, status:status}); 
      })
  });

app.get("/api/getuserp",(req,res)=>{
    let u = req.session.userId;
    if (!u) {
      u = unregisteredAccountName;
    }
    console.log(u);
    Food.find({author:u},(err,recipes)=>{
      if (err) {
        
      } else {
        res.json(recipes);    
      }    
    });  
  });

app.get("/api/getpubp",(req,res)=>{
    let u = req.session.userId;
    if (!u) {
      u = unregisteredAccountName;
    } 
    Food.find({author:{$ne: u}},(err,products)=>{
      if (err) {
        
      } else {
        res.json(products);    
      }    
    });  
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// ADMIN TOOLS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
adm = require("./AdminTools");
// adm.PrintAllExcept(Food, {author: ['test','NIEZALOG'],name: 'jajko'} );
