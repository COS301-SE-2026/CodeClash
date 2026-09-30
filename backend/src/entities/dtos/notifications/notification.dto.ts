
export enum NotificationTypes{
    Success = 'success',
    Error = 'error',
    Pending = 'pending',
    Warning = 'warning',
    Info = 'info'
}

export interface NotificationDTO{
    message:string,
    type: NotificationTypes
}