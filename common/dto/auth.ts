export interface MemberRegistrationDto {
  username: string;
  displayName: string;
  discriminator?: number;
  password: string;
  email?: string | null;
}
