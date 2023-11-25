import {Attendee} from "./Attendee.ts";
import {Group} from "./Group.ts";

export interface AttendeeGroup {
    attendee: Attendee,
    group: Group
}