# AUTHENTICATION - SYSTEM

## ⭐ Introduction

A complete authentication system which can be used as a starter code for creating any new application
<br/>

## Features

- Sign up with email / Sign in / Sign out
- Google login/signup (Social authentication)
- re-captcha on both sign up and log in
- Reset password after sign in
- Forgot password (a reset password link will be sent which expires in one hour)
- The password stored in the db is encrypted using bcrypt

##### Display notifications for :

- unmatching passwords during sign up
- incorrect password during sign in

## 🔥 Getting Started With The Project

- Fork the Project in your Repository.
- Clone the Forked Repository in your Local System.
- Install & Configure - NodeJS, MongoDB, Redis Server.
- Create Google OAuth credentials and Google ReCaptcha credentials
- Enter your mail id through which you want to send forgot password mails in config/nodemailer.js
- Create '.env' file & Set the Environment Variables (PASSPORT_GOOGLE_CLIENT_ID, PASSPORT_GOOGLE_CLIENT_SECERET, NODEMAILER_AUTH_PASS, RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY)
- Run 'npm install' in GitBash Terminal
- Go to 'package.json' & inside the 'SCRIPTS', find "start":"...." <br/>
  Change it to - "start": "nodemon index.js",
- Run 'redis-server' in WSL Terminal
- Run 'npm start' in GitBash Terminal
- Enjoy :)

For any issues related to the project, raise an ISSUE in the respective Repository.
<br/>
<br/>

## Screenshots

### Home

![home](https://user-images.githubusercontent.com/84366054/206765609-062e02c6-eabb-4a34-834f-568126e40cc4.PNG)

### Sign Up

![sign up](https://user-images.githubusercontent.com/84366054/206765688-4e161fb6-5542-494a-ab96-600dcd16cc02.PNG)

### Sign In

![sign in](https://user-images.githubusercontent.com/84366054/206765745-94daf0cf-77c3-43a8-90c1-cbc69e06d786.PNG)

### Forgot Password Page

![forgot password](https://user-images.githubusercontent.com/84366054/206765839-03a67db6-6ced-4bc2-811c-edb805a4ede8.PNG)

### Profile Page

![profile](https://user-images.githubusercontent.com/84366054/206765954-1b9a2be8-e8d0-4293-b696-514f5fea3853.PNG)

## 🔨 Tools Used

<div style ="display:flex; flex-wrap:wrap; flex-grow:1">

<img width="150" src="https://www.brainfuel.io/images/node-js-new.png" style="margin: 10px">
<img height="150" width="150" src="https://icon-library.com/images/d234566f9d.png" style="margin: 10px">
<img height="140" width="140" src="https://code.visualstudio.com/assets/apple-touch-icon.png" style="margin: 10px">
<img height="140" width="140" src="https://cdn.icon-icons.com/icons2/2415/PNG/512/redis_original_wordmark_logo_icon_146369.png" style="margin: 10px">
<img src="https://cdn-icons-png.flaticon.com/512/1051/1051277.png" alt="drawing" height="130" width="120" style="margin: 10px" />
<img src="https://icon-library.com/images/css3-icon/css3-icon-28.jpg" alt="drawing" height="150" width="150" style="margin: 10px"/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png" alt="drawing" height="150" width="150" style="margin: 10px"/>
<img src="https://assets-global.website-files.com/61c02e339c11997e6926e3d9/61c2e4a03dbcc261c9c3d01b_618257a89b741e1561c1a370_download.png" alt="drawing" height="100" width="250" style="margin: 10px"/>
<img height="100" width="250" src="https://cdn.buttercms.com/2q5r816LTo2uE9j7Ntic"
style="margin: 10px; background: white">

</div>

   <br/>
   <br/>

- Library:

  - connect-flash
  - connect-mongo
  - cookie-parser
  - crypto
  - dotenv
  - ejs
  - express
  - express-ejs-layouts
  - express-session
  - kue
  - mongoose
  - node-sass-middleware
  - node-fetch
  - nodemailer
  - nodemon
  - noty
  - passport
  - passport-google-oauth
  - passport-local

- Framework: ExpressJS
- Database: MongoDB, RedisDB
- Version Control System: Git
- VCS Hosting: GitHub
- Programming / Scripting: JavaScript
- Front-End: HTML, CSS, EJS
- Runtime Environment: NodeJS
- Integrated Development Environment: VSCode

  <br/>
  <br/>
