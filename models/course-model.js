const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  instructor: {
    //要連結到user裡面的model
    //type 是mongoose給的primary key
    type: mongoose.Schema.Types.ObjectId,
    //連結到User
    ref: "User",
  },
  students: {
    type: [String],
    default: [],
  },
});
module.exports = mongoose.model("Course", courseSchema);
