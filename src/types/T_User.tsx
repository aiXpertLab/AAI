export interface UserDB {
  id: number;
  user_me: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  user_website: string;
  user_bank_info: string;
  user_logo: string;
  user_password: string;
  user_status: string;
  user_note: string;
  is_locked: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}
