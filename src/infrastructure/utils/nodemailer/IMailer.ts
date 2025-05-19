export interface IMailer {
    sendMail(to: string, subject: string, html: string): Promise<void>;
}
  