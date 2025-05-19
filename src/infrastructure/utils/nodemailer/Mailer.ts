import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '../../env/envConfig'
import { IMailer } from './IMailer';

class Mailer implements IMailer {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  public async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Easy English" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }

}

export default Mailer;