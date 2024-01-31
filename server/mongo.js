const {unregisteredAccountName} = require('./config');

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  sugar: {type:Number, required:true},
  protein: {type:Number, required:true},
  salt: {type:Number, required:false},
  fiber: Number,
  public: {type:Boolean, default:true},
  link: String
});
foodSchema.index({name:1, brand:1},{unique:1}); // makes brand + name combination unique.

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

const User = mongoose.model("User", userSchema);
const Food = mongoose.model("Food", foodSchema);
module.exports = { mongoose, Food, User ,userSchema ,foodSchema, unregisteredAccountName};
