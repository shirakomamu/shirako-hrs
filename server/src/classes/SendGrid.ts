import appinfo from "appinfo";
import { Client } from "@sendgrid/client";

const REGISTRATION_EMAIL_VERIFICATION_TEMPLATE_ID =
  "d-d01af89c05ff45889c9ec545f2895825";

interface RegistrationEmailVerificationTemplate {
  appName: string; // HRBAC Demo
  appLink: string; // https://domain.link/
  callbackOtp: string; // 000000
  callbackLink: string; // https://domain.link/register?cb=<cbToken>
}

interface RegistrationEmailVerificationOptions {
  callbackOtp: string;
  callbackToken: string;
}

class SendGrid {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client();
    this.client.setApiKey(apiKey);
  }

  public async sendRegistrationEmailVerification(
    to: {
      email: string;
      name?: string;
    },
    options: RegistrationEmailVerificationOptions
  ) {
    const templateData: RegistrationEmailVerificationTemplate = {
      appName: appinfo.name,
      appLink: "https://hrs.shirako.dev/",
      callbackOtp: options.callbackOtp,
      callbackLink: `https://hrs.shirako.dev/register?cb=${options.callbackToken}`,
    };

    const [r] = await this.client.request({
      method: "POST",
      url: "/v3/mail/send",
      body: {
        from: {
          email: "noreply@shirako.dev",
          name: appinfo.name,
        },
        personalizations: [
          {
            to: [to],
            dynamic_template_data: templateData,
          },
        ],
        template_id: REGISTRATION_EMAIL_VERIFICATION_TEMPLATE_ID,
      },
    });

    return r;
  }

  public async checkQuota() {
    const [r] = await this.client.request({
      method: "GET",
      url: "/v3/user/credits",
    });

    return r.body;
  }
}

export default SendGrid;
