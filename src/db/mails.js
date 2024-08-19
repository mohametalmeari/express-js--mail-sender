const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
});

const MailModel = mongoose.model("Mail", MailSchema);

const createMail = (values) =>
  new MailModel(values).save().then((mail) => mail.toObject());
const getMails = () => MailModel.find();
const getMailsBySender = (sender) => MailModel.find({ sender });
const getMailById = (id) => MailModel.findById(id);

module.exports = {
  MailModel,
  createMail,
  getMails,
  getMailsBySender,
  getMailById,
};
