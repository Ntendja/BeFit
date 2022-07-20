const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('sqlite.DB');

exports.createDB = function() {
   db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS User (" +
            "ID INTEGER PRIMARY KEY, "+
            "email  TEXT unique, " +
            "vorname   TEXT NOT NULL," +
            "nachname  TEXT NOT NULL," +
            "password  TEXT NOT NULL)",
            (fehler, daten) => {
               if(fehler){
                 console.log("Tabelle User konnte nicht erstellt werden (Z. 26)");
                 console.error(fehler);
                }else {
                  console.log("Tabelle User konnte  erstellt werden (Z. 26)");
                  console.error(daten);   
                }
        });
        
        db.run("CREATE TABLE IF NOT EXISTS Timer (" +
            "ID INTEGER PRIMARY KEY, " +
            "UserId INTEGER NOT NULL,"+
            "Name TEXT," +
            "Pause NUMBER NOT NULL,"+
            "Interval NUMBER NOT NULL)",
            (fehler, daten) => {
                if(fehler){
                 console.log("Tabelle Timer konnte nicht erstellt werden (Z. 26)");
                 console.error(fehler);
                }else {
                  console.log("Tabelle Timer konnte  erstellt werden (Z. 26)");
                 console.error(daten);   
                }
         });
        
        
    });
}
exports.db = db