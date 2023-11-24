import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateAttendee, useUpdateAttendee} from "../../hooks/attendees/useAttendees.ts";
import {Attendee} from '../../types/Attendee.ts';
import {toast} from "react-toastify";
import {useAttendeeStore} from "../../store/attendeeStore.ts";
import {useEffect} from "react";
import {useQueryClient} from '@tanstack/react-query';


const AttendeeFormSchema = z.object({
    firstname: z.string({required_error: "First name is required.",}).min(3, "At least three letters are required."),
    lastname: z.string().min(3, "At least three letters are required."),
    birthdate: z.string(),
    city: z.string().min(3, "At least three letters are required."),
}).required();

function AttendeeForm() {
    const selectedAttendee = useAttendeeStore((state) => state.selectedAttendee);
    const setSelectedAttendee = useAttendeeStore((state) => state.setSelectedAttendee);
    const clearActiveAttendee = useAttendeeStore((state) => state.clearActiveAttendee);

    const createAttendeeMutation = useCreateAttendee();
    const updateAttendeeMutation = useUpdateAttendee();

    const queryClient = useQueryClient();

    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<Attendee>({
        resolver: zodResolver(AttendeeFormSchema),
    });

    useEffect(() => {
        if (selectedAttendee) {
            setValue('firstname', selectedAttendee.firstname);
            setValue('lastname', selectedAttendee.lastname);
            setValue('birthdate', selectedAttendee.birthdate);
            setValue('city', selectedAttendee.city);
        } else {
            reset();
        }
    }, [selectedAttendee, setValue, reset]);


    const onSubmit = handleSubmit((data: Attendee) => {
        data.firstname = data.firstname.trim().charAt(0).toUpperCase() + data.firstname.trim().slice(1).toLowerCase();
        data.lastname = data.lastname.trim().charAt(0).toUpperCase() + data.lastname.trim().slice(1).toLowerCase();
        data.birthdate = new Date(data.birthdate)

        if (selectedAttendee) {
            // Update attendee
            updateAttendeeMutation.mutate({...data, id: selectedAttendee.id}, {
                onSuccess: async () => {
                    toast.success('Attendee updated successfully');
                    setSelectedAttendee(null);
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['attendees'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error updating attendee: ${error.message}`);
                }
            })
        } else {
            // Create attendee
            createAttendeeMutation.mutate(data, {
                onSuccess: async () => {
                    toast.success('Attendee created successfully');
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['attendees'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error creating attendee: ${error.message}`);
                }
            })
        }
    })


    const clearForm = () => {
        reset();
        setSelectedAttendee(null);
        clearActiveAttendee();
        toast.success('Form cleared successfully!')
    }

    return (
        <div className="p-6 rounded-md shadow-md md:max-w-xl">
            <div className="text-3xl font-bold">
                {selectedAttendee ? 'Edit an Attendee' : 'Add an Attendee'}
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="label">
                            <span className="text-base label-text">First Name</span>
                        </label>
                        <input {...register('firstname')} type="text" placeholder="John"
                               className="input input-bordered w-full "/>
                        {errors.firstname && <p className="text-xs text-red-500">{errors.firstname.message}</p>}
                    </div>
                    <div>
                        <label className="label">
                            <span className="text-base label-text">Last Name</span>
                        </label>
                        <input {...register('lastname')} type="text" placeholder="Doe"
                               className="input input-bordered w-full "/>
                        {errors.lastname && <p className="text-xs text-red-500">{errors.lastname.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="label">
                            <span className="text-base label-text">Birth Date</span>
                        </label>
                        <input {...register('birthdate')} type="date"
                               className="input input-bordered w-full "/>
                        {errors.birthdate && <p className="text-xs text-red-500">{errors.birthdate.message}</p>}
                    </div>
                    <div>
                        <label className="label">
                            <span className="text-base label-text">City</span>
                        </label>
                        {/*<input {...register('city')} type="select" placeholder="Carmona"*/}
                        {/*       className="input input-bordered w-full "/>*/}
                        <select {...register('city')} className="select select-bordered w-full">
                            <option value="Biñan">Biñan</option>
                            <option value="Cabuyao">Cabuyao</option>
                            <option value="Carmona">Carmona</option>
                            <option value="GMA">GMA</option>
                            <option value="Silang">Silang</option>
                            <option value="Simara">Simara</option>
                            <option value="Santa Cruz">Santa Cruz</option>
                            <option value="Timbao">Timbao</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                </div>

                <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 md:space-y-0 space-y-2">
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

export default AttendeeForm