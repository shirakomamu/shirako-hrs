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

export default async ({
  id,
  identity,
  organizationId,
}: {
  id: string;
  identity: {
    provider: string;
    user_id: string;
  };
  organizationId?: string;
}) => {
  const ENDPOINT = "api/v2/jobs/verification-email"; // added onto issuer base url

  const response = await send<EmailVerificationResponse>(ENDPOINT, "post", {
    user_id: id,
    identity,
    organization_id: organizationId,
  });

  return response;
};
