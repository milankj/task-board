import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const userResolver: ResolveFn<any> = async (route, state) => {
  const userService = inject(UserService);

  const [tasks, settings] = await Promise.all([
    userService.fetchUserTasks(),
    userService.getUserSettings()
  ])

  return {
    tasks,
    settings
  };
};
