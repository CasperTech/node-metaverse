"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandsBase_1 = require("./CommandsBase");
const Message_1 = require("../../enums/Message");
const __1 = require("../..");
const AcceptFriendship_1 = require("../messages/AcceptFriendship");
const ImprovedInstantMessage_1 = require("../messages/ImprovedInstantMessage");
const InstantMessageDialog_1 = require("../../enums/InstantMessageDialog");
const Utils_1 = require("../Utils");
const DeclineFriendship_1 = require("../messages/DeclineFriendship");
const FindAgent_1 = require("../messages/FindAgent");
const IPAddress_1 = require("../IPAddress");
const FilterResponse_1 = require("../../enums/FilterResponse");
const GrantUserRights_1 = require("../messages/GrantUserRights");
class FriendCommands extends CommandsBase_1.CommandsBase {
    constructor(region, agent, bot) {
        super(region, agent, bot);
        this.friendsList = {};
        this.friendMessages = this.circuit.subscribeToMessages([
            Message_1.Message.OnlineNotification,
            Message_1.Message.OfflineNotification,
            Message_1.Message.TerminateFriendship,
            Message_1.Message.ChangeUserRights
        ], (packet) => __awaiter(this, void 0, void 0, function* () {
            switch (packet.message.id) {
                case Message_1.Message.OnlineNotification:
                    {
                        const msg = packet.message;
                        for (const agentEntry of msg.AgentBlock) {
                            const uuidStr = agentEntry.AgentID.toString();
                            if (this.friendsList[uuidStr] === undefined) {
                                this.friendsList[uuidStr] = (yield this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID));
                                this.friendsList[uuidStr].online = false;
                                this.friendsList[uuidStr].myRights = __1.RightsFlags.None;
                                this.friendsList[uuidStr].theirRights = __1.RightsFlags.None;
                            }
                            if (this.friendsList[uuidStr].online !== true) {
                                this.friendsList[uuidStr].online = true;
                                const friendOnlineEvent = new __1.FriendOnlineEvent();
                                friendOnlineEvent.friend = this.friendsList[uuidStr];
                                friendOnlineEvent.online = true;
                                this.bot.clientEvents.onFriendOnline.next(friendOnlineEvent);
                            }
                        }
                        break;
                    }
                case Message_1.Message.OfflineNotification:
                    {
                        const msg = packet.message;
                        for (const agentEntry of msg.AgentBlock) {
                            const uuidStr = agentEntry.AgentID.toString();
                            if (this.friendsList[uuidStr] === undefined) {
                                this.friendsList[uuidStr] = (yield this.bot.clientCommands.grid.avatarKey2Name(agentEntry.AgentID));
                                this.friendsList[uuidStr].online = false;
                                this.friendsList[uuidStr].myRights = __1.RightsFlags.None;
                                this.friendsList[uuidStr].theirRights = __1.RightsFlags.None;
                            }
                            if (this.friendsList[uuidStr].online !== false) {
                                this.friendsList[uuidStr].online = false;
                                const friendOnlineEvent = new __1.FriendOnlineEvent();
                                friendOnlineEvent.friend = this.friendsList[uuidStr];
                                friendOnlineEvent.online = false;
                                this.bot.clientEvents.onFriendOnline.next(friendOnlineEvent);
                            }
                        }
                        break;
                    }
                case Message_1.Message.TerminateFriendship:
                    {
                        const msg = packet.message;
                        const friendID = msg.ExBlock.OtherID;
                        const uuidStr = friendID.toString();
                        if (this.friendsList[uuidStr] !== undefined) {
                            const event = new __1.FriendRemovedEvent();
                            event.friend = this.friendsList[uuidStr];
                            this.bot.clientEvents.onFriendRemoved.next(event);
                            delete this.friendsList[uuidStr];
                        }
                        break;
                    }
                case Message_1.Message.ChangeUserRights:
                    {
                        const msg = packet.message;
                        for (const rightsEntry of msg.Rights) {
                            let uuidStr = '';
                            if (rightsEntry.AgentRelated.equals(this.agent.agentID)) {
                                uuidStr = msg.AgentData.AgentID.toString();
                                if (this.friendsList[uuidStr] === undefined) {
                                    this.friendsList[uuidStr] = (yield this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated));
                                    this.friendsList[uuidStr].online = false;
                                    this.friendsList[uuidStr].myRights = __1.RightsFlags.None;
                                    this.friendsList[uuidStr].theirRights = __1.RightsFlags.None;
                                }
                                this.friendsList[uuidStr].myRights = rightsEntry.RelatedRights;
                            }
                            else {
                                uuidStr = rightsEntry.AgentRelated.toString();
                                if (this.friendsList[uuidStr] === undefined) {
                                    this.friendsList[uuidStr] = (yield this.bot.clientCommands.grid.avatarKey2Name(rightsEntry.AgentRelated));
                                    this.friendsList[uuidStr].online = false;
                                    this.friendsList[uuidStr].myRights = __1.RightsFlags.None;
                                    this.friendsList[uuidStr].theirRights = __1.RightsFlags.None;
                                }
                                this.friendsList[uuidStr].theirRights = rightsEntry.RelatedRights;
                            }
                            const friendRightsEvent = new __1.FriendRightsEvent();
                            friendRightsEvent.friend = this.friendsList[uuidStr];
                            friendRightsEvent.theirRights = this.friendsList[uuidStr].theirRights;
                            friendRightsEvent.myRights = this.friendsList[uuidStr].myRights;
                            this.bot.clientEvents.onFriendRights.next(friendRightsEvent);
                        }
                        break;
                    }
            }
        }));
    }
    grantFriendRights(friend, rights) {
        return __awaiter(this, void 0, void 0, function* () {
            let friendKey = __1.UUID.zero();
            if (friend instanceof __1.UUID) {
                friendKey = friend;
            }
            else if (friend instanceof __1.Friend) {
                friendKey = friend.getKey();
            }
            else if (typeof friend === 'string') {
                friendKey = new __1.UUID(friend);
            }
            else {
                throw new Error('"Friend" parameter must be Friend, UUID or string');
            }
            const request = new GrantUserRights_1.GrantUserRightsMessage();
            request.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            request.Rights = [
                {
                    'AgentRelated': friendKey,
                    'RelatedRights': rights
                }
            ];
            const sequenceNo = this.circuit.sendMessage(request, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    getFriendMapLocation(friend) {
        return __awaiter(this, void 0, void 0, function* () {
            let friendKey = __1.UUID.zero();
            if (friend instanceof __1.UUID) {
                friendKey = friend;
            }
            else if (friend instanceof __1.Friend) {
                friendKey = friend.getKey();
            }
            else if (typeof friend === 'string') {
                friendKey = new __1.UUID(friend);
            }
            else {
                throw new Error('"Friend" parameter must be Friend, UUID or string');
            }
            const request = new FindAgent_1.FindAgentMessage();
            request.AgentBlock = {
                'Hunter': this.agent.agentID,
                'Prey': friendKey,
                'SpaceIP': IPAddress_1.IPAddress.zero()
            };
            request.LocationBlock = [
                {
                    GlobalX: 0.0,
                    GlobalY: 0.0
                }
            ];
            this.circuit.sendMessage(request, __1.PacketFlags.Reliable);
            const response = yield this.circuit.waitForMessage(Message_1.Message.FindAgent, 10000, (filterMsg) => {
                if (filterMsg.AgentBlock.Hunter.equals(this.agent.agentID) && filterMsg.AgentBlock.Prey.equals(friendKey)) {
                    return FilterResponse_1.FilterResponse.Finish;
                }
                return FilterResponse_1.FilterResponse.NoMatch;
            });
            const globalPos = Utils_1.Utils.RegionCoordinatesToHandle(response.LocationBlock[0].GlobalX, response.LocationBlock[0].GlobalY);
            const mapInfo = yield this.bot.clientCommands.grid.getRegionMapInfo(globalPos.regionX, globalPos.regionY);
            return {
                'regionName': mapInfo.block.name,
                'mapImage': mapInfo.block.mapImage,
                'regionHandle': globalPos.regionHandle,
                'regionX': globalPos.regionX,
                'regionY': globalPos.regionY,
                'localX': Math.floor(globalPos.localX),
                'localY': Math.floor(globalPos.localY),
                'avatars': mapInfo.avatars
            };
        });
    }
    acceptFriendRequest(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const accept = new AcceptFriendship_1.AcceptFriendshipMessage();
            accept.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            accept.TransactionBlock = {
                TransactionID: event.requestID
            };
            accept.FolderData = [];
            accept.FolderData.push({
                'FolderID': this.agent.inventory.findFolderForType(__1.AssetType.CallingCard)
            });
            const sequenceNo = this.circuit.sendMessage(accept, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    rejectFriendRequest(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const reject = new DeclineFriendship_1.DeclineFriendshipMessage();
            reject.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            reject.TransactionBlock = {
                TransactionID: event.requestID
            };
            const sequenceNo = this.circuit.sendMessage(reject, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    sendFriendRequest(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof to === 'string') {
                to = new __1.UUID(to);
            }
            const requestID = __1.UUID.random();
            const agentName = this.agent.firstName + ' ' + this.agent.lastName;
            const im = new ImprovedInstantMessage_1.ImprovedInstantMessageMessage();
            im.AgentData = {
                AgentID: this.agent.agentID,
                SessionID: this.circuit.sessionID
            };
            im.MessageBlock = {
                FromGroup: false,
                ToAgentID: to,
                ParentEstateID: 0,
                RegionID: __1.UUID.zero(),
                Position: __1.Vector3.getZero(),
                Offline: 0,
                Dialog: InstantMessageDialog_1.InstantMessageDialog.FriendshipOffered,
                ID: requestID,
                Timestamp: Math.floor(new Date().getTime() / 1000),
                FromAgentName: Utils_1.Utils.StringToBuffer(agentName),
                Message: Utils_1.Utils.StringToBuffer(message),
                BinaryBucket: Utils_1.Utils.StringToBuffer('')
            };
            im.EstateBlock = {
                EstateID: 0
            };
            const sequenceNo = this.circuit.sendMessage(im, __1.PacketFlags.Reliable);
            return yield this.circuit.waitForAck(sequenceNo, 10000);
        });
    }
    shutdown() {
        this.friendMessages.unsubscribe();
    }
}
exports.FriendCommands = FriendCommands;
//# sourceMappingURL=FriendCommands.js.map