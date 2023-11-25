import {Attendee} from "./Attendee.ts";
import {Group} from "./Group.ts";
import {AttendeeGroup} from "./AttendeeGroup.ts";

export interface AttendeeServerResponse {
    attendee: Attendee[];
}

export interface GroupServerResponse {
    groups: Group[];
}

export interface AttendeeGroupServerResponse {
    attendee_groups: AttendeeGroup[]
}