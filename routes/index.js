/* NodeJs mongodb tutorial - insert update delete records */

var express     = require('express');
var router      = express.Router();
var mongodb     = require('mongodb');
var MongoClient = mongodb.MongoClient;

var dburl = "mongodb://localhost:27017/attendance";

/* GET products listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('student').find().toArray(function(err, docs){
      if(err) throw err;
      res.render('index.jade', {data: docs});
      db.close();
    });
  });
});

router.get('/fetchdata', function(req, res, next) {
   var id = req.query.id;
   MongoClient.connect(dburl, function(err, db) {
    if(err) {  console.log(err); throw err;  }
    data = '';
    db.collection('student').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){
      if(err) throw err;
      res.send(docs);
      db.close();
    });
  });
});

router.post('/add', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('student');
    var student = { student_name: req.body.student_name, usn: req.body.usn, branch: req.body.branch};
    collection.insert(student, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/');
     });
  });
});
router.post('/edit', function(req, res, next) {
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }
    var collection = db.collection('student');
    var student = { student_name: req.body.student_name, usn: req.body.usn, branch: req.body.branch};
    collection.update({'_id':new mongodb.ObjectID(req.body.id)}, {$set:{'student_name': req.body.student_name, 'usn': req.body.usn, 'branch': req.body.branch}}, function(err, result) {
    if(err) { throw err; }
      db.close();
      res.redirect('/');
     });
  });
});

router.get('/delete', function(req, res, next) {
  var id = req.query.id;
  MongoClient.connect(dburl, function(err, db) {
    if(err) { throw err;  }

    db.collection('student', function(err, student) {
      student.deleteOne({_id: new mongodb.ObjectID(id)});
      if (err){
         throw err;
       }else{
          db.close();
          res.redirect('/');
       }
    });
  });
});

module.exports = router;
