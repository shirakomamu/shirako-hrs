/* eslint-disable camelcase */
import { send } from ".";

export interface EmailVerificationResponse {
  status: string;
  type: string;
  created_at: string;
  id: string;
}

// response format
// {
//   type: "verification_email",
//   status: "pending",
//   created_at: "2021-06-26T04:29:34.965Z",
//   id: "job_Yq9miFMnKHOB8SpW",
// }

export default async ({ email }: { email: string }) => {
  const ENDPOINT = "dbconnections/change_password"; // added onto issuer base url

  const response = await send<EmailVerificationResponse>(
    ENDPOINT,
    "post",
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      email,
      connection: "Username-Password-Authentication",
    },
    {
      includeAccessToken: false,
    }
  );

  // it always returns successfully

  return response;
};
