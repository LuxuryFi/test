const express = require('express')
const hbs = require('hbs')




const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://Ender:Ender123@cluster0.plzr1.mongodb.net/test';
app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductDB2");  
    let results = await dbo.collection("products").find({}).toArray();
    res.render('index',{model:results})
})
app.get('/insert',(req,res)=>{
    res.render('newProduct');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    
    
    let error = '';
    let regex = new RegExp('lan.|lan','i'); // tao chuoi regex de tim kiem gan dung
   
    if (nameInput.length < 6){
        error += ' Ten phai dai hon 6 ki tu |';
    }

    if (priceInput <100){
        error += ' Gia phai lon hon 100 | ';
    }

    if (!nameInput.match(regex)){
        error += ' Ten phai bat dau bang lan |';
    }

    if (error) {
        res.render('newProduct', {error: error});
    }
    else {
        let client= await MongoClient.connect(url);  
        let dbo = client.db("ProductDB2"); 
        let newProduct = {productName : nameInput, price:priceInput};
        await dbo.collection("products").insertOne(newProduct);
    
        res.redirect('/');
    }
    


    
})

app.get('/search',(req,res)=>{
    res.render('search')
})
app.post('/doSearch',async (req,res)=>{
    let nameInput = req.body.txtName;
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ProductDB2");  
    let results = await dbo.collection("products").find({productName:nameInput}).toArray();
    res.render('index',{model:results})
})

app.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection('products').deleteOne(condition)
    res.redirect('/');
})
app.get('/Edit',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("products").findOne({"_id" : ObjectID(id)});
    res.render('editSanPham',{model:result});
})
app.post('/doEdit',async (req,res)=>{
    let id= req.body.id;
    let name = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues ={$set : {productName: name,price:priceInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection("products").updateOne(condition,newValues);
    
    res.redirect('/');
})

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")
