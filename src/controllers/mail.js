const { Resend } = require("resend");
const {
  getMails,
  createMail,
  getMailsBySender,
  getMailById,
} = require("../db/mails");

const MAX_TOTAL_SIZE = 40 * 1024 * 1024;

const KEY = {
  "mo-dev.site": process.env.RESEND_API_KEY__MO_DEV,
  "web-crafter.site": process.env.RESEND_API_KEY__WEB_CRAFTER,
};

const send = async (req, res) => {
  try {
    const { email, subject, message, senderName, senderUsername, mailDomain } =
      req.body;

    const totalSize = req?.files?.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        error: `Total size of attachments exceeds 40MB`,
      });
    }

    const attachments = req?.files?.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    if (!email || !subject || !message || !mailDomain) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!subject) missingFields.push("subject");
      if (!message) missingFields.push("message");
      if (!mailDomain) missingFields.push("mailDomain");

      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const resend = new Resend(KEY[mailDomain]);

    let sender = `${senderUsername || "admin"}@${mailDomain}`;
    if (senderName) {
      sender = `${senderName} <${sender}>`;
    }

    const data = await resend.emails.send({
      from: sender,
      to: [email],
      subject,
      html: message,
      attachments,
    });

    await createMail({
      _id: data.data.id,
      sender: `${senderUsername || "admin"}@${mailDomain}`,
      recipient: email,
      subject,
    });

    const redirectUrl = req.query.redirect;
    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;

    const mail = await getMailById(id);
    if (!mail) {
      return res.status(404).json({ error: "Mail not found" });
    }

    const mail_domain = mail.sender.split("@")[1];
    const resend = new Resend(KEY[mail_domain]);

    const data = await resend.emails.get(id);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const list = async (_req, res) => {
  try {
    const mails = await getMails();
    return res.status(200).json(mails);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const listBySender = async (req, res) => {
  try {
    const { sender } = req.params;
    const mails = await getMailsBySender(sender);
    return res.status(200).json(mails);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

module.exports = { send, show, list, listBySender };
