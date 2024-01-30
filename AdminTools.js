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



module.exports = {
  RemoveAllExcept,
  PrintAllExcept 
}