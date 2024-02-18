const {unregisteredAccountName} = require('./config');

var mongoose = require("mongoose");
require('mongoose-type-url');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// SCHEMAS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});



const foodSchema = new mongoose.Schema({
  name: {type:String, required:true},
  brand: String,
  category: String,
  author: {type: String,default: unregisteredAccountName},
  kj: {type:Number, required:true},
  kcal: {type:Number, required:true},
  fat: {type:Number, required:true},
  carb: {type:Number, required:true},
  sugar: {type:Number, required:false, default:null},
  protein: {type:Number, required:true},
  salt: {type:Number, required:false, efault:null},
  fiber: {type:Number, required:false, efault:null},
  public: {type:Boolean, default:true},
  link: mongoose.SchemaTypes.Url
});
foodSchema.index({name:1, brand:1},{unique:1}); // makes brand + name combination unique.


const productPortionScheme = new mongoose.Schema({
      productId: {type: Number, required:true},
      weight: {type: Number, required:true}
});

const recipeSchema = new mongoose.Schema({
  name: {type:String, required:true},
  description: {type:String, required:true},
  productsList: [ productPortionScheme ],
  photos: [mongoose.SchemaTypes.Url],
  author: {type: String, default: unregisteredAccountName},
  public: {type:Boolean, default:true}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function SanitizeFoodStr(str) {
  return str.slice(0,30).replace(/[^\s\d\w\-_+\(\)]/,'');
}

foodSchema.pre('save',function(next){
  let document = this;
  
  this.schema.eachPath(function(path,type){
      if (type instanceof mongoose.Schema.Types.String && (document[path]) ) {
        document[path] = SanitizeFoodStr(document[path]);      
      } else if ((type instanceof mongoose.Schema.Types.Number && (document[path]) )) {
        document[path] = Math.min(Math.abs(document[path]),5000);
      } 
    });
  
  next();
});

// https://www.zhenghao.io/posts/verify-image-url
function verifyIfImg(url) {
  return fetch(url, {method: 'HEAD'}).then( (res) => {
    return res.headers.get('Content-Type').startsWith('image')
  });
}

/*recipeSchema.pre('save',function(next){
   let ph = this[photos];
   for (x in ph){
      x.then(());
   }
   next();
} */

const User = mongoose.model("User", userSchema);
const Food = mongoose.model("Food", foodSchema);
const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = { mongoose, Food, User, Recipe, userSchema ,foodSchema, recipeSchema};
