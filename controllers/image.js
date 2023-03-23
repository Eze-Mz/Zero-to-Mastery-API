// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '42b0125977704ceaa544984ee3629980';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'h0u1oga6e5vp';
const APP_ID = 'face-recognition';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      user_app_id: {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      model_id: MODEL_ID,
      inputs: [
        { data: { image: { url: req.body.input } } }
      ]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
          response.status.description +
          "\n" +
          response.status.details
        );
        return;
      }

      res.json(response);
    }
  );

};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
