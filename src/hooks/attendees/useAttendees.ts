import {useMutation, useQuery} from '@tanstack/react-query';
import httpCommon from "../../http-common.ts";
import {Attendee} from '../../types/Attendee.ts';
import {AttendeeServerResponse} from "../../types/ServerResponse.ts";

export function useAttendees() {
    const fetchAttendees = (): Promise<Attendee[]> => httpCommon.get<AttendeeServerResponse>('/attendee').then((res) => res.data.attendee)
    return useQuery<Attendee[], Error>({queryKey: ['attendee'], queryFn: fetchAttendees})
}

export function useCreateAttendee() {
    const addAttendee = ((attendee: Attendee) => httpCommon.post('/attendee', attendee))
    return useMutation({
        mutationFn: addAttendee,
        onSuccess: (data) => {
            console.log('Attendee created:', data);
        },
        onError: (error) => {
            console.error('Error creating attendee:', error);
        }
    })
}

export function useUpdateAttendee() {
    const updateAttendee = ((attendee: Attendee): Promise<Attendee> => httpCommon.post(`/attendee/${attendee.id}`, attendee))
    return useMutation({
        mutationFn: updateAttendee,
        onSuccess: (data) => {
            console.log('Attendee was updated:', data);
        },
        onError: (error) => {
            console.error('Error updating attendee:', error);
        }
    })
}

export function useDeleteAttendee() {
    const updateAttendee = ((attendee: Attendee): Promise<Attendee> => httpCommon.delete(`/attendee/${attendee.id}`,))
    return useMutation({mutationFn: updateAttendee})
}

