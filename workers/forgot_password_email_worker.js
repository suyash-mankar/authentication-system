const queue = require("../config/kue");
const forgotPasswordMailer = require("../mailers/forgot_password_mailer");

queue.process("emails", function (job, done) {
  console.log("inside worker fnc");

  console.log("emails worker is processing a job", job.data);
  // send the mail
  forgotPasswordMailer.forgotPassword(job.data);
  done();
});
