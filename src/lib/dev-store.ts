import 'server-only'

export interface LogEntry {
  id: number
  method: string
  url: string
  path: string      // URL stripped of base API URL
  status: number | null
  ms: number
  ts: number        // Date.now()
  error?: string
}

const MAX = 150
let _logs: LogEntry[] = []
let _seq = 0

export function appendLog(entry: Omit<LogEntry, 'id'>) {
  _logs = [{ ...entry, id: ++_seq }, ..._logs].slice(0, MAX)
}

export function readLogs(after = 0): LogEntry[] {
  return _logs.filter(l => l.id > after)
}

export function clearLogs() {
  _logs = []
  _seq = 0
}
