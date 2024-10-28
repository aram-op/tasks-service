export interface Task {
  id: string,
  title: string,
  description: string,
  dueDate: string,
  priority: TaskPriority,
  status: TaskStatus
}

export enum TaskPriority {
  LOW = 'PRIORITY_LOW',
  MEDIUM = 'PRIORITY_MEDIUM',
  HIGH = 'PRIORITY_HIGH',
  CRITICAL = 'PRIORITY_CRITICAL'
}

export enum TaskStatus {
  TODO = 'STATUS_TODO',
  IN_PROGRESS = 'STATUS_IN_PROGRESS',
  COMPLETED = 'STATUS_COMPLETED'
}
