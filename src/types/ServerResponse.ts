import {Attendee} from "./Attendee.ts";
import {Group} from "./Group.ts";

export interface AttendeeServerResponse {
    attendee: Attendee[];
}

export interface GroupServerResponse {
    groups: Group[];
}

export interface UserGroupServerResponse {
    attendeegroups: {
        user: Attendee[],
        group: Group[]
    }
}