import moment from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { BoardColumn, Task } from '../shared/models/tasks.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private _taskListSubj: BehaviorSubject<any>;
    public taskList: Observable<any>;

    public totalTasks$: Observable<number>;
    public totalStoryPoints$: Observable<number>;
    public dailyPlannedPoints$: Observable<number>;
    public weeklyPlannedPoints$: Observable<number>;


    constructor(
        private _http: HttpClient
    ) {
        this._taskListSubj = new BehaviorSubject<any>([]);
        this.taskList = this._taskListSubj.asObservable();

        this.totalTasks$ = this.taskList.pipe(
            map((columns: BoardColumn[]) =>
                (columns || []).reduce((total, col) => total + (col.tasks ? col.tasks.length : 0), 0)
            )
        );

        this.totalStoryPoints$ = this.taskList.pipe(
            map((columns: BoardColumn[]) =>
                (columns || []).reduce((total, col) =>
                    total + (col.tasks || []).reduce((sum, task) => sum + (Number(task.story_point) || 0), 0), 0
                )
            )
        );

        this.dailyPlannedPoints$ = this.taskList.pipe(
            map((columns: BoardColumn[]) => this.getDailyPlannedPoints(new Date(), columns))
        );

        this.weeklyPlannedPoints$ = this.taskList.pipe(
            map((columns: BoardColumn[]) => this.getWeeklyPlannedPoints(new Date(), columns))
        );

    }

    getUserSettings(): Promise<any> {

        return firstValueFrom(
            this._http.get<any>(`api/users/settings`)
        ).then((res) => res.data)
            .catch(error => error);
    }

    updateUserSettings(id: string, data: any): Promise<any> {

        return firstValueFrom(
            this._http.put<any>(`api/users/settings/${id}`, data)
        ).then((res) => res.data)
            .catch(error => error);
    }

    fetchUserTasks(): Promise<any> {
        return firstValueFrom(
            this._http.get<any>(`api/tasks`)
        ).then((res) => {
            this._taskListSubj.next(res.data);
            return res.data
        }).catch(error => error);
    }

    createNewTask(data: any): Promise<any> {
        console.log("data", data);
        return firstValueFrom(
            this._http.post<any>(`api/tasks`, data)
        ).then((res) => {
            console.log("New Task", res.data);
            const new_task = res.data;
            const updated_list = this._taskListSubj.value.map((column: BoardColumn) =>
                column.id === new_task.status
                    ? {
                        ...column,
                        tasks: [...column.tasks, new_task]
                    }
                    : column
            );
            this._taskListSubj.next(updated_list);
            return res.data
        }).catch(error => { throw error });

    }

    editTask(task_id: String, data: any): Promise<any> {
        return firstValueFrom(
            this._http.put<any>(`api/tasks/${task_id}`, data)
        ).then((res) => {
            const updated_task = res.data;
            const currentValue = this._taskListSubj.value;
            const updated_list = currentValue.find((column: BoardColumn) =>
                column.tasks.some(task => task.tasks_id === task_id)
            );

            if (updated_list) {
                const taskIndex = updated_list.tasks.findIndex(
                    (task: Task) => task.tasks_id === task_id
                );

                if (taskIndex !== -1) {
                    updated_list.tasks[taskIndex] = updated_task;
                }
            }

            const newListIndex = currentValue.findIndex((column: BoardColumn) =>
                column.id === updated_list.id
            );
            if (newListIndex !== -1) {
                currentValue[newListIndex] = updated_list;
            }

            this._taskListSubj.next(currentValue);
            return res.data
        }).catch(error => {
            console.log("error", error);
            throw error;
        });
    }

    notifyTaskListChange(columns: BoardColumn[] = this._taskListSubj.value): void {
        this._taskListSubj.next([...columns]);
    }

    deleteTask(task_id: string): Promise<any> {
        return firstValueFrom(
            this._http.delete<any>(`api/tasks/${task_id}`)
        ).then((res) => {
            const currentValue = this._taskListSubj.value;
            const updated_list = currentValue.map((column: BoardColumn) => ({
                ...column,
                tasks: column.tasks.filter((task: Task) => task.tasks_id !== task_id)
            }));
            this._taskListSubj.next(updated_list);
            return res.data;
        }).catch(error => error);
    }

    updateTaskStatus(task_id: string, newStatus: { status: string }): Observable<any> {
        return this._http.patch<any>(`api/tasks/${task_id}/status`, newStatus);
    }

    getDailyPlannedPoints(targetDate: Date | string = new Date(), columns: BoardColumn[] = this._taskListSubj.value): number {
        if (!columns || !Array.isArray(columns)) return 0;
        const target = moment(targetDate);
        let total = 0;

        for (const col of columns) {
            const status = col.id;
            if (['planned', 'progress', 'completed'].includes(status)) {
                for (const task of col.tasks || []) {
                    if (task.planned_date && moment(task.planned_date).isSame(target, 'day')) {
                        total += Number(task.story_point) || 0;
                    }
                }
            }
        }
        return total;
    }

    getWeeklyPlannedPoints(targetDate: Date | string = new Date(), columns: BoardColumn[] = this._taskListSubj.value): number {
        if (!columns || !Array.isArray(columns)) return 0;
        const target = moment(targetDate);
        let total = 0;

        for (const col of columns) {
            const status = col.id;
            if (['planned', 'progress', 'completed'].includes(status)) {
                for (const task of col.tasks || []) {
                    if (task.planned_date && moment(task.planned_date).isSame(target, 'isoWeek')) {
                        total += Number(task.story_point) || 0;
                    }
                }
            }
        }
        return total;
    }

}
