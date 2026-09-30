import { ChangeDetectorRef, Component } from '@angular/core';
import { KanbanBoard } from './components/kanban-board/kanban-board';
import { Navbar } from '../../shared/components/navbar/navbar';
import { ActivatedRoute } from '@angular/router';
import { BoardColumn, BoardData } from '../../shared/models/tasks.model';
import { TaskModal } from '../../shared/modals/task-modal/task-modal';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  imports: [Navbar, KanbanBoard, MatButtonModule, MatCardModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  boardData: BoardData = {
    columns: []
  };

  settings: { daily_point_limit: number, weekly_point_limit: number };
  totalTasks = 0;
  totalStoryPoints = 0;
  dailyPlannedPoints = 0;
  weeklyPlannedPoints = 0;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _userService: UserService,
    private cdr: ChangeDetectorRef,
    private _notification: NotificationService,
  ) {
    const { settings } = route.snapshot.data['data'];
    this._unsubscribeAll = new Subject();

    this.settings = settings;
  }

  ngOnInit(): void {
    this._userService.taskList.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      if (data && data.length) {
        this.boardData = { columns: [...data] };
        this.cdr.markForCheck();
      }
    });

    this._userService.totalTasks$.pipe(takeUntil(this._unsubscribeAll)).subscribe(total => {
      this.totalTasks = total;
      this.cdr.markForCheck();
    });

    this._userService.totalStoryPoints$.pipe(takeUntil(this._unsubscribeAll)).subscribe(points => {
      this.totalStoryPoints = points;
      this.cdr.markForCheck();
    });

    this._userService.dailyPlannedPoints$.pipe(takeUntil(this._unsubscribeAll)).subscribe(points => {
      this.dailyPlannedPoints = points;
      this.cdr.markForCheck();
    });

    this._userService.weeklyPlannedPoints$.pipe(takeUntil(this._unsubscribeAll)).subscribe(points => {
      this.weeklyPlannedPoints = points;
      this.cdr.markForCheck();
    });
  }

  public addTaskToColumn(column: BoardColumn): void {
    const dialogRef = this.dialog.open(TaskModal, {
      width: '520px',
      data: { isEdit: false, task: { status: column.id } }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result && !result.isDelete && result.taskData) {
          const taskData = result.taskData;
          if (result.isEdit) {
            // Edit handled in Kanban Component
          } else {
            await this._userService.createNewTask(taskData);
            this._notification.success("Task Created Successfully");
          }
        }
      } catch (error: any) {
        console.log("error", error);
        this._notification.error(error.error.message || 'Failed To Create Task');
      }

    });
  }

  public addTask(): void {
    if (this.boardData.columns.length > 0) {
      this.addTaskToColumn(this.boardData.columns[0]);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(0);
    this._unsubscribeAll.complete();
  }
}
