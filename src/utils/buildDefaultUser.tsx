import { UserDB } from "@/src/types";

export const buildDefaultUser = (override?: Partial<UserDB>): UserDB => {
  const now = new Date().toISOString();
  return {
    id: 0,
    user_me: "888",
    user_name: "Default User",
    user_email: "user@aiautoinvoicing.com",
    user_phone: "1-888-168-5868",
    user_address: "Default Address",
    user_website: "",
    user_bank_info: "",
    user_logo: "",
    user_password: "12345678",
    user_status: "active",
    user_note: "",
    is_locked: 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now,
    ...override,
  };
};
