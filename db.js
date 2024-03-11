const mongoose = require('mongoose');

const mongoURI="mongodb+srv://tushpandat2002:tushar2002@cluster0.lehjl4i.mongodb.net/inote?retryWrites=true&w=majority&appName=Cluster0";

function connectToMongo(){
  mongoose.connect(mongoURI).then(()=>{
  console.log('connection successful');
}).catch((err)=> console.log(err))

}
module.exports=connectToMongo;