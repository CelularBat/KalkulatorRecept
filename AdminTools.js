const fs = require("fs");

//EXAMPLE:
//  adm.RemoveAllExcept(Food, {author: ['test','NIEZALOG'],name: 'jajko'} );
// all exclusion parameters are OR
function RemoveAllExcept(Model,except) {
  var exceptQuery = {};
  for (let key in except){
    let negator = Array.isArray(except[key])?'$nin':'$ne';
    exceptQuery[`${key}`]={[negator]: except[key]};
    }; 
  console.log(exceptQuery);
 
  Model.deleteMany(exceptQuery ,(err,data)=>{
    err?
      console.log(err):
      console.log(data);  
    });
}

// Function to test query without final deletion
function PrintAllExcept(Model,except) {
  var exceptQuery = {};
  for (let key in except){
    let negator = Array.isArray(except[key])?'$nin':'$ne';
    exceptQuery[`${key}`]={[negator]: except[key]};
    }; 
  console.log(exceptQuery);
 
  Model.find(exceptQuery ,(err,data)=>{
    err?
      console.log(err):
      console.log(data);  
    });
}

// Function to import data
// Data format:
// name;kj;fat;carb;protein;fiber#
// file must be in utc-8

function importFoodFromFile(FoodModel,File,category,author,brand) {  
  try {
    const data = fs.readFileSync(File, 'utf-8');
    let arr =[];
    const rows = data.split("#");
    rows.forEach((x)=>{
      let a = x.split(";");
      arr.push(a);
      });
     
  if (arr) {
    jsonArr = [];
    arr.forEach((x)=>{
      let kjFromKcal = Math.round(x[1]*4.184);
      let a = {
        name: x[0],
        kcal: x[1],
        kj: kjFromKcal,
        fat: x[2],
        carb: x[3],
        protein: x[4],
        fiber: x[5],
        category: category,
        author: author,
        brand: brand       
      }
      jsonArr.push(a);
    });
    
  
    
    FoodModel.insertMany(jsonArr,(err,data)=>{
      err?
        console.log("Error: ",err)
        :console.log("Database added: ",data);
      });
  }
  
  } catch (err) {
    console.error(err);
  }
}

function AddLackingKeysToModel(Model,key,defaultValue=null){
  let filter = {[key]: {$exists: false}}
  console.log('adding lacking keys...',filter);
  
  Model.updateMany(filter,{[key]: defaultValue},(err,data)=>{
    err?
        console.log("Error: ",err)
        :console.log("Database added: ",data);  
  });
  
}

module.exports = {
  RemoveAllExcept,
  PrintAllExcept,
  importFoodFromFile,
  AddLackingKeysToModel
}