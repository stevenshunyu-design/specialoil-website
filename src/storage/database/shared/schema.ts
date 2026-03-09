// 询盘类型定义
export interface Inquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  product_category: string | null;
  port_of_destination: string;
  estimated_quantity: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type NewInquiry = Omit<Inquiry, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'> & {
  status?: string;
  notes?: string | null;
};
