const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest_clone");

// Define the schema for the post
const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
  },
});

// Create the Post model using the schema
module.exports = mongoose.model("Post", postSchema);
