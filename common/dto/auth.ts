export interface MemberRegistrationDto {
  username: string;
  displayName: string;
  password: string;
  email?: string | null;
}
