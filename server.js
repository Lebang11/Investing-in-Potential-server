const express = require('express');
const {hashPassword, comparePassword} = require('./utils/helpers');
const Admin = require('./database/Schema/Admin');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});



// we need to import the user schema
const User = require('./database/Schema/User')

// importing and using body-parser to be able to use json
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// importing database
require('./database');

// base of express app, handles get request 
// this get request finds every user in the database, and responds to the client with a json
app.get('/', async (req, res) => {
  const users = await User.find({}).sort({'name': 1});
  console.log(users);
  res.json(users);
});

// post request where client posts info to backend
app.post('/', async (req, res) => {
  // req is request from client, res is response from server
  // using request body from client to create user
  const name = req.body.name;
  const surname = req.body.surname;
  const phonenumber = req.body.phonenumber;
  const points = req.body.points;
  const editor = req.body.editor;

  //creating new user 
  const newUser = await User.create({ name, surname, phonenumber, points});
  console.log(`New User created by ${editor}`);
  
  res.status(200)
  res.json(newUser);
});


app.post('/points', async (req, res) => {
  const editor = req.body.editor;

  const points = req.body.points;
  await User.updateOne(
    { _id: req.body.id}, 
    {$set: {"points": points}}, 
    {upsert: true}
  )

  console.log(`Points changed by ${editor}`)
  res.status(200)
  res.json({"message": "points changed"})
});

app.post('/admin', async (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = await hashPassword(req.body.password)

  newAdmin = await Admin.create({username, email, password});
  res.status(201)
  console.log(`Admin sign up, ${username}`)
  return res.json(newAdmin);
})

app.post('/admin/login', async (req, res) => {
  const email = req.body.email;
  
  const adminDB = await Admin.findOne({email:email});

  if (!adminDB) {
    res.status(406)
    res.json({"message":'User does not exist'})
  } else {
    const isValid = await comparePassword(req.body.password, adminDB.password)
    
    if (!isValid) {
      res.status(406)
      console.log(`${adminDB.username} password incorrect`)
      return res.json({"message":"Password is incorrect"})
    } else if (isValid) {
      console.log(`${adminDB.username} logged in!`)
      res.status(200)
      return res.json(adminDB)
    }
  }
});

app.post('/email', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'investinginpotential@gmail.com',
      pass: ""
    }
  });

  let mailDetails = {
    from: "investinginpotential@gmail.com",
    to:"investinginpotential@gmail.com",
    subject: "Query from website",
    html: `<!doctype html>
<html>
 <head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Simple Transactional Email</title>
<style>
@media only screen and (max-width: 620px) {
 table.body h1 {
font-size: 28px !important;
margin-bottom: 10px !important;
 }

 table.body p,
table.body ul,
table.body ol,
table.body td,
table.body span,
table.body a {
font-size: 16px !important;
 }

 table.body .wrapper,
table.body .article {
padding: 10px !important;
 }

 table.body .content {
padding: 0 !important;
 }

 table.body .container {
padding: 0 !important;
width: 100% !important;
 }

 table.body .main {
border-left-width: 0 !important;
border-radius: 0 !important;
border-right-width: 0 !important;
 }

 table.body .btn table {
width: 100% !important;
 }

 table.body .btn a {
width: 100% !important;
 }

 table.body .img-responsive {
height: auto !important;
max-width: 100% !important;
width: auto !important;
 }
}
@media all {
 .ExternalClass {
width: 100%;
 }

 .ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%;
 }

 .apple-link a {
color: inherit !important;
font-family: inherit !important;
font-size: inherit !important;
font-weight: inherit !important;
line-height: inherit !important;
text-decoration: none !important;
 }

 #MessageViewBody a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
 }

 .btn-primary table td:hover {
background-color: #cdc59a !important;
 }

 .btn-primary a:hover {
background-color: #cdc59a !important;
border-color: #cdc59a !important;
 }
}
</style>
 </head>
 <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
 <tr>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
 <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

<!-- START CENTERED WHITE CONTAINER -->
<table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

 <!-- START MAIN CONTENT AREA -->
 <tr>
<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
 <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
<tr>
 <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hey Team! We have received a query from ${name}: </p>
<p style="color: rgb(0,0,0);font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${message}</p>
<p style="color: rgb(0,0,0);font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Email them back at ${email}</p>

 </td>
</tr>
 </table>
</td>
 </tr>

<!-- END MAIN CONTENT AREA -->
</table>
<!-- END CENTERED WHITE CONTAINER -->

<!-- START FOOTER -->
<div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
 <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
<tr>
 <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
<span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Investing in Potential</span>
 </td>
</tr>
<tr>
 
</tr>
 </table>
</div>
<!-- END FOOTER -->

 </div>
</td>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
 </tr>
</table>
 </body>
</html>`
  };

  transporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.warn(err);
    } else {
      console.log('Query email successfully received');
    }
  })

  transporter.verify((error, success) => {
    if (error) {
      console.warn(error)
    } else {
      console.warn("Server is ready to take our messages")
    }
  })

  res.json({'message': `${mailDetails}`})

})

const galleryPage = require('./public/scripts/images')
app.use('/gallery', galleryPage)
// listens to port 3000
// install nodemon and use 'nodemon .' in terminal to listen

app.listen(port, () => {
  console.log(`listening at https://investing-in-potential.onrender.com`);
});

// Refer back to frontend :)