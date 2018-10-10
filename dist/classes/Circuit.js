"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = require("dgram");
const Packet_1 = require("./Packet");
const PacketAck_1 = require("./messages/PacketAck");
const Message_1 = require("../enums/Message");
const CompletePingCheck_1 = require("./messages/CompletePingCheck");
const operators_1 = require("rxjs/operators");
const FilterResponse_1 = require("../enums/FilterResponse");
const Subject_1 = require("rxjs/internal/Subject");
const __1 = require("..");
class Circuit {
    constructor(clientEvents) {
        this.client = null;
        this.sequenceNumber = 0;
        this.awaitingAck = {};
        this.receivedPackets = {};
        this.active = false;
        this.clientEvents = clientEvents;
        this.onPacketReceived = new Subject_1.Subject();
        this.onAckReceived = new Subject_1.Subject();
    }
    subscribeToMessages(ids, callback) {
        const lookupObject = {};
        ids.forEach((id) => {
            lookupObject[id] = true;
        });
        return this.onPacketReceived.pipe(operators_1.filter((packet) => {
            return lookupObject[packet.message.id] === true;
        })).subscribe(callback);
    }
    sendMessage(message, flags) {
        if (!this.active) {
            throw new Error('Attempting to send a message on a closed circuit');
        }
        const packet = new Packet_1.Packet();
        packet.message = message;
        packet.sequenceNumber = this.sequenceNumber++;
        packet.packetFlags = flags;
        this.sendPacket(packet);
        return packet.sequenceNumber;
    }
    resend(sequenceNumber) {
        if (!this.active) {
            console.log('Resend triggered, but circuit is not active!');
            return;
        }
        if (this.awaitingAck[sequenceNumber]) {
            const toResend = this.awaitingAck[sequenceNumber].packet;
            toResend.packetFlags = toResend.packetFlags | __1.PacketFlags.Resent;
            this.sendPacket(toResend);
        }
    }
    waitForAck(ack, timeout) {
        return new Promise((resolve, reject) => {
            const handleObj = {
                timeout: null,
                subscription: null
            };
            handleObj.timeout = setTimeout(() => {
                if (handleObj.subscription !== null) {
                    handleObj.subscription.unsubscribe();
                    reject(new Error('Timeout'));
                }
            }, timeout);
            handleObj.subscription = this.onAckReceived.subscribe((sequenceNumber) => {
                if (sequenceNumber === ack) {
                    if (handleObj.timeout !== null) {
                        clearTimeout(handleObj.timeout);
                        handleObj.timeout = null;
                    }
                    if (handleObj.subscription !== null) {
                        handleObj.subscription.unsubscribe();
                        handleObj.subscription = null;
                    }
                    resolve();
                }
            });
        });
    }
    init() {
        if (this.client !== null) {
            this.client.close();
        }
        this.client = dgram.createSocket('udp4');
        this.client.on('listening', () => {
        });
        this.client.on('message', (message, remote) => {
            if (remote.address === this.ipAddress) {
                this.receivedPacket(message);
            }
        });
        this.client.on('error', (error) => {
        });
        this.active = true;
    }
    shutdown() {
        Object.keys(this.awaitingAck).forEach((sequenceNumber) => {
            clearTimeout(this.awaitingAck[parseInt(sequenceNumber, 10)].timeout);
            delete this.awaitingAck[parseInt(sequenceNumber, 10)];
        });
        Object.keys(this.receivedPackets).forEach((sequenceNumber) => {
            const seq = parseInt(sequenceNumber, 10);
            clearTimeout(this.receivedPackets[seq]);
            delete this.receivedPackets[seq];
        });
        if (this.client !== null) {
            this.client.close();
            this.client = null;
            this.onPacketReceived.complete();
            this.onAckReceived.complete();
        }
        this.active = false;
    }
    waitForMessage(id, timeout, messageFilter) {
        return new Promise((resolve, reject) => {
            const handleObj = {
                timeout: null,
                subscription: null
            };
            const timeoutFunc = () => {
                if (handleObj.subscription !== null) {
                    handleObj.subscription.unsubscribe();
                    reject(new Error('Timeout waiting for message of type ' + id));
                }
            };
            handleObj.timeout = setTimeout(timeoutFunc, timeout);
            handleObj.subscription = this.subscribeToMessages([id], (packet) => {
                let finish = false;
                if (packet.message.id === id) {
                    if (messageFilter === undefined) {
                        finish = true;
                    }
                    else {
                        const filterResult = messageFilter(packet.message);
                        if (filterResult === FilterResponse_1.FilterResponse.Finish) {
                            finish = true;
                        }
                        else if (filterResult === FilterResponse_1.FilterResponse.Match) {
                            if (handleObj.timeout !== null) {
                                clearTimeout(handleObj.timeout);
                            }
                            handleObj.timeout = setTimeout(timeoutFunc, timeout);
                        }
                    }
                }
                if (finish) {
                    if (handleObj.timeout !== null) {
                        clearTimeout(handleObj.timeout);
                        handleObj.timeout = null;
                    }
                    if (handleObj.subscription !== null) {
                        handleObj.subscription.unsubscribe();
                        handleObj.subscription = null;
                    }
                    resolve(packet.message);
                }
            });
        });
    }
    sendPacket(packet) {
        if (packet.packetFlags & __1.PacketFlags.Reliable) {
            this.awaitingAck[packet.sequenceNumber] =
                {
                    packet: packet,
                    timeout: setTimeout(this.resend.bind(this, packet.sequenceNumber), 1000),
                    sent: new Date().getTime()
                };
        }
        let dataToSend = Buffer.allocUnsafe(packet.getSize());
        dataToSend = packet.writeToBuffer(dataToSend, 0);
        if (this.client !== null) {
            this.client.send(dataToSend, 0, dataToSend.length, this.port, this.ipAddress, (err, bytes) => {
            });
        }
        else {
            console.error('Attempted to send packet but UDP client is null');
        }
    }
    ackReceived(sequenceNumber) {
        if (this.awaitingAck[sequenceNumber]) {
            clearTimeout(this.awaitingAck[sequenceNumber].timeout);
            delete this.awaitingAck[sequenceNumber];
        }
        this.onAckReceived.next(sequenceNumber);
    }
    sendAck(sequenceNumber) {
        const msg = new PacketAck_1.PacketAckMessage();
        msg.Packets = [
            {
                ID: sequenceNumber
            }
        ];
        this.sendMessage(msg, 0);
    }
    getOldestUnacked() {
        let result = 0;
        let oldest = -1;
        const keys = Object.keys(this.awaitingAck);
        keys.forEach((seqID) => {
            const nSeq = parseInt(seqID, 10);
            if (oldest === -1 || this.awaitingAck[nSeq].sent < oldest) {
                result = nSeq;
                oldest = this.awaitingAck[nSeq].sent;
            }
        });
        return result;
    }
    expireReceivedPacket(sequenceNumber) {
        if (this.receivedPackets[sequenceNumber]) {
            delete this.receivedPackets[sequenceNumber];
        }
    }
    receivedPacket(bytes) {
        const packet = new Packet_1.Packet();
        try {
            packet.readFromBuffer(bytes, 0, this.ackReceived.bind(this), this.sendAck.bind(this));
        }
        catch (erro) {
            console.error(erro);
            return;
        }
        if (this.receivedPackets[packet.sequenceNumber]) {
            clearTimeout(this.receivedPackets[packet.sequenceNumber]);
            this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);
            console.log('Ignoring duplicate packet: ' + packet.message.name);
            return;
        }
        this.receivedPackets[packet.sequenceNumber] = setTimeout(this.expireReceivedPacket.bind(this, packet.sequenceNumber), 10000);
        if (packet.message.id === Message_1.Message.PacketAck) {
            const msg = packet.message;
            msg.Packets.forEach((obj) => {
                this.ackReceived(obj.ID);
            });
        }
        else if (packet.message.id === Message_1.Message.StartPingCheck) {
            const msg = packet.message;
            const reply = new CompletePingCheck_1.CompletePingCheckMessage();
            reply.PingID = {
                PingID: msg.PingID.PingID
            };
            this.sendMessage(reply, 0);
        }
        this.onPacketReceived.next(packet);
    }
}
exports.Circuit = Circuit;
//# sourceMappingURL=Circuit.js.map