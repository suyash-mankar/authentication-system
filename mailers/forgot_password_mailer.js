const nodeMailer = require("../config/modemailer");

exports.forgotPassword = (forgotPasswordToken) => {
  // set the mail template
  let htmlString = nodeMailer.renderTemplate(
    { forgotPasswordToken: forgotPasswordToken },
    "/forgot_password/forgot_password_template.ejs"
  );
  // send mail
  nodeMailer.transporter.sendMail(
    {
      from: "engineeringresurrection@gmail.com",
      to: forgotPasswordToken.user.email,
      subject: "reset your password",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      }
      console.log("mail delivered", info);
      return;
    }
  );
};
