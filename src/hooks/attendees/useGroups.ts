import {useMutation, useQuery} from '@tanstack/react-query';
import httpCommon from "../../http-common.ts";
import {Group} from '../../types/Group.ts';
import {GroupServerResponse} from "../../types/ServerResponse.ts";

interface AttendeeGroup {
    group: {
        id: number;
        attendee_groups: {
            attendee: {
                city: string;
            }
        }[]
    }
}

export function useGroups() {
    const fetchGroups = (): Promise<Group[]> => httpCommon.get<GroupServerResponse>('/groups').then((res) => res.data.groups)
    return useQuery<Group[], Error>({queryKey: ['groups'], queryFn: fetchGroups})
}

export function useGroupSizes() {
    const fetchGroupSizes = (): Promise<Record<number, string[]>> => {
        return httpCommon.get('/groups-sizes')
            .then((response) => {
                const groupSizes: Record<number, string[]> = {};
                response.data.attendee_groups.forEach((attendeeGroup: AttendeeGroup) => {
                    const groupId = attendeeGroup.group.id;
                    const cities = attendeeGroup.group.attendee_groups.map((attendeeData) => attendeeData.attendee.city);
                    groupSizes[groupId] = cities;
                });
                
                return groupSizes;
            })
            .catch((error) => {
                console.error('Error fetching group sizes:', error);
                throw error;
            });
    };
    return useQuery<Record<number, string[]>, Error>({queryKey: ['groupSizes'], queryFn: fetchGroupSizes})
}


export function useCreateGroup() {
    const addGroup = ((group: Group): Promise<Group> => httpCommon.post('/groups', group))
    return useMutation({
        mutationFn: addGroup,
        onSuccess: (data) => {
            console.log('Group created:', data);
        },
        onError: (error) => {
            console.error('Error creating group:', error);
        }
    })
}

export function useUpdateGroup() {
    const updateGroup = ((group: Group): Promise<Group> => httpCommon.put(`/groups/${group.id}`, group))
    return useMutation({
        mutationFn: updateGroup,
        onSuccess: (data) => {
            console.log('Group was updated:', data);
        },
        onError: (error) => {
            console.error('Error updating group:', error);
        }
    })
}

export function useDeleteGroup() {
    const updateGroup = ((group: Group): Promise<Group> => httpCommon.delete(`/groups/${group.id}`,))
    return useMutation({mutationFn: updateGroup})
}

