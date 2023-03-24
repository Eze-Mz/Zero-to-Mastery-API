// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = process.env.CLARIFAI_PAT;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = process.env.CLARIFAI_USER_ID;
const APP_ID = process.env.CLARIFAI_APP_ID;
// Change these to whatever model and image URL you want to use
const MODEL_ID = process.env.CLARIFAI_MODEL_ID;

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
