const express= require('express');
const app=express();

//connection server file for Awt
let server=require('./server');
let middleware=require('./middleware');

//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Connecting to database
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospital_management';
let db

MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

//RETRIEVE hospital details
app.get('/hospitaldetails',middleware.checkToken,(req,res)=>{
    console.log("Getting details from hospital collection");
    
        var data=db.collection('hospital_details').find().toArray().then(result=>res.json(result));

});
//SEARCH hospital by name
app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
    
        var name=req.query.name;
        console.log(name);
        var data=db.collection('hospital_details').find({"name": new RegExp(name,'i')}).toArray().then(result=>res.json(result));
    
});

//ADD new hospital details
app.post('/addhospital',middleware.checkToken,(req,res)=>{
    
        var hId=req.body.hId;
        var name= req.body.name;
        var location= req.body.location;
        var address= req.body.address;
        var contactNo= req.body.contactNo;
    var item={
        hId:hId,name:name,location:location,address:address,contactNo:contactNo

    };

    db.collection('hospital_details').insertOne(item,(err,result)=>{
        res.json("Item Inserted")
    })
});


//RETRIEVE ventilator details from database
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("Getting details from ventilator collection");
        var data=db.collection('ventilator_details').find().toArray().then(result=>res.json(result));
});

//SEARCH ventilator by status
app.post('/searchventilatorbystatus',middleware.checkToken,(req,res)=>{
        var status =req.body.status;
        var ventdata=db.collection('ventilator_details').find({"status":status}).toArray().then(result=>res.json(result));
    
});

//SEARCH ventilator by name of the hospital
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name =req.query.name;
    var ventdata=db.collection('ventilator_details').find({"name": new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//ADD a new ventilator
app.post('/addventilator',middleware.checkToken,(req,res)=>{
    
        var hId= req.body.hId;
        var ventilatorId=req.body.ventilatorId;
        var status=req.body.status;
        var name= req.body.name;

    
    var vent={
        hId:hId,ventilatorId:ventilatorId,status:status,name:name

    };

    
    db.collection('ventilator_details').insertMany(vent,function(err,result){
        res.json("Item inserted")
    });
});

//UPDATE ventilator status
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
        var ventid={ventilatorId:req.body.ventilatorId};
        console.log(ventid);
        var values={$set:{status:req.body.status}};
        db.collection('ventilator_details').updateOne(ventid,values,(err,result)=>{
            res.json("1 document updated");
            if(err) throw err;
        });
});

//DELETE a ventilator by VentilatorId
app.delete('/deleteventilator',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    var q1={ventilatorId:myquery};
    db.collection('ventilator_details').deleteOne(q1,(err,obj)=>{
        if(err) throw err;
        res.json("1 document deleted")
    });
});


app.listen(8000,function(){
    console.log('server started');
});

