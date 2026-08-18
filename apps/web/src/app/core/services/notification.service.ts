import { Injectable, signal } from '@angular/core';
import type { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);

  private nextId = 0;

  show(message: string, type: Notification['type'] = 'info', duration = 4000): void {
    const id = String(this.nextId++);
    const notification: Notification = { id, message, type };
    this.notifications.update((list) => [...list, notification]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
