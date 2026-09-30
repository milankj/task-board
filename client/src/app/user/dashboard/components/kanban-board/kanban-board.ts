import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TaskModal } from '../../../../shared/modals/task-modal/task-modal';
import { Task, BoardColumn, BoardData } from '../../../../shared/models/tasks.model';
import { UserService } from '../../../user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import moment from 'moment';
import { NotificationService } from '../../../../shared/services/notification.service';


@Component({
  selector: 'app-kanban-board',
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  styleUrl: './kanban-board.scss',
  templateUrl: './kanban-board.html',
})


export class KanbanBoard implements OnInit {

  @Input() boardData!: BoardData;

  @Input() settings!: any;

  moment = moment;

  public name = 'Tracker Board';
  public searchQuery = '';

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private cdr: ChangeDetectorRef,
    private _notification: NotificationService,
  ) { }

  public ngOnInit(): void {
    console.log('Kanban Board initialized:', this.boardData);
  }

  get totalTasks(): number {
    return this.boardData.columns.reduce((total, col) => total + col.tasks.length, 0);
  }

  get totalStoryPoints(): number {
    return this.boardData.columns.reduce((total, col) => {
      return total + col.tasks.reduce((sum, task) => sum + (Number(task.story_point) || 0), 0);
    }, 0);
  }

  public getTasksInCol(column: BoardColumn): Task[] {
    return column.tasks;
  }

  public dropGrid(event: CdkDragDrop<BoardColumn[]>): void {
    moveItemInArray(this.boardData.columns, event.previousIndex, event.currentIndex);
  }

  public drop(event: CdkDragDrop<any[]>, column: BoardColumn): void {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      return;
    } else {

      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = column.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );


      this._userService.updateTaskStatus(task.tasks_id, {
        status: newStatus
      }).subscribe({
        next: (res) => {
          if (res && res.data) {
            Object.assign(task, res.data);
          } else {
            task.status = newStatus;
          }
          this._userService.notifyTaskListChange(this.boardData.columns);
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);

          // 5. Find the task by ID rather than relying on indexes
          const currentIndex = event.container.data.findIndex(
            item => item.tasks_id === task.tasks_id
          );

          if (currentIndex !== -1) {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              currentIndex,
              event.previousIndex
            );
          }

          // Restore previous state & notify task list subscribers
          this._userService.notifyTaskListChange(this.boardData.columns);
          this.cdr.detectChanges();
          this._notification.error(error.error.message || "Failed to Move Task");

        }
      });

    }


  }

  public getTaskTitle(item: Task): string {
    return item && item.task_name ? item.task_name : "";
  }

  public getTaskTag(item: Task): string {
    return item && item.priority ? item.priority : "";
  }

  public editTask(task: Task, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(TaskModal, {
      width: '520px',
      data: { task, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          if (result.isEdit) {
            await this._userService.editTask(task.tasks_id, result.taskData);
            this._notification.success("Task Edited Successfully");
          }
        }
      } catch (error: any) {
        console.log("error", error);
        this._notification.error(error.error.message || 'Failed To Edit Task');
      }
    });
  }

}
