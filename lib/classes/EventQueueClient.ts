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
    GroupChatSessionJoinEvent, ObjectPhysicsDataEvent, ParcelPropertiesEvent,
    TeleportEvent, Vector3
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
        // We must ACK any outstanding events
        this.done = true;
        if (this.currentRequest !== null)
        {
            this.currentRequest.abort();
        }
        const req = {
            'ack': this.ack,
            'done': true
        };
        this.capsRequestXML('EventQueueGet', req).then((data) =>
        {
            const state = new EventQueueStateChangeEvent();
            state.active = false;
            this.clientEvents.onEventQueueStateChange.next(state);
        });
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
            if (data['id'])
            {
                this.ack = data['id'];
            }
            else
            {
                this.ack = undefined;
            }
            try
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
                                    {
                                        const body = event['body'];
                                        const pprop = new ParcelPropertiesEvent();
                                        pprop.RegionDenyAgeUnverified = body['AgeVerificationBlock'][0]['RegionDenyAgeUnverified'];
                                        pprop.MediaDesc = body['MediaData'][0]['MediaDesc'];
                                        pprop.MediaHeight = body['MediaData'][0]['MediaHeight'];
                                        pprop.MediaLoop = body['MediaData'][0]['MediaLoop'];
                                        pprop.MediaType = body['MediaData'][0]['MediaType'];
                                        pprop.MediaWidth = body['MediaData'][0]['MediaWidth'];
                                        pprop.ObscureMedia = body['MediaData'][0]['ObscureMedia'];
                                        pprop.ObscureMusic = body['MediaData'][0]['ObscureMusic'];
                                        pprop.AABBMax = new Vector3([parseInt(body['ParcelData'][0]['AABBMax'][0], 10), parseInt( body['ParcelData'][0]['AABBMax'][1], 10), parseInt(body['ParcelData'][0]['AABBMax'][2], 10)]);
                                        pprop.AABBMin = new Vector3([parseInt(body['ParcelData'][0]['AABBMin'][0], 10), parseInt(body['ParcelData'][0]['AABBMin'][1], 10), parseInt( body['ParcelData'][0]['AABBMin'][2], 10)]);
                                        pprop.AnyAVSounds = body['ParcelData'][0]['AnyAVSounds'];
                                        pprop.Area = body['ParcelData'][0]['Area'];
                                        pprop.AuctionID = Buffer.from(body['ParcelData'][0]['AuctionID'].toArray()).readUInt32LE(0);
                                        pprop.AuthBuyerID = new UUID(String(body['ParcelData'][0]['AuthBuyerID']));

                                        pprop.Bitmap = Buffer.from(body['ParcelData'][0]['Bitmap'].toArray());
                                        pprop.Category = body['ParcelData'][0]['Category'];
                                        pprop.ClaimDate = body['ParcelData'][0]['ClaimDate'];
                                        pprop.ClaimPrice = body['ParcelData'][0]['ClaimPrice'];
                                        pprop.Desc = body['ParcelData'][0]['Desc'];
                                        pprop.GroupAVSounds = body['ParcelData'][0]['GroupAVSounds'];
                                        pprop.GroupID = new UUID(String(body['ParcelData'][0]['GroupID']));
                                        pprop.GroupPrims = body['ParcelData'][0]['GroupPrims'];
                                        pprop.IsGroupOwned = body['ParcelData'][0]['IsGroupOwned'];
                                        pprop.LandingType = body['ParcelData'][0]['LandingType'];
                                        pprop.LocalID = body['ParcelData'][0]['LocalID'];
                                        pprop.MaxPrims = body['ParcelData'][0]['MaxPrims'];
                                        pprop.MediaAutoScale = body['ParcelData'][0]['MediaAutoScale'];
                                        pprop.MediaID = new UUID(String(body['ParcelData'][0]['MediaID']));
                                        pprop.MediaURL = body['ParcelData'][0]['MediaURL'];
                                        pprop.MusicURL = body['ParcelData'][0]['MusicURL'];
                                        pprop.Name = body['ParcelData'][0]['Name'];
                                        pprop.OtherCleanTime = body['ParcelData'][0]['OtherCleanTime'];
                                        pprop.OtherCount = body['ParcelData'][0]['OtherCount'];
                                        pprop.OtherPrims = body['ParcelData'][0]['OtherPrims'];
                                        pprop.OwnerID = body['ParcelData'][0]['OwnerID'];
                                        pprop.OwnerPrims = body['ParcelData'][0]['OwnerPrims'];
                                        pprop.ParcelFlags = Buffer.from(body['ParcelData'][0]['ParcelFlags'].toArray()).readUInt32LE(0);
                                        pprop.ParcelPrimBonus = body['ParcelData'][0]['ParcelPrimBonus'];
                                        pprop.PassHours = body['ParcelData'][0]['PassHours'];
                                        pprop.PassPrice = body['ParcelData'][0]['PassPrice'];
                                        pprop.PublicCount = body['ParcelData'][0]['PublicCount'];
                                        pprop.RegionDenyAnonymous = body['ParcelData'][0]['RegionDenyAnonymous'];
                                        pprop.RegionDenyIdentified = body['ParcelData'][0]['RegionDenyIdentified'];
                                        pprop.RegionPushOverride = body['ParcelData'][0]['RegionPushOverride'];
                                        pprop.RegionDenyTransacted = body['ParcelData'][0]['RegionDenyTransacted'];
                                        pprop.RentPrice = body['ParcelData'][0]['RentPrice'];
                                        pprop.RequestResult = body['ParcelData'][0]['RequestResult'];
                                        pprop.SalePrice = body['ParcelData'][0]['SalePrice'];
                                        pprop.SeeAvs = body['ParcelData'][0]['SeeAVs'];
                                        pprop.SelectedPrims = body['ParcelData'][0]['SelectedPrims'];
                                        pprop.SelfCount = body['ParcelData'][0]['SelfCount'];
                                        pprop.SequenceID = body['ParcelData'][0]['SequenceID'];
                                        pprop.SimWideMaxPrims = body['ParcelData'][0]['SimWideMaxPrims'];
                                        pprop.SimWideTotalPrims = body['ParcelData'][0]['SimWideTotalPrims'];
                                        pprop.SnapSelection = body['ParcelData'][0]['SnapSelection'];
                                        pprop.SnapshotID = new UUID(body['ParcelData'][0]['SnapshotID'].toString());
                                        pprop.Status = body['ParcelData'][0]['Status'];
                                        pprop.TotalPrims = body['ParcelData'][0]['TotalPrims'];
                                        pprop.UserLocation = new Vector3([parseInt(body['ParcelData'][0]['UserLocation'][0], 10), parseInt(body['ParcelData'][0]['UserLocation'][1], 10), parseInt(body['ParcelData'][0]['UserLocation'][2], 10)]);
                                        pprop.UserLookAt = new Vector3([parseInt(body['ParcelData'][0]['UserLookAt'][0], 10), parseInt(body['ParcelData'][0]['UserLookAt'][1], 10), parseInt(body['ParcelData'][0]['UserLookAt'][2], 10)]);
                                        pprop.RegionAllowAccessOverride = body['RegionAllowAccessBlock'][0]['RegionAllowAccessOverride'];
                                        this.clientEvents.onParcelPropertiesEvent.next(pprop);
                                        break;
                                    }
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
                                    case 'ObjectPhysicsProperties':
                                    {
                                        const objData = event['body']['ObjectData'];
                                        for (const obj of objData)
                                        {
                                            const objPhysEvent = new ObjectPhysicsDataEvent();
                                            objPhysEvent.localID = obj.LocalID;
                                            objPhysEvent.density = obj.Density;
                                            objPhysEvent.friction = obj.Friction;
                                            objPhysEvent.gravityMultiplier = obj.GravityMultiplier;
                                            objPhysEvent.physicsShapeType = obj.PhysicsShapeType;
                                            objPhysEvent.restitution = obj.Restitution;

                                            this.clientEvents.onPhysicsDataEvent.next(objPhysEvent);
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
            }
            catch (error)
            {
                console.error(error);
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
                if (!this.done)
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
                            if (attempt < 3 && capability !== 'EventQueueGet')
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
