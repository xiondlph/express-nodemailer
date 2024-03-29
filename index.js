/**
 * express-nodemailer
 * Copyright(c) 2019 Shukhrat Ismailov <shukhrat@ismax.ru>
 * MIT Licensed
 */

'use strict';

const nodemailer = require('nodemailer');

/**
 * Init ExpressNodemailer
 *
 * @param {Object} app the express application object
 * @param {Object} options the options param for `nodemailer.createTransport` method
 * @param {Object} defaults the defaults param for `nodemailer.createTransport` method
 */
module.exports = (app, options, defaults) => {
    if (app.expressNodemailer) {
        throw new Error("ExpressNodemailer already has been Initialized");
    }

    const transporter = nodemailer.createTransport(options, defaults);

    /**
     *
     * @param {String} to list of receivers
     * @param {String} subject Subject line
     * @param {String} text Path to html body template file
     * @param {String} html Path to text body template file
     * @return {Promise}
     */
    const sendMail = function(to, subject, text, html) {
        return new Promise((resolve, reject) => {

            this.render(text, options, (err, text) => {
                if (err) {
                    reject(err);
                }

                if (html) {
                    this.render(html, options, (err, html) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(transporter.sendMail({
                            to,
                            subject,
                            text,
                            html,
                        }));
                    });
                } else {
                    resolve(transporter.sendMail({
                        to,
                        subject,
                        text,
                    }));
                }
            });
        });
    };

    app.expressNodemailer = {
        transporter,
    };

    app.use((req, res, next) => {
        res.sendMail = sendMail.bind(res);

        next();
    });
};
