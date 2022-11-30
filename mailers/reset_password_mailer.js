const nodeMailer = require("../config/modemailer");

exports.resetPassword = (resetPasswordToken) => {
  console.log("inside comment mailer");

  let htmlString = nodeMailer.renderTemplate(
    { resetPasswordToken: resetPasswordToken },
    "/reset_password/reset_password.ejs"
  );

  nodeMailer.transporter.sendMail(
    {
      from: "engineeringresurrection@gmail.com",
      to: resetPasswordToken.user.email,
      subject: "Reset your password",
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
