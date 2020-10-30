const clarifai = require("clarifai");

//give the key to the api to use it
const app = new Clarifai.App({
  apiKey: "58d9f76643344f48bda3282dae1b1519",
});

const handleApiCall = (req, res) => {
  app.models //! API de Clarifai--no termino de entender como funciona
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) //!Método predict al que le doy como valores el tipo de modelo que quiero usar y la imagen que quiero analizar; devuelve una promesa
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with api"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
