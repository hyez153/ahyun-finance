export type GroupName = '목회' | '양육' | '사역' | '행사'
export type TransactionType = 'opening_budget' | 'prior_claim' | 'monthly_claim' | 'adjustment'
export type SourceType = 'receipt' | 'migration' | 'claim_batch' | 'manual' | 'system'
export type ReceiptStatus = 'draft' | 'submitted' | 'approved'
export type ClaimBatchStatus = 'draft' | 'confirmed'

export interface BudgetCategory {
  id: number
  group_name: GroupName
  category_name: string
  annual_budget: number
  created_at: string
}

export interface ClaimBatch {
  id: number
  year: number
  month: number
  submission_deadline: string
  claim_date: string
  status: ClaimBatchStatus
  total_amount: number
  created_at: string
}

export interface Receipt {
  id: number
  submitter_name: string
  budget_category_id: number
  claim_batch_id: number | null
  amount: number
  receipt_date: string
  submitted_at: string | null
  vendor_name: string
  memo: string | null
  file_url: string
  file_path: string
  status: ReceiptStatus
  is_claimed: boolean
  created_at: string
  budget_categories?: BudgetCategory
  claim_batches?: ClaimBatch
}

export interface BudgetTransaction {
  id: number
  budget_category_id: number
  transaction_type: TransactionType
  amount: number
  transaction_date: string
  source_type: SourceType
  source_id: number | null
  memo: string | null
  created_at: string
  budget_categories?: BudgetCategory
}

export interface BudgetSummary {
  id: number
  group_name: GroupName
  category_name: string
  annual_budget: number
  used_amount: number
  remaining: number
  usage_rate: number
}

export type Database = {
  public: {
    Tables: {
      budget_categories: {
        Row: BudgetCategory
        Insert: Omit<BudgetCategory, 'id' | 'created_at'>
        Update: Partial<Omit<BudgetCategory, 'id' | 'created_at'>>
      }
      claim_batches: {
        Row: ClaimBatch
        Insert: Omit<ClaimBatch, 'id' | 'created_at'>
        Update: Partial<Omit<ClaimBatch, 'id' | 'created_at'>>
      }
      receipts: {
        Row: Receipt
        Insert: Omit<Receipt, 'id' | 'created_at'>
        Update: Partial<Omit<Receipt, 'id' | 'created_at'>>
      }
      budget_transactions: {
        Row: BudgetTransaction
        Insert: Omit<BudgetTransaction, 'id' | 'created_at'>
        Update: Partial<Omit<BudgetTransaction, 'id' | 'created_at'>>
      }
    }
  }
}
