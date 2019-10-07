[![Build Status](https://travis-ci.org/xiondlph/express-nodemailer.svg?branch=master)](https://travis-ci.org/xiondlph/express-nodemailer)
[![Coverage Status](https://coveralls.io/repos/github/xiondlph/express-nodemailer/badge.svg?branch=master)](https://coveralls.io/github/xiondlph/express-nodemailer?branch=master)
# express-nodemailer
>Small helper for express that allows you to send email using nodemailer

## Install

```bash
# With npm
npm install --save express-nodemailer

# With yarn
yarn add express-nodemailer
```
## Usage
```ts
import expressNodemailer from "express-nodemailer";

//...

// The options argument for createTransport method in nodemailer
const options = {
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    auth: {
        user: 'user',
        pass: 'pass'
    }
};

// The defaults argument for createTransport method in nodemailer
const defaults = {
    from: "sender@example.com",
};

expressNodemailer(app, options, defaults); // app is the express Application object
```
