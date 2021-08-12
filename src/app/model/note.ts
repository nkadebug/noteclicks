export interface Note {
  id: string;
  created_at: number;
  updated_at: number;
  photo?: string;
  description?: string;
  uid: string;
  trashed: boolean;
}
