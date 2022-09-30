const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
sgMail.setApiKey;

export const sendEmail = async (recipient: string, url: string) => {
  // console.log(recipient);

  const msg = {
    to: `${recipient}`,
    from: "stefanjosephdevelopment@gmail.com",
    subject: "Confirm email",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a href=${url}>Click here to confirm your email</a>`,
  };

  const info = await sgMail.send(msg);
  // console.log(info);
};
