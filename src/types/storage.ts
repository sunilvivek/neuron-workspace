export interface StorageBreakdown {
  type: string
  size: number
  count: number
}

export interface StorageInfo {
  used: number
  total: number
  breakdown: StorageBreakdown[]
}
