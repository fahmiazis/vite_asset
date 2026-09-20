export interface StockOpnameConfig {
  submission_start_day: number
  submission_end_day: number
  borrow_doc_allow_pdf: boolean
  borrow_doc_allow_word: boolean
  borrow_doc_allow_photo: boolean
  borrow_doc_is_required: boolean
  updated_by: string | null
  updated_at: string
}

export interface stockOpnameConfigProps {
  data: StockOpnameConfig
  message: string
  status: string
}

export interface UpdateStockOpnameConfigPayload {
  submission_start_day: number
  submission_end_day: number
  borrow_doc_allow_pdf: boolean
  borrow_doc_allow_word: boolean
  borrow_doc_allow_photo: boolean
  borrow_doc_is_required: boolean
}
