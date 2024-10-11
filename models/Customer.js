import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  memberNumber: {
    type: Number,
    required: true,
    unique: true  // Ensuring each member number is unique
  },
  interests: {
    type: String,
    required: true
  }
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
