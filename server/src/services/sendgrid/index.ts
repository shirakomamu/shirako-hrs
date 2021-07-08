import SendGrid from "server/classes/SendGrid";

export default new SendGrid(process.env.SENDGRID_API_KEY || "");
