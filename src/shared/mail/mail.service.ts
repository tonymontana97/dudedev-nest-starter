import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {AppConfigService} from "../../config/app/config.service";
import {activationMail} from "../../mail-templates/activation-mail";
import {URL_CONSTANTS} from "../constants/url.constants";
import { SentMessageInfo } from 'nodemailer';
import {resetPasswordMail} from "../../mail-templates/reset-password.mail";

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly appConfigService: AppConfigService
    ) {
    }

    public sendActivationEmail(code: string, to: string): Promise<SentMessageInfo> {
        const body = activationMail(URL_CONSTANTS.EMAIL_ACTIVATION(this.appConfigService.domain, code));
        return this.sendMail(body, 'E-mail activation', to);
    }

    public resetPasswordEmail(code: string, to: string) {
        const body = resetPasswordMail(URL_CONSTANTS.EMAIL_PASSWORD_RESET(this.appConfigService.domain, code));
        return this.sendMail(body, 'Reset password', to);
    }

    private sendMail(text: string, subject: string, to: string[] | string): Promise<SentMessageInfo>  {
        return this.mailerService.sendMail({
            from: `noreplay@${this.appConfigService.domain}`,
            to,
            subject,
            html: text
        })
    }
}
