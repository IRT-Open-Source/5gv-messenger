import STAN = require('node-nats-streaming');
import { BehaviorSubject } from 'rxjs';
export declare class Messenger {
    private readonly MS_CLUSTER_NAME;
    private static instance;
    static DISCONNECTED: number;
    static CONNECTED: number;
    private logger;
    private stan;
    private clientId;
    onConnectionChange: BehaviorSubject<number>;
    private constructor();
    static getInstance(clientId: string): Messenger;
    private connect;
    publish(channel: string, message: string): Promise<unknown>;
    subscribe(channel: string): STAN.Subscription;
}
