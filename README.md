[![Build Status](https://travis-ci.org/xiondlph/express-nodemailer.svg?branch=master)](https://travis-ci.org/xiondlph/express-nodemailer)
[![Coverage Status](https://coveralls.io/repos/github/xiondlph/express-nodemailer/badge.svg?branch=master)](https://coveralls.io/github/xiondlph/express-nodemailer?branch=master)
# express-nodemailer
>The small helper for Express that allows you to send email using nodemailer

The typescript support module for **Express**, that allow you to send an email using **Nodemailer** in the route handler by calling a certain method from the response object.

## Install

```bash
# With npm
npm install --save express-nodemailer

# With yarn
yarn add express-nodemailer
```
## Usage

### Initialization
```ts

// Declare module
import expressNodemailer from "express-nodemailer"; 

// The parameters that are used as `options` argument for createTransport method of Nodemailer
const options = {
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: 'user',
        pass: 'pass'
    }
};

// The parameters that are used as `defaults` argument for createTransport method of Nodemailer
const defaults = {
    from: "sender@example.com",
};

// Initialize a module to extends your Express application
expressNodemailer(app, options, defaults); // `app` is the Express application object

// Some Express source code before start server listening...
```

Initialization of `expressNodemailer` extends your **Express** application by mounting a special middleware to it which implements the ability to send en email by calling the `sandMail` method from the response object.

*For direct use of the **Nodemailer** functionality, the `transporter` object itself, created with the given arguments, will be available in the **Express** application object:*

`app.expressNodemailer.transporter`

### Sending an email
Now in your route handler you can send an email by calling `sendMail` like this:
```ts
app.get('/', (req: Request, res: Response) => {
  res.sendMail(
      'user@example.com',
      'subject',
      'path/to/text/template',
      'path/to/html/template'
  ).then((result) => { // On success
      console.info(result) // --> The `SentMessageInfo` object of nodemailer
  }).catch(err => { // On fail
      console.error(err) // --> some catched error during sending
  })
})
```

This method has four arguments:

`sendMail: (to: string, subject: string, text: string, html?: string)`

* **to** - REQUIRED - Comma separated list or an array of recipients email addresses
* **subject** - REQUIRED - The subject of the e-mail
* **text** - REQUIRED - The path to template file for text body of email
* **html** - The path to template file for html body of email

The last two arguments are the paths to the template files that are rendered by same render process as **Express**. For example, if your **Express** application use `jade` view engine, you should also write your email templates in `jade`.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
