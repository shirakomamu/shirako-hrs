// import appinfo from "appinfo";
import fs from "fs";
import { promisify } from "util";
import { Client } from "@sendgrid/client";

const readFile = promisify(fs.readFile);

// const REGISTRATION_EMAIL_VERIFICATION_TEMPLATE_ID =
//   "d-d01af89c05ff45889c9ec545f2895825";

// interface RegistrationEmailVerificationTemplate {
//   appName: string; // Shirako Eats
//   appLink: string; // https://domain.link/
//   callbackOtp: string; // 000000
//   callbackLink: string; // https://domain.link/register?cb=<cbToken>
// }

// interface RegistrationEmailVerificationOptions {
//   callbackOtp: string;
//   callbackToken: string;
// }

interface SendMailOptions {
  from: {
    email: string;
    name: string;
  };
  reply_to?: {
    email: string;
    name: string;
  };
  content: {
    type: string; // "text/html"
    value: string; // "<html><p>Hello, world!</p></html>"
  }[];
  personalizations: {
    subject: string;
    to: {
      email: string;
      name: string;
    }[];
  }[];
}

class SendGrid {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client();
    this.client.setApiKey(apiKey);
  }

  public async sendAccountDeletionConfirmation({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    const html = await readFile(
      "./server/src/templates/HRS_STATIC_account-deleted.html",
      {
        encoding: "utf-8",
      }
    );

    await this.send({
      from: {
        email: "noreply@shirako.dev",
        name: "shirako",
      },
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
      personalizations: [
        {
          subject: "[Shirako Eats] Account deleted",
          to: [{ email, name }],
        },
      ],
    });
  }

  public async send(data: SendMailOptions) {
    const [r] = await this.client.request({
      method: "post",
      url: "/v3/mail/send",
      body: data,
    });

    return r.body;
  }

  public async checkQuota() {
    const [r] = await this.client.request({
      method: "get",
      url: "/v3/user/credits",
    });

    return r.body;
  }
}

export default SendGrid;
