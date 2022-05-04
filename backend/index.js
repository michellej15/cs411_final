const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var count = 0;

var db = mysql.createPool({
  // host: "localhost",
  host: "23.236.52.139",
  user: "root",
  database: "SpotifyDatabase",
  password: "112233",
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// retrieve
app.get("/api/retrieve", (require, response) => {
  db.getConnection((err, connection) => {
    if (err) {
      connection.release();
      throw err;
    }
    const sqlSelect =
      "SELECT DISTINCT s.song_name, s.artists, s.album_name, s.song_id, s.album_id, p.note, p.highlyRated FROM (Personalize p JOIN Sings2 s ON p.song_id = s.song_id)";
    connection.query(sqlSelect, (err, result) => {
      connection.release();
      console.log(result);
      console.log(err);
      response.send(result);
    });
  });
});

// READ
app.get("/api/get", (require, response) => {
  const searchCountry = require.query.search;
  db.getConnection((err, connection) => {
    if (err) {
      connection.release();
      throw err;
    }
    const sqlSelect = "CALL mergeArtistsFull(?);"
    connection.query(sqlSelect, searchCountry, (err, result) => {
      console.log(result);
      console.log(err);
    });
    const sqlSelect2 = "SELECT DISTINCT * FROM Sings2 WHERE country_chart = ? ORDER BY chart_rank;" 
    connection.query(sqlSelect2, searchCountry, (err, result) => {
      connection.release();
      console.log(result);
      console.log(err);
      response.send(result);
    });

  });
});

// Create
app.post("/api/insert", (require, response) => {
  const songId = require.body.songId;
  db.getConnection((err, connection) => {
    if (err) {
      connection.release();
      throw err;
    }
    const sqlInsert =
      "INSERT INTO Personalize(song_id, note, highlyRated) VALUES (?,?,?);";
    connection.query(sqlInsert, [songId, "", "No"], (err, result) => {
      connection.release();
      console.log("1st Insert");
      console.log(err);
    });
  });
});

// Delete
app.delete("/api/delete/:songId", (require, response) => {
  const songId = require.params.songId;
  db.getConnection((err, connection) => {
    if (err) {
      connection.release();
      throw err;
    }

    const sqlDelete = "DELETE FROM Personalize WHERE song_id = ?";
    connection.query(sqlDelete, songId, (err, result) => {
      connection.release();
      console.log(err);
    });
  });
});

// Update
app.put("/api/update/", (require, response) => {
  const songId = require.body.songId;
  const note = require.body.note;
  db.getConnection((err, connection) => {
    if (err) {
      connection.release();
      throw err;
    }
    const sqlUpdate = "UPDATE Personalize SET note = ? WHERE song_id = ?";
    connection.query(sqlUpdate, [note, songId], (err, result) => {
      connection.release();
      if (err) console.log(err);
    });
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("running on port 8080");
});

// app.listen(8080, () => {
//   console.log("running on port 3002");
// });
