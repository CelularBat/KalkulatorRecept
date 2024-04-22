const {c_UnregisteredAccountName} = require('./config');

function FoodAPI_Setup(app,Food) {
 
  function AddProduct(product,done) {
    let f = new Food(product);
    f.save((err,data)=>{
        if (err) {
          console.log('err', err.message);
          done(err.message,0);
        } else {
          console.log('Added Product:',data['name']);
          done(`${data['name']} added`,1);
        }    
      });
  };
  
  function UpdateProduct(productName,newData,user,done) {
    let target = {name: productName['name'], brand: productName['brand'], author:user};
    Food.findOneAndUpdate(target,newData, (err,data)=>{
      console.log(data);
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
      } else {  //we are doubling author.default key here, but anyway
        p.author = c_UnregisteredAccountName;
      }
      
      if (! p.public) {
        p.public = false; //dirty fix for stupid checkboxes submiting nothing when unchecked
      }
      AddProduct(p,(msg,status)=>{
        res.json({msg: msg, status:status});
        });
    });
  
  app.post("/api/updatep",(req,res)=>{
      let p =req.body;
      let u = req.session.userId;
      if (!u) {
        u = c_UnregisteredAccountName;
      }
      if (! p.public) {
        p.public = false; //dirty fix for stupid checkboxes submiting nothing when unchecked
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
        u = c_UnregisteredAccountName;
      }   
      RemoveProduct(target,u,(msg,status)=>{
          res.json({msg: msg, status:status}); 
        })
    });
  
  app.get("/api/getuserp",(req,res)=>{
      let u = req.session.userId;
      if (!u) {
        u = c_UnregisteredAccountName;
      }
      console.log(u);
      Food.find({author:u},(err,user_products)=>{
        if (err) {
          
        } else {
          res.json(user_products);    
        }    
      });  
    });
  
  app.get("/api/getpubp",(req,res)=>{
      let u = req.session.userId;
      if (!u) {
        u = c_UnregisteredAccountName;
      } 
      Food.find({author:{$ne: u},public:{$ne: false} },(err,products)=>{
        if (err) {
          
        } else {
          res.json(products);    
        }    
      });  
    });

}

module.exports = { FoodAPI_Setup };