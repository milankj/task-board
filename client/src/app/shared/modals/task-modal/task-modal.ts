import moment from 'moment';
import { ConfirmationModal } from '../confirmation-modal/confirmation-modal';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../user/user.service';

export interface TaskModalData {
  task?: any;
  isEdit?: boolean;
}

@Component({
  selector: 'app-task-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  styleUrl: './task-modal.scss',
  templateUrl: './task-modal.html',
})
export class TaskModal implements OnInit {
  taskForm: FormGroup;
  isEdit = false;

  todayDate = new Date();

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  statusOptions = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'progress' },
    { label: 'Completed', value: 'completed' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskModal>,
    private dialog: MatDialog,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data?: TaskModalData
  ) {
    this.isEdit = !!(data && data.isEdit);

    this.taskForm = this.fb.group({
      task_name: ['', [Validators.required]],
      description: [''],
      story_point: [1, [Validators.required, Validators.min(0)]],
      priority: ['medium', [Validators.required]],
      planned_date: [this.todayDate, [Validators.required]],
      due_date: [null],
      status: ['progress', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.task) {
      this.taskForm.patchValue({
        task_name: this.data.task.task_name || '',
        description: this.data.task.description || '',
        story_point: this.data.task.story_point ?? 1,
        priority: this.data.task.priority || 'medium',
        planned_date: this.data.task.planned_date ? moment(this.data.task.planned_date).toDate() : null,
        due_date: this.data.task.due_date ? moment(this.data.task.due_date).toDate() : null,
        status: this.data.task.status || 'progress',
      });
    }

    if (this.isEdit) {
      this.taskForm.get('status')?.disable();
    }
  }

  get plannedDate(): Date | null {
    return this.taskForm.get('planned_date')?.value
      ? new Date(this.taskForm.get('planned_date')!.value!)
      : null;
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      console.log("this.taskForm.value", this.taskForm.value);

      const formData = this.taskForm.getRawValue();
      this.dialogRef.close({
        isEdit: this.isEdit,
        taskData: {
          ...formData,
          planned_date: formData.planned_date ? moment(formData.planned_date).format('YYYY-MM-DD') : null,
          due_date: formData.due_date ? moment(formData.due_date).format('YYYY-MM-DD') : null,
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  async onDelete() {
    const taskId = this.data?.task?.tasks_id;
    if (taskId) {
      const confirmRef = this.dialog.open(ConfirmationModal, {
        width: '400px',
        data: {
          title: 'Delete Task',
          message: 'Are you sure you want to delete this task?',
          confirmText: 'Yes',
          cancelText: 'No',
          confirmColor: 'warn'
        }
      });

      confirmRef.afterClosed().subscribe(async (confirmed) => {
        if (confirmed) {
          const result = await this._userService.deleteTask(taskId);
          if (result) {
            this.dialogRef.close({
              isDelete: true,
            });
          }
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
