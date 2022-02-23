const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.s6ymm.mongodb.net/rfid-entrance-backend`,{
    useNewUrlParser: true,
});

const studentDetails = new mongoose.Schema({
    studentName:String,
    studentRollNumber:String,
    studentCourse:String,
    uid:String
});

const studentLogs = new mongoose.Schema({
    studentRollNumber:String,
    time:Number,
    date:Date,
    entry:Boolean
});

const studentDetail = new mongoose.model("studentDetail",studentDetails);
const studentLog = new mongoose.model("studentLog",studentLogs);


async function logStudent(uid){
    studentDetail.findOne({ uid: uid }, async function (err, doc) {
        if(doc != null){
            var x = await checkBackLog(doc.studentRollNumber);
            console.log(x)
            if(x){
                var date = new Date().getTime();
                var document = {
                
                        studentRollNumber:doc.studentRollNumber,
                        time:date,
                        date:new Date(),
                        entry:1

                }
                studentLog.create(document,function(err,doc){
                    console.log(doc);
                })
            }else{
                var date = new Date().getTime();
                var document = {
                
                        studentRollNumber:doc.studentRollNumber,
                        time:date,
                        date:new Date(),
                        entry:0

                }
                studentLog.create(document,function(err,doc){
                    console.log(doc);
                })
            }
        }
    });
}
exports.logStudent = logStudent;

async function checkBackLog(rollNumber){
return new Promise(function(resolve,reject){
    studentLog.find({studentRollNumber:rollNumber},function(err,doc){
        if(doc.length == 0){
            resolve(1);
        }else if(doc[0].entry){
            resolve(0);
        }else if(!(doc[0].entry)){
            resolve(1);
        }
    }).sort({ "time" : "descending"})
})
}

async function getLogs(date){
    return new Promise(function(resolve,reject){
        studentLog.find({date: { $gte: new Date(date) }},function(err,doc){
            console.log(doc)
            resolve(doc)
        }).sort({"date":"descending"});
    });
}

exports.getLogs = getLogs;
/*var document = {
    studentName:"Dev Watts",
    studentRollNumber:"1901010026",
    studentCourse:"B. TECH (CSE)",
    uid:"EA 4F D4 0B"
}
studentDetail.create(document,function(err,doc){
    console.log(doc)
}) */