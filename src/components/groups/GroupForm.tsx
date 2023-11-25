import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateGroup, useUpdateGroup} from "../../hooks/attendees/useGroups.ts";
import {Group} from '../../types/Group.ts';
import {toast} from "react-toastify";
import {useGroupStore} from "../../store/groupStore.ts";
import {useEffect} from "react";
import {useQueryClient} from '@tanstack/react-query';


const GroupFormSchema = z.object({
    name: z.string({required_error: "Group name is required.",}).min(3, "At least three letters are required."),
    score: z.string()
}).required();

function GroupForm() {
    const selectedGroup = useGroupStore((state) => state.selectedGroup);
    const setSelectedGroup = useGroupStore((state) => state.setSelectedGroup);
    const clearActiveGroup = useGroupStore((state) => state.clearActiveGroup);

    const createGroupMutation = useCreateGroup();
    const updateGroupMutation = useUpdateGroup();

    const queryClient = useQueryClient();

    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<Group>({
        resolver: zodResolver(GroupFormSchema),
    });

    useEffect(() => {
        if (selectedGroup) {
            setValue('name', selectedGroup.name);
            setValue('score', selectedGroup.score);
        } else {
            reset();
        }
    }, [selectedGroup, setValue, reset]);


    const onSubmit = handleSubmit((data: Group) => {
        data.name = data.name.trim().charAt(0).toUpperCase() + data.name.trim().slice(1).toLowerCase();

        if (selectedGroup) {
            // Update group
            updateGroupMutation.mutate({...data, id: selectedGroup.id}, {
                onSuccess: async () => {
                    toast.success('Group updated successfully');
                    setSelectedGroup(null);
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['groups'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error updating group: ${error.message}`);
                }
            })
        } else {
            // Create group
            createGroupMutation.mutate(data, {
                onSuccess: async () => {
                    toast.success('Group created successfully');
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['groups'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error creating group: ${error.message}`);
                }
            })
        }
    })


    const clearForm = () => {
        reset();
        setSelectedGroup(null);
        clearActiveGroup();
        toast.success('Form cleared successfully!')
    }

    return (
        <div className="p-6 rounded-md shadow-md md:max-w-xl">
            <div className="text-3xl font-bold">
                {selectedGroup ? 'Edit a Group' : 'Add a Group'}
            </div>
            <form onSubmit={onSubmit} className="">
                <div>
                    <label className="label">
                        <span className="text-base label-text">Group Name</span>
                    </label>
                    <input {...register('name')} type="text" placeholder="Group Name"
                           className="input input-bordered w-full "/>
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="label">
                        <span className="text-base label-text">Score</span>
                    </label>
                    <input {...register('score')} type="text" placeholder="Score"
                           className="input input-bordered w-full "/>
                    {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
                </div>

                <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 md:space-y-0 space-y-2 mt-4 ">
                    <div>
                        <button type="button" onClick={clearForm} className='btn btn-accent w-full uppercase'>Clear
                        </button>
                    </div>
                    <div>
                        <button type="submit" className='btn btn-primary w-full uppercase'>Submit</button>
                    </div>
                </div>


            </form>
        </div>
    );
}

export default GroupForm