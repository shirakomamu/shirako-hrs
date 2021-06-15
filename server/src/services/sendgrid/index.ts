import SendGrid from "src/classes/SendGrid";

export default new SendGrid(process.env.SENDGRID_API_KEY || "");
