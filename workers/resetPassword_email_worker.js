const queue = require('../config/kue');

const resetPasswordMailer = require('../mailers/reset_password_mailer');

queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);
    // send the mail
    resetPasswordMailer.resetPassword(job.data);
    done();
})