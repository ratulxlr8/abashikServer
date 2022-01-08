const express = require("express");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;
const fileUpload = require("express-fileupload");
const cors = require("cors");

const uri =
  "mongodb+srv://Ratul:123456dd@cluster0.mqrsq.mongodb.net/abashik?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  keepAlive: 1,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("photos"));
app.use(fileUpload());
const port = 5000;

app.get("/", (req, res) => {
  res.send("DB working");
});

client.connect((err) => {
  const renterCollection = client.db("abashik").collection("renterCollection");
  const ownerCollection = client.db("abashik").collection("ownerCollection");
  const propertyCollection = client
    .db("abashik")
    .collection("propertyCollection");
  // perform actions on the collection object
  app.post("/renter", (req, res) => {
    const renter = req.body;
    console.log(renter);
    renterCollection.insertOne(renter).then((result) => {
      //   res.send(result.insertCount > 0);
    });
  });
  // adding property
  app.post("/property", (req, res) => {
    const property = req.body;
    console.log(property);
    propertyCollection.insertOne(property).then((result) => {
      //   res.send(result.insertCount > 0);
    });
  });
  //adding property ends

  app.post("/isOwner", (req, res) => {
    const email = req.body.email;
    console.log(email);
    ownerCollection.find({ email: email }).toArray((err, owners) => {
      res.send(owners.length > 0);
    });
  });
  //Photo Uploading
  app.post("/addPhotos", (req, res) => {
    const file = req.files.file;
    const name = req.files.name;
    console.log(name, file);
  });

  app.get("/DashboardInfo", (req, res) => {
    // console.log(req.query.email);
    renterCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        // console.log(documents);
        res.send(documents);
      });
  });
  app.get("/renterList", (req, res) => {
    // console.log(req.query.email);
    renterCollection.find({}).toArray((err, documents) => {
      // console.log(documents);
      res.send(documents);
      console.log(documents);
    });
  });
  app.get("/propertyList", (req, res) => {
    // console.log(req.query.email);
    propertyCollection.find({}).toArray((err, documents) => {
      // console.log(documents);
      res.send(documents);
      console.log(documents);
    });
  });
});
app.listen(5000);
