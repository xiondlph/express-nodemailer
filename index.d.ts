import {Application, Response} from "express-serve-static-core";
import nodemailer, {SentMessageInfo} from "nodemailer";

declare module "express-serve-static-core" {
    export interface Application {
        expressNodemailer: {
            transporter: nodemailer.Transporter
        }
    }

    export interface Response {
        sendMail: (to: string, subject: string, text: string, html?: string) => Promise<SentMessageInfo>;
    }
}

declare function expressNodemailer(app: any, options?: object, defaults?: object): void;

export default expressNodemailer;