import {useMutation, useQuery} from '@tanstack/react-query';
import httpCommon from "../../http-common.ts";
import {Attendee} from '../../types/Attendee.ts';
import {AttendeeServerResponse} from "../../types/ServerResponse.ts";

export interface AttendeeAgeGroupSizes {
    group_id: number;
    teenager: number;
    young_adult: number;
    adult_parents: number;
    elders: number;
}
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

export function useAttendeeAgeGroup() {
    const fetchAttendeeAgeGroup = (): Promise<AttendeeAgeGroupSizes[]> => {
        return httpCommon.get('/attendee')
            .then((response) => {
                // Initialize an object to store the counts of each age group
                const groupSizes: Record<number, AttendeeAgeGroupSizes> = {};

                response.data.attendee.forEach((attendee: Attendee) => {
                    const ageGroup = getAgeGroup(attendee.age) as keyof AttendeeAgeGroupSizes;

                    // Check if groupId is a valid number
                    if (attendee.attendee_group && attendee.attendee_group.groupsID) {
                        const groupId = attendee.attendee_group.groupsID;

                        if (!groupSizes[groupId]) {
                            groupSizes[groupId] = {
                                group_id: groupId,
                                teenager: 0,
                                young_adult: 0,
                                adult_parents: 0,
                                elders: 0,
                            };
                        }

                        // Increment the count for the corresponding age group
                        groupSizes[groupId][ageGroup]++;
                    } else {
                        console.warn('Invalid groupId for attendee:', attendee);
                    }
                });
                console.log(Object.values(groupSizes))
                return Object.values(groupSizes);

            })
            .catch((error) => {
                console.error('Error fetching attendees:', error);
                throw error;
            });
    };

    return useQuery<AttendeeAgeGroupSizes[], Error>({ queryKey: ['attendeeAgeGroups'], queryFn: fetchAttendeeAgeGroup });
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

export function getAgeGroup(age: number): string {
    if (age >= 8 && age <= 19) {
        return 'teenager';
    } else if (age >= 20 && age <= 29) {
        return 'young adult';
    } else if (age >= 30 && age <= 59) {
        return 'working adults';
    } else if (age >= 60 && age <= 130) {
        return 'elders';
    } else {
        return 'unknown'; // Handle unexpected ages if needed
    }
}

