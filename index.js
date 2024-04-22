// packages config section


const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

app.listen(3000,function(){
  console.log('Listening on', JSON.stringify(this.address(),null,2));
});

let ejs = require("ejs");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/////////////////////////////////////////////////////
// MONGOOSE CONFIG
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let {mongoose, Food, User,Recipe} = require("./server/mongo");
const {c_UnregisteredAccountName} = require('./server/config');

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
app.use(express.static("public/resources"));
app.get("/", (req, res) => {
  res.render(__dirname + "/views/main");
});

app.get("/addproduct", (req, res) => {
  res.render(__dirname + "/views/AddProduct");
});
app.get("/addrecipe", (req, res) => {
  res.render(__dirname + "/views/AddRecipe");
});

app.get("/addrecipe2", (req, res) => {
  res.render(__dirname + "/views/AddRecipe2");
});

app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/views/test.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/resources/favicon.ico");
});


////////////////////////////////////////////////////////////////////////////////////////////////////////
// FOOD API
/////////////////////////////////////////////////////////////////////////////////////////////////////////
let {FoodAPI_Setup} = require("./server/FoodAPI");
FoodAPI_Setup(app,Food);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// RECIPE API
/////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  function AddRecipe(recipe,done) {
    let r = new Recipe(recipe);
    r.save((err,data)=>{
      if (err) {
          console.log('err', err.message);
          done(err.message,0);
        } else {
          console.log('Added Product:',data['name']);
          done(`Recipe ${data['name']} added`,1);
        }   
    });
  }
  
  
  app.post("/api/addrecipe",(req,res)=>{
      let rec = req.body;
      let u = req.session.userId;
      if (u) {
        rec.author = u; 
      } else {  //we are doubling author.default key here, but anyway
        rec.author = c_UnregisteredAccountName;
      }      
 
      AddRecipe(rec,(msg,status)=>{
        res.json({msg: msg, status:status});
        });
    });
  
    function UpdateRecipe(recipeName,newData,user,done) {
    let target = {name: recipeName['name'], author:user};
    Food.findOneAndUpdate(target,newData, (err,data)=>{
      console.log(data);
        if (err) {
          console.log('err', err.message);
          done(err.message,0);
        } else {
          (data)?
            done(`Recipe ${data['name']} was updated`,1)
            :done(`Recipe ${target['name']} of user ${user} not found`,0);
        }   
    })
  };
  
    app.post("/api/updaterecipe",(req,res)=>{
      let p =req.body;
      let u = req.session.userId;
      if (!u) {
        u = c_UnregisteredAccountName;
      }
      let target = p['target'];
      delete p['target'];
      UpdateProduct(target,p,u,(msg,status)=>{
          res.json({msg: msg, status:status}); 
        })
    });
  
  //
  function RemoveRecipe(recipeName,user,done) {
    let target = {name: recipeName['name'], author:user};
    Food.findOneAndRemove(target, (err,data)=>{
        if (err) {
          console.log('err', err.message);
          done(err.message,0);
        } else {
          (data)?
            done(`Recipe ${data['name']} was removed`,1)
            :done(`Recipe ${target['name']} of user ${user} not found`,0);
        }   
    });
  }
  
  app.post("/api/removerecipe",(req,res)=>{
      let target =req.body;
      let u = req.session.userId;
      if (!u) {
        u = c_UnregisteredAccountName;
      }   
      RemoveRecipe(target,u,(msg,status)=>{
          res.json({msg: msg, status:status}); 
        })
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// ADMIN TOOLS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
adm = require("./AdminTools");
//adm.importFoodFromFile(Food,'baza.txt',"nabiał","baza","podstawowa");
 //adm.PrintAllExcept(Food,{} );
 //adm.AddLackingKeysToModel(Food,"sugar");
//adm.FindAndReplaceAllDocs(Food,{author: ['test','baza']},'brand','podstawowa','ogólne');
adm.RemoveAllExcept(Food,{author:['NIEZALOG','adam']});
