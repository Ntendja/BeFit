const sha1 = require('sha1');
const database = require("../database.js");

exports.index = function(req,resp) {
    resp.render('pages/index', {});
};

exports.welcome = function(req,resp) {
    if (req.session.authenticated)
       resp.render("pages/welcome");
    else
      resp.redirect("/login");
};

exports.training = function(req, resp) {
    if(req.session.authenticated) {
        const training_type = req.query.type;
        if(!training_type){
         resp.redirect("/welcome");      
        }
         const userId = req.session.user.id;
          database.db.serialize(() => {
            database.db.all(`SELECT * FROM Timer WHERE Name='${training_type}' and  UserId='${userId}'`, (fehler, daten) => {
                if(fehler){
                      // show error 
                     resp.redirect("welcome");
                   }else{
                      console.log("Daten", daten);
                      if(daten.length == 0){
                           resp.render('pages/create_training', {name: training_type});
                      }else {
                        const timer = daten[0];
                        console.log("timer daten", timer)
                        resp.render('pages/training', timer);
                      }
                } 
            });
        });   
    }else {
      resp.redirect("/login");   
    }
}

exports.exercisesPost = function(req, resp) {
    if(req.session.authenticated) {
     const {name, session_length, break_length} = req.body;
     const userId = req.session.user.id;
     database.db.serialize(() => {
        database.db.run("INSERT INTO Timer (Name, UserId, Pause, Interval) " +
            "VALUES ('" + name + "', '" + userId + "','" + break_length + "', '" + session_length + "')",
            (fehler, daten) => {
               if(fehler){
                  // show error 
                 resp.redirect(`/exercises?type=${name}`);
               }else{
                 resp.redirect(`/exercises?type=${name}`);
               } 
        });
    });   
    }else {
      resp.redirect("/login");   
    }
}

exports.loginGet = function(req,resp) {
    var data = {};
    data['titel'] = "Works!";
    resp.render('pages/login', data);
};

exports.loginPost = function(req,resp) {
   const {email, password} = req.body;
   const pasword_encryt = sha1(password);
    database.db.serialize(() => {
        database.db.all(`SELECT * FROM User WHERE email='${email}' and password='${pasword_encryt}'`, (fehler, daten) => {
            if(fehler){
                  // show error 
                 resp.redirect("login");
               }else{
                  if(daten.length == 0){
                    resp.redirect("login");   
                  }else {
                    const user = daten[0];
                    req.session.authenticated = true
                    req.session.user = {vorname: user.vorname, nachname: user.nachname, id: user.ID}
                    resp.redirect("welcome");
                  }
            } 
        });
    });
};

exports.registerGet = function(req,resp) {
    var data = {form: {}, text: ""};
    resp.render('pages/register', data);
};

exports.registerPost = function(req,resp) {
    const {vorname, nachname, email, password, confirm_password} = req.body;
    // Validate user Input
    if(vorname == "" || nachname == "" || email == "" || password == "" || confirm_password == ""){
      resp.render("pages/register", {text: "Please fill in all required fields", form: {...req.body}})   
    }
    
    if(password !== confirm_password) {
     resp.render("pages/register", {text: "Password and Confirm Password missmatch please try again!", form: {...req.body}})   
    }
    // encrypt Password
    const pasword_encryt = sha1(password);
    // save user to db
     database.db.serialize(() => {
        database.db.run(" INSERT INTO User (email, vorname, nachname, password) " +
            "VALUES ('" + email + "', '" + vorname + "', '" +
            nachname + "', '" + pasword_encryt + "')",
            (fehler, daten) => {
               if(fehler){
                  // show error 
                  resp.redirect("login");
               }else{
                 // authenticate user and create session and route to welcome
                database.db.all(`SELECT * FROM User WHERE email='${email}' and password='${pasword_encryt}'`, (fehler, daten) => {
                    const user = daten[0];
                    req.session.authenticated = true
                    req.session.user = {vorname: user.vorname, nachname: user.nachname, id: user.ID}
                    resp.redirect("welcome");
                });
               } 
        });
    });
};


exports.initDB = function(req, resp) {
    database.createDB()
    resp.redirect("/");
}




