import {useMutation, useQuery} from '@tanstack/react-query';
import httpCommon from "../../http-common.ts";
import {Group} from '../../types/Group.ts';
import {GroupServerResponse} from "../../types/ServerResponse.ts";

export function useGroups() {
    const fetchGroups = (): Promise<Group[]> => httpCommon.get<GroupServerResponse>('/groups').then((res) => res.data.groups)
    return useQuery<Group[], Error>({queryKey: ['groups'], queryFn: fetchGroups})
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

