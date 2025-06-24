import mongoose from "mongoose";

const logoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: [true, "You are not logged In..."],
  },
});

const Logout = mongoose.model("Logout", logoutSchema);
export default Logout;
