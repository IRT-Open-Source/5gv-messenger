"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const STAN = require("node-nats-streaming");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
class Messenger {
    constructor(clientId) {
        this.MS_CLUSTER_NAME = 'test-cluster';
        this.logger = new common_1.Logger(Messenger.name);
        this.clientId = null;
        this.onConnectionChange = new rxjs_1.BehaviorSubject(Messenger.DISCONNECTED);
        this.clientId = clientId;
    }
    static getInstance(clientId) {
        if (!Messenger.instance) {
            Messenger.instance = new Messenger(clientId);
            Messenger.instance
                .connect()
                .then(() => Messenger.instance.onConnectionChange.next(this.CONNECTED));
        }
        return Messenger.instance;
    }
    async connect() {
        return new Promise((resolve) => {
            this.stan = STAN.connect(this.MS_CLUSTER_NAME, this.clientId, {
                url: 'nats://message-broker:4222'
            });
            this.stan.on('connect', () => {
                this.logger.log(`Connected to message-broker service: cluster'${this.MS_CLUSTER_NAME}', client-ID ${this.clientId}`);
                resolve();
            });
        });
    }
    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.stan.publish(channel, message, (error, guid) => {
                if (error) {
                    this.logger.error(`Publishing [${guid}]: ${message} failed due to: ${error}`);
                    reject();
                }
                else {
                    this.logger.log(`Published [${guid}]: ${message} `);
                    resolve();
                }
            });
        });
    }
    subscribe(channel) {
        const subscriptionOpts = this.stan
            .subscriptionOptions()
            .setStartWithLastReceived();
        return this.stan.subscribe(channel, subscriptionOpts);
    }
}
exports.Messenger = Messenger;
Messenger.DISCONNECTED = 0;
Messenger.CONNECTED = 1;
//# sourceMappingURL=messenger.js.map