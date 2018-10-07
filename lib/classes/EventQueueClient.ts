import {Caps} from './Caps';
import * as LLSD from '@caspertech/llsd';
import * as request from 'request';
import * as Long from 'long';
import {IPAddress} from './IPAddress';
import {ClientEvents} from './ClientEvents';
import {TeleportEventType} from '../enums/TeleportEventType';
import {UUID} from './UUID';
import {Agent} from './Agent';
import {
    EventQueueStateChangeEvent,
    GroupChatEvent,
    GroupChatSessionAgentListEvent,
    GroupChatSessionJoinEvent,
    TeleportEvent
} from '..';

export class EventQueueClient
{
    caps: Caps;
    ack?: number;
    done = false;
    currentRequest: request.Request | null = null;
    private clientEvents: ClientEvents;
    private agent: Agent;

    constructor(agent: Agent, caps: Caps, clientEvents: ClientEvents)
    {
        this.agent = agent;
        this.clientEvents = clientEvents;
        this.caps = caps;
        this.Get();
        const state = new EventQueueStateChangeEvent();
        state.active = true;
        this.clientEvents.onEventQueueStateChange.next(state);
    }
    shutdown()
    {
        const state = new EventQueueStateChangeEvent();
        state.active = false;
        this.clientEvents.onEventQueueStateChange.next(state);
        if (this.currentRequest !== null)
        {
            this.currentRequest.abort();
        }
        this.done = true;
    }
    Get()
    {
        const req = {
            'ack': this.ack,
            'done': this.done
        };
        const startTime = new Date().getTime();
        this.capsRequestXML('EventQueueGet', req).then((data) =>
        {
            if (data['events'])
            {
                data['events'].forEach((event: any) =>
                {
                    try
                    {
                        if (event['message'])
                        {
                            // noinspection TsLint
                            switch (event['message'])
                            {
                                case 'EnableSimulator':

                                    /*
                                        {
                                            "body": {
                                                "SimulatorInfo": [
                                                    {
                                                        "Handle": "AALoAAAECwA=",
                                                        "IP": "2FIqRA==",
                                                        "Port": 13029
                                                    }
                                                ]
                                            },
                                            "message": "EnableSimulator"
                                        }
                                    */

                                    break;
                                case 'ParcelProperties':
                                    /*
                                        {
                                            "body": {
                                                "AgeVerificationBlock": [
                                                {

                                                        "RegionDenyAgeUnverified": true
                                                    }
                                                ],
                                                "MediaData": [
                                                    {
                                                        "MediaDesc": "",
                                                        "MediaHeight": 0,
                                                        "MediaLoop": 0,
                                                        "MediaType": "text/html",
                                                        "MediaWidth": 0,
                                                        "ObscureMedia": 0,
                                                        "ObscureMusic": 0
                                                    }
                                                ],
                                                "ParcelData": [
                                                    {
                                                        "AABBMax": [
                                                            256,
                                                            256,
                                                            50
                                                        ],
                                                        "AABBMin": [
                                                            0,
                                                            0,
                                                            0
                                                        ],
                                                        "AnyAVSounds": true,
                                                        "Area": 65536,
                                                        "AuctionID": "AAAAAA==",
                                                        "AuthBuyerID": "00000000-0000-0000-0000-000000000000",
                                                        "Bitmap": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=",
                                                        "Category": 0,
                                                        "ClaimDate": 1333505995,
                                                        "ClaimPrice": 0,
                                                        "Desc": "adoption parent furry parent teen twin cub neko pets adult elf vamp toddleedoo baby child panel brother sister  numbers meshmerized  gacha adoptions adopt family mesh skin shape camp ngi youthspot foster kids mall  zoo train kid primbay\ndupli
                                        city onlinker",
                                                        "GroupAVSounds": true,
                                                        "GroupID": "f2b75b49-8ebc-2a9c-f345-aa2f91adc908",
                                                        "GroupPrims": 18677,
                                                        "IsGroupOwned": true,
                                                        "LandingType": 2,
                                                        "LocalID": 15,
                                                        "MaxPrims": 30000,
                                                        "MediaAutoScale": 1,
                                                        "MediaID": "6bd35c06-2b24-a83e-03f6-f547c65c8556",
                                                        "MediaURL": "",
                                                        "MusicURL": "http://142.4.209.63:8071",
                                                        "Name": "Next Gen Inc. Adoption Agency on the :::: KiD GRiD :::",
                                                        "OtherCleanTime": 0,
                                                        "OtherCount": 4096,
                                                        "OtherPrims": 312,
                                                        "OwnerID": "f2b75b49-8ebc-2a9c-f345-aa2f91adc908",
                                                        "OwnerPrims": 3,
                                                        "ParcelFlags": "NiAUSw==",
                                                        "ParcelPrimBonus": 1,
                                                        "PassHours": 10,
                                                        "PassPrice": 10,
                                                        "PublicCount": 0,
                                                        "RegionDenyAnonymous": true,
                                                        "RegionDenyIdentified": true,
                                                        "RegionDenyTransacted": true,
                                                        "RegionPushOverride": true,
                                                        "RentPrice": 0,
                                                        "RequestResult": 0,
                                                        "SalePrice": 1,
                                                        "SeeAVs": true,
                                                        "SelectedPrims": 1,
                                                        "SelfCount": 0,
                                                        "SequenceID": 0,
                                                        "SimWideMaxPrims": 30000,
                                                        "SimWideTotalPrims": 18993,
                                                        "SnapSelection": true,
                                                        "SnapshotID": "09c4101a-9406-2501-b9b7-dbb60260fd7a",
                                                        "Status": 0,
                                                        "TotalPrims": 18993,
                                                        "UserLocation": [
                                                            131.48399353027344,
                                                            171.41600036621094,
                                                            21.544700622558594
                                                        ],
                                                        "UserLookAt": [
                                                            0.0325143001973629,
                                                            -0.9994710087776184,
                                                            0
                                                        ]
                                                    }
                                                ],
                                                "RegionAllowAccessBlock": [
                                                    {
                                                        "RegionAllowAccessOverride": true
                                                    }
                                                ]
                                            },
                                            "message": "ParcelProperties"
                                        }

                                     */
                                    break;
                                case 'AgentGroupDataUpdate':
                                    /*
                                    {
                                        "body": {
                                            "AgentData": [
                                                {
                                                    "AgentID": "49cc9041-5c53-4c1c-8490-e6bb84cdbacd"
                                                }
                                            ],
                                            "GroupData": [
                                                {
                                                    "AcceptNotices": true,
                                                    "Contribution": 0,
                                                    "GroupID": "06459c46-069f-4de1-c297-c966bd55ab91",
                                                    "GroupInsigniaID": "8dacb5c9-80bc-aae4-6a12-d792b6eb7dc4",
                                                    "GroupName": "Jez Ember Estates",
                                                    "GroupPowers": "AAAgAAQAAAA="
                                                },
                                                {
                                                    "AcceptNotices": true,
                                                    "Contribution": 0,
                                                    "GroupID": "539b5be0-bb18-d0ef-6c07-3326e0130aaf",
                                                    "GroupInsigniaID": "7d7d0b4a-bf5b-dc51-3869-5e0eaa6ad41d",
                                                    "GroupName": "**BOY BEARS MALL**",
                                                    "GroupPowers": "AAAIABgBAAA="
                                                }
                                            ],
                                            "NewGroupData": [
                                                {
                                                    "ListInProfile": true
                                                },
                                                {
                                                    "ListInProfile": true
                                                }
                                            ]
                                        },
                                        "message": "AgentGroupDataUpdate"
                                    }

                                     */
                                    break;
                                case 'AgentStateUpdate':
                                    /*

                                    {
                                        "body": {
                                            "can_modify_navmesh": true,
                                            "has_modified_navmesh": true,
                                            "preferences": {
                                                "access_prefs": {
                                                    "max": "PG"
                                                },
                                                "default_object_perm_masks": {
                                                    "Everyone": 0,
                                                    "Group": 0,
                                                    "NextOwner": 532480
                                                },
                                                "god_level": 0,
                                                "hover_height": 0,
                                                "language": "",
                                                "language_is_public": true
                                            }
                                        },
                                        "message": "AgentStateUpdate"
                                    }
                                     */
                                    break;
                                case 'TeleportFailed':
                                {
                                    const tpEvent = new TeleportEvent();
                                    tpEvent.message = event['body']['Info'][0]['Reason'];
                                    tpEvent.eventType = TeleportEventType.TeleportFailed;
                                    tpEvent.simIP = '';
                                    tpEvent.simPort = 0;
                                    tpEvent.seedCapability = '';

                                    this.clientEvents.onTeleportEvent.next(tpEvent);
                                    break;
                                }
                                case "ChatterBoxSessionStartReply":
                                {
                                    if (event['body'])
                                    {
                                        const gcsje = new GroupChatSessionJoinEvent();
                                        gcsje.sessionID = new UUID(event['body']['session_id'].toString());
                                        gcsje.success = event['body']['success'];
                                        if (gcsje.success)
                                        {
                                            this.agent.addChatSession(gcsje.sessionID);
                                        }
                                        this.clientEvents.onGroupChatSessionJoin.next(gcsje);
                                    }
                                    break;
                                }
                                case 'ChatterBoxInvitation':
                                {
                                    if (event['body'] && event['body']['instantmessage'] && event['body']['instantmessage']['message_params'] && event['body']['instantmessage']['message_params']['id'])
                                    {
                                        const messageParams = event['body']['instantmessage']['message_params'];
                                        const imSessionID = messageParams['id'];


                                        const groupChatEvent = new GroupChatEvent();
                                        groupChatEvent.from = new UUID(messageParams['from_id'].toString());
                                        groupChatEvent.fromName = messageParams['from_name'];
                                        groupChatEvent.groupID = new UUID(messageParams['id'].toString());
                                        groupChatEvent.message = messageParams['message'];

                                        const requestedFolders = {
                                            'method': 'accept invitation',
                                            'session-id': imSessionID
                                        };
                                        this.caps.capsRequestXML('ChatSessionRequest', requestedFolders).then((ignore: any) =>
                                        {
                                            this.agent.addChatSession(groupChatEvent.groupID);

                                            const gcsje = new GroupChatSessionJoinEvent();
                                            gcsje.sessionID = groupChatEvent.groupID;
                                            gcsje.success = true;
                                            this.clientEvents.onGroupChatSessionJoin.next(gcsje);
                                            this.clientEvents.onGroupChat.next(groupChatEvent);
                                        }).catch((err) =>
                                        {
                                            console.error(err);
                                        });
                                    }
                                    break;
                                }
                                case 'ChatterBoxSessionAgentListUpdates':
                                {
                                    if (event['body'])
                                    {
                                        if (event['body']['agent_updates'])
                                        {
                                            Object.keys(event['body']['agent_updates']).forEach((agentUpdate) =>
                                            {
                                                const updObj =  event['body']['agent_updates'][agentUpdate];
                                                const gcsale = new GroupChatSessionAgentListEvent();
                                                gcsale.agentID = new UUID(agentUpdate);
                                                gcsale.groupID = new UUID(event['body']['session_id'].toString());
                                                gcsale.canVoiceChat = false;
                                                gcsale.isModerator = false;
                                                gcsale.entered = (updObj['transition'] === 'ENTER');

                                                if (updObj['can_voice_chat'] === true)
                                                {
                                                    gcsale.canVoiceChat = true;
                                                }
                                                if (updObj['is_moderator'] === true)
                                                {
                                                    gcsale.isModerator = true;
                                                }
                                                this.clientEvents.onGroupChatAgentListUpdate.next(gcsale);
                                            });
                                        }
                                    }
                                    break;
                                }
                                case 'TeleportFinish':
                                {
                                    const info = event['body']['Info'][0];
                                    if (info['LocationID'])
                                    {
                                        info['LocationID'] = Buffer.from(info['LocationID'].toArray()).readUInt32LE(0);

                                        const regionHandleBuf = Buffer.from(info['RegionHandle'].toArray());
                                        info['RegionHandle'] = new Long(regionHandleBuf.readUInt32LE(0), regionHandleBuf.readUInt32LE(4), true);


                                        info['SimIP'] = new IPAddress(Buffer.from(info['SimIP'].toArray()), 0).toString();

                                        info['TeleportFlags'] = Buffer.from(info['TeleportFlags'].toArray()).readUInt32LE(0);

                                        const tpEvent = new TeleportEvent();
                                        tpEvent.message = '';
                                        tpEvent.eventType = TeleportEventType.TeleportCompleted;
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
                    catch (erro)
                    {
                        console.error('Error handling cap');
                        console.error(erro);
                    }
                });
            }
            if (data['id'])
            {
                this.ack = data['id'];
            }
            else
            {
                this.ack = undefined;
            }
            if (!this.done)
            {
                this.Get();
            }
        }).catch((err) =>
        {
            const time = (new Date().getTime()) - startTime;
            if (time > 30000)
            {
                // This is the normal request timeout, so reconnect immediately
                if (!this.done)
                {
                    this.Get();
                }
            }
            else
            {
                console.error('Event queue aborted after ' + time + 'ms. Reconnecting in 5 seconds');

                // Wait 5 seconds before retrying
                setTimeout(() =>
                {
                    if (!this.done)
                    {
                        this.Get();
                    }
                }, 5000);
            }
        });
    }
    request(url: string, data: string, contentType: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            this.currentRequest = request({
                'headers': {
                    'Content-Length': data.length,
                    'Content-Type': contentType
                },
                'uri': url,
                'body': data,
                'rejectUnauthorized': false,
                'method': 'POST',
                'timeout': 1800000 // Super long timeout
            }, (err, res, body) =>
            {
                this.currentRequest = null;
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(body);
                }
            });
        });
    }

    capsRequestXML(capability: string, data: any, attempt: number = 0): Promise<any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            this.caps.getCapability(capability).then((url) =>
            {
                const serializedData = LLSD.LLSD.formatXML(data);
                this.request(url, serializedData, 'application/llsd+xml').then((body: string) =>
                {
                    try
                    {
                        if (body.indexOf('<llsd>') !== -1)
                        {
                            const parsed = LLSD.LLSD.parseXML(body);
                            resolve(parsed);
                        }
                        else
                        {
                            // Retry caps request three times before giving up
                            if (attempt < 3)
                            {
                                return this.capsRequestXML(capability, data, ++attempt);
                            }
                            else
                            {
                                reject(new Error('Not an LLSD response, capability: ' + capability));
                            }
                        }
                    }
                    catch (error)
                    {
                       reject(error);
                    }
                }).catch((err) =>
                {
                    reject(err);
                });
            }).catch((err) =>
            {
                reject(err);
            });
        });
    }
}
