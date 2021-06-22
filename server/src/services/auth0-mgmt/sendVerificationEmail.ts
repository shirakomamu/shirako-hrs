/* eslint-disable camelcase */
import { send } from ".";

interface EmailVerificationResponse {
  status: string;
  type: string;
  created_at: string;
  id: string;
}

export default async ({
  id,
  identity,
  organizationId,
}: {
  id: string;
  identity: {
    user_id: string;
    provider: string;
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
