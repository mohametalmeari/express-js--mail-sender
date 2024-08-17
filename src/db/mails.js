const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sender: { type: String, required: true },
});

const MailModel = mongoose.model("Mail", MailSchema);

const createMail = (values) =>
  new MailModel(values).save().then((mail) => mail.toObject());
const getMails = () => MailModel.find();
const getMailsBySender = (sender) => MailModel.find({ sender });

module.exports = {
  MailModel,
  createMail,
  getMails,
  getMailsBySender,
};
