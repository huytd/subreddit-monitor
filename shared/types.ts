export interface HistoryEntry {
  time: number;
  total: number;
  online: number;
}

export interface GroupedHistoryEntry {
  [key: string]: HistoryEntry[]
}
