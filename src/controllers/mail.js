const { Resend } = require("resend");

const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
const resend = new Resend(process.env.RESEND_API_KEY);

const send = async (req, res) => {
  try {
    const { email, subject, message, senderName, senderUsername } = req.body;

    const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        error: `Total size of attachments exceeds 40MB`,
      });
    }

    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));

    if (!email || !subject || !message) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!subject) missingFields.push("subject");
      if (!message) missingFields.push("message");

      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    let sender = `${senderUsername || "admin"}@${process.env.MAIL_DOMAIN}`;
    if (senderName) {
      sender = `${senderName} <${sender}>`;
    }

    const data = await resend.emails.send({
      from: sender,
      to: [email],
      subject: subject,
      html: message,
      attachments,
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

module.exports = { send };
