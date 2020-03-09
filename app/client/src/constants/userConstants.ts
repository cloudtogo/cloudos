export type User = {
  id: string;
  email: string;
  currentOrganizationId: string;
  organizationIds: string[];
  applications: UserApplication[];
};

export interface UserApplication {
  id: string;
  name: string;
}

export const CurrentUserDetailsRequestPayload = {
  id: "profile",
};
