const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//instance  methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return (this.role = "instructor");
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

//mongoose middleware
//若使用者為新用戶或正在更改密碼，則將密碼做雜湊處理
//這裡要寫function不能用arrow fucntion expression會抓不到this是誰
userSchema.pre("save", async function (next) {
  //mongoose裡有this.isNew的屬性
  //this代表mongoDB內的document，若這個document是新的，isNew的屬性就會是true
  if (this.isNew || this.isModified("password")) {
    //將密碼進行雜湊處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
