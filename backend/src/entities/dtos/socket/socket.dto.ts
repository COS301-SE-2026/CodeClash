// Generic types for socket handling 
export type SocketAck<T = unknown> =
    {
        ok: true;
        data: T;
    } |
    {
        ok: false;
        error: string
    };

export type SocketAckCallback<T> = (res: SocketAck<T>) => void;


