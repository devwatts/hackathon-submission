const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const  {
    logStudent,
    getLogs
} = require('./dbOp');
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
});


app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/',function(req,res){
    logStudent(req.query.uid)
    res.status(200).send('Got it');
})

app.get('/logStudents',async function(req,res){
    var x = await getLogs(req.query.date);
    console.log(x)
    res.send(x);

})

app.listen(PORT,function(){
    console.log(`App now running on ${PORT}`)
});

