const Mailjet = require("node-mailjet");

const sendEmail = async (body) => {
  const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_SECRET1,
    process.env.MAILJET_SECRET2
  );
  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM_EMAIL,
            Name: process.env.MAIL_FROM_NAME,
          },
          To: [
            {
              Email: body.email,
              Name: body.name,
            },
          ],
          Subject: body.subject,
          HTMLPart: body.message,
          CustomID: Math.random().toString(36).substring(7),
        },
      ],
    });
    return { msg: "Email Sent Successfully!" };
  } catch (err) {
    return { msg: err };
  }
};

module.exports.sendEmail = sendEmail;
