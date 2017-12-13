export declare class AckHandler {
    static acksToSend: number[];
    static receivedAck(ackID: number): void;
    static sendAck(ackID: number): void;
}
