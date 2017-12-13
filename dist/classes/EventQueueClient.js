"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LLSD = require("llsd");
const request = require("request");
const Long = require("long");
const IPAddress_1 = require("./IPAddress");
const TeleportEvent_1 = require("../events/TeleportEvent");
const TeleportEventType_1 = require("../enums/TeleportEventType");
class EventQueueClient {
    constructor(caps, clientEvents) {
        this.done = false;
        this.currentRequest = null;
        this.clientEvents = clientEvents;
        this.caps = caps;
        this.Get();
    }
    shutdown() {
        if (this.currentRequest !== null) {
            this.currentRequest.abort();
        }
        this.done = true;
    }
    Get() {
        const req = {
            'ack': this.ack,
            'done': this.done
        };
        this.capsRequestXML('EventQueueGet', req).then((data) => {
            if (data['events']) {
                data['events'].forEach((event) => {
                    try {
                        if (event['message']) {
                            switch (event['message']) {
                                case 'EnableSimulator':
                                    break;
                                case 'ParcelProperties':
                                    break;
                                case 'AgentGroupDataUpdate':
                                    break;
                                case 'AgentStateUpdate':
                                    break;
                                case 'TeleportFailed':
                                    {
                                        const tpEvent = new TeleportEvent_1.TeleportEvent();
                                        tpEvent.message = event['body']['Info'][0]['Reason'];
                                        tpEvent.eventType = TeleportEventType_1.TeleportEventType.TeleportFailed;
                                        tpEvent.simIP = '';
                                        tpEvent.simPort = 0;
                                        tpEvent.seedCapability = '';
                                        this.clientEvents.onTeleportEvent.next(tpEvent);
                                        break;
                                    }
                                case 'TeleportFinish':
                                    {
                                        const info = event['body']['Info'][0];
                                        if (info['LocationID']) {
                                            info['LocationID'] = Buffer.from(info['LocationID'].toArray()).readUInt32LE(0);
                                            const regionHandleBuf = Buffer.from(info['RegionHandle'].toArray());
                                            info['RegionHandle'] = new Long(regionHandleBuf.readUInt32LE(0), regionHandleBuf.readUInt32LE(4), true);
                                            info['SimIP'] = new IPAddress_1.IPAddress(Buffer.from(info['SimIP'].toArray()), 0).toString();
                                            info['TeleportFlags'] = Buffer.from(info['TeleportFlags'].toArray()).readUInt32LE(0);
                                            const tpEvent = new TeleportEvent_1.TeleportEvent();
                                            tpEvent.message = '';
                                            tpEvent.eventType = TeleportEventType_1.TeleportEventType.TeleportCompleted;
                                            tpEvent.simIP = info['SimIP'];
                                            tpEvent.simPort = info['SimPort'];
                                            tpEvent.seedCapability = info['SeedCapability'];
                                            this.clientEvents.onTeleportEvent.next(tpEvent);
                                        }
                                        break;
                                    }
                                default:
                                    console.log('Unhandled event:');
                                    console.log(JSON.stringify(event, null, 4));
                            }
                        }
                    }
                    catch (erro) {
                        console.error('Error handling cap');
                        console.error(erro);
                    }
                });
            }
            if (data['id']) {
                this.ack = data['id'];
            }
            else {
                this.ack = undefined;
            }
            if (!this.done) {
                this.Get();
            }
        }).catch((err) => {
            setTimeout(() => {
                if (!this.done) {
                    this.Get();
                }
            }, 5000);
        });
    }
    request(url, data, contentType) {
        return new Promise((resolve, reject) => {
            this.currentRequest = request({
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': contentType
                },
                'uri': url,
                'body': data,
                'rejectUnauthorized': false,
                'method': 'POST',
                'timeout': 1800000
            }, (err, res, body) => {
                this.currentRequest = null;
                if (err) {
                    reject(err);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
    capsRequestXML(capability, data) {
        return new Promise((resolve, reject) => {
            this.caps.getCapability(capability).then((url) => {
                const serializedData = LLSD.LLSD.formatXML(data);
                this.request(url, serializedData, 'application/llsd+xml').then((body) => {
                    try {
                        if (body.indexOf('<llsd>') !== -1) {
                            const parsed = LLSD.LLSD.parseXML(body);
                            resolve(parsed);
                        }
                        else {
                            throw new Error('Not an LLSD response');
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
exports.EventQueueClient = EventQueueClient;
//# sourceMappingURL=EventQueueClient.js.map