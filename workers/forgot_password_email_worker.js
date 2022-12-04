const queue = require("../config/kue");
const forgotPasswordMailer = require("../mailers/forgot_password_mailer");

// process the job
queue.process("emails", function (job, done) {
  console.log("emails worker is processing a job", job.data);
  // send the mail
  forgotPasswordMailer.forgotPassword(job.data);
  done();
});
