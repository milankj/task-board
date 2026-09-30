
export interface Task {
    task_name: string;
    story_point: number;
    priority: string;
    planned_date: string;
    tasks_id: string;
    description?: string;
    due_date?: string;
}

export interface BoardColumn {
    id: string;
    name: string;
    tasks: Task[];
    // has_more: Boolean,
    // cursor: String;
}

export interface BoardData {
    columns: BoardColumn[];
}