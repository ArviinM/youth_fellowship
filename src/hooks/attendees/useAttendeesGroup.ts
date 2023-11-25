import {useMutation, useQuery} from '@tanstack/react-query';
import httpCommon from "../../http-common.ts";
import {AttendeeGroupServerResponse} from "../../types/ServerResponse.ts";
import {AttendeeGroup} from "../../types/AttendeeGroup.ts";

export function useAttendeeGroup() {
    const fetchAttendeeGroup = (): Promise<AttendeeGroup[]> => httpCommon.get<AttendeeGroupServerResponse>('/attendees-group').then((res) => res.data.attendee_groups)
    return useQuery<AttendeeGroup[], Error>({queryKey: ['attendee_groups'], queryFn: fetchAttendeeGroup})
}

export function useCreateGroup() {
    const addAttendeeGroup = ((group: AttendeeGroup): Promise<AttendeeGroup> => httpCommon.post('/attendees-group', group))
    return useMutation({
        mutationFn: addAttendeeGroup,
        onSuccess: (data) => {
            console.log('Attendee was assigned:', data);
        },
        onError: (error) => {
            console.error('Error assigning the attendee:', error);
        }
    })
}

