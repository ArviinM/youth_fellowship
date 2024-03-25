import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useCreateAttendee, useUpdateAttendee} from "../../hooks/attendees/useAttendees.ts";
import {Attendee} from '../../types/Attendee.ts';
import {toast} from "react-toastify";
import {useAttendeeStore} from "../../store/attendeeStore.ts";
import React, {useEffect, useState} from "react";
import {useQueryClient} from '@tanstack/react-query';
import {useGroups, useGroupSizes} from "../../hooks/attendees/useGroups.ts";
import {Group} from "../../types/Group.ts";
import {useCreateAttendeeGroup} from "../../hooks/attendees/useAttendeesGroup.ts";
// import {AttendeeGroup} from "../../types/AttendeeGroup.ts";

import * as XLSX from 'exceljs';


const AttendeeFormSchema = z.object({
    firstname: z.string({required_error: "First name is required.",}).min(3, "At least three letters are required."),
    lastname: z.string().min(3, "At least three letters are required."),
    age: z.string(),
    city: z.string().min(3, "At least three letters are required."),
}).required();

// function getAgeGroup(age: number): string {
//     if (age >= 13 && age <= 19) {
//         return 'teenager';
//     } else if (age >= 20 && age <= 29) {
//         return 'young adult';
//     } else if (age >= 30 && age <= 59) {
//         return 'adult / parents';
//     } else if (age >= 60 && age <= 130) {
//         return 'elders';
//     } else {
//         return 'unknown'; // Handle unexpected ages if needed
//     }
// }

function AttendeeForm() {
    const selectedAttendee = useAttendeeStore((state) => state.selectedAttendee);
    const setSelectedAttendee = useAttendeeStore((state) => state.setSelectedAttendee);
    const clearActiveAttendee = useAttendeeStore((state) => state.clearActiveAttendee);

    const createAttendeeMutation = useCreateAttendee();
    const updateAttendeeMutation = useUpdateAttendee();
    const createAttendeeGroupMutation = useCreateAttendeeGroup();
    const groupSizes = useGroupSizes();
    const groups = useGroups();

    const [excelData, setExcelData] = useState<Attendee[] | null>(null);

    const queryClient = useQueryClient();

    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm<Attendee>({
        resolver: zodResolver(AttendeeFormSchema),
    });

    // const attendees = useAttendees();


    useEffect(() => {
        if (selectedAttendee) {
            setValue('firstname', selectedAttendee.firstname);
            setValue('lastname', selectedAttendee.lastname);
            setValue('age', Number(selectedAttendee.age));
            setValue('city', selectedAttendee.city);
        } else {
            reset();
        }
    }, [selectedAttendee, setValue, reset]);

    if (groupSizes.isPending && groups.isPending) {
        return <div>Loading...</div>
    }

    const assignUserToGroup = (attendee: Attendee, groups: Group[], groupSizes: Record<number, string[]>) => {
        // Sort groups by the number of members
        const sortedGroups = groups.sort((a, b) => (groupSizes[a.id]?.length || 0) - (groupSizes[b.id]?.length || 0));

        let assigned = false;

        for (const group of sortedGroups) {
            // Check if the user's city is not already in the group
            if (!groupSizes[group.id] || !groupSizes[group.id].includes(attendee.city)) {
                // Add the user to the group
                groupSizes[group.id] = (groupSizes[group.id] || []).concat(attendee.city);
                assigned = true;

                // const attendeeGroup: AttendeeGroup = {
                //     attendeeID: attendee.id,
                //     groupsID: group.id
                // }

                const newDataAttendeeGroup = {object: {
                        attendeeID: attendee.id,
                        groupsID: group.id
                    }}

                if (attendee.id) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    createAttendeeGroupMutation.mutate(newDataAttendeeGroup, {
                        onSuccess: async () => {
                            toast.success(`Added ${attendee.firstname} ${attendee.lastname} from ${attendee.city} to ${group.name}`);
                            reset();
                            await queryClient.invalidateQueries({
                                queryKey: ['groups', 'groupSizes'],
                                refetchType: 'active',
                            }, {});
                        },
                        onError: (error) => {
                            toast.error(`Error creating attendee: ${error.message}`);
                        }
                    })
                } else {
                    console.error('')
                }
                break;
            }
        }

        // If no group is found, assign to the first group, even if sizes are equal
        if (!assigned) {
            const group = groups[0];
            groupSizes[group.id] = (groupSizes[group.id] || []).concat(attendee.city);
            assigned = true;

            const newDataAttendeeGroup = {object: {
                    attendeeID: attendee.id,
                    groupsID: group.id
                }}

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            createAttendeeGroupMutation.mutate(newDataAttendeeGroup, {
                onSuccess: async () => {
                    toast.success(`Added ${attendee.firstname} ${attendee.lastname} from ${attendee.city} to ${group.name}`);
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['groups', 'groupSizes'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error creating attendee: ${error.message}`);
                }
            })
        }

        if (!assigned) {
            console.log(`Could not assign ${attendee.lastname} to any group`);
        }
    };


    const onSubmit = handleSubmit((data: Attendee) => {
        data.firstname = data.firstname.trim().charAt(0).toUpperCase() + data.firstname.trim().slice(1).toLowerCase();
        data.lastname = data.lastname.trim().charAt(0).toUpperCase() + data.lastname.trim().slice(1).toLowerCase();
        // data.birthdate = new Date(data.birthdate)

        const newData = {objects: [{firstname: data.firstname, lastname: data.lastname, age: Number(data.age), city: data.city}]}
        const newUpdateData = {object: {firstname: data.firstname, lastname: data.lastname, age: Number(data.age), city: data.city}}

        if (selectedAttendee) {
            // Update attendee
            updateAttendeeMutation.mutate({
                ...newUpdateData, id: selectedAttendee.id,
                firstname: '',
                lastname: '',
                age: 0,
                city: ''
            }, {
                onSuccess: async () => {
                    toast.success('Attendee updated successfully');
                    setSelectedAttendee(null);newUpdateData
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['attendee'],
                        refetchType: 'active',
                    }, {});
                },
                onError: (error) => {
                    toast.error(`Error updating attendee: ${error.message}`);
                }
            })
        } else {
            // Create attendee
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            createAttendeeMutation.mutate(newData, {
                onSuccess: async (res) => {
                    toast.success('Attendee created successfully, wait for assigned group!');
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['attendee'],
                        refetchType: 'active',
                    }, {});
                    console.log(res.data)
                    const attendeeResult = res.data.insert_attendee.returning[0] as Attendee

                    if (groups.data && groupSizes.data) {
                        assignUserToGroup(attendeeResult, groups.data, groupSizes.data)
                    } else {
                        console.log("Something is really wrong")
                    }
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
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.readAsArrayBuffer(file);

            reader.onload = (e) => {
                // @ts-ignore
                const buffer = e.target.result;

                const workbook = new XLSX.Workbook();
                workbook.xlsx.load(buffer as Buffer).then((workbook) => {
                    const worksheet = workbook.worksheets[0];
                    const headerRow = worksheet.getRow(1);
                    const headers = headerRow.values as string[];

                    const data: Attendee[] = []; // Initialize as an array of PersonData
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return; // Skip the header row

                        const rowData: Attendee = { // Initialize as a PersonData object
                            firstname: '',
                            lastname: '',
                            age: 0, // Assuming age is a number
                            city: ''
                        };

                        row.eachCell((cell, colNumber) => {
                            const headerName = headers[colNumber]?.toLowerCase() || '';
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            rowData[headerName] = cell.value;
                        });
                        console.log({rowData})
                        data.push(rowData);
                    });

                    setExcelData(data);
                });
            };
        }
    };

    const displayExcelData = () => {
        if (excelData) {
            const newData = { objects: excelData }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            createAttendeeMutation.mutate(newData, {
                onSuccess: async (res) => {
                    toast.success('Attendee created successfully, wait for assigned group!');
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['attendee'],
                        refetchType: 'active',
                    }, {});
                    console.log(res.data)
                    const attendeeResult = res.data.insert_attendee.returning as Attendee[]

                    attendeeResult.forEach((result) => {
                        if (groups.data && groupSizes.data) {
                            assignUserToGroup(result, groups.data, groupSizes.data)
                        } else {
                            console.log("Something is really wrong")
                        }
                    })

                },
                onError: (error) => {
                    toast.error(`Error creating attendee: ${error.message}`);
                }
            })
            // createAttendeeMutation.mutate(newData, {
            //     onSuccess: async (res) => {
            //         toast.success('Importing all data in the excel!');
            //         reset();
            //         await queryClient.invalidateQueries({
            //             queryKey: ['attendee'],
            //             refetchType: 'active',
            //         }, {});
            //         console.log(res.data)
            //         const attendeeResult = res.data.insert_attendee.returning as Attendee[]
            //
            //        if(attendees.data && groups.data && groupSizes.data){
            //            console.log('I was here')
            //            const allAttendeesWithAgeGroup = attendees.data.map(attendee => ({
            //                ...attendee,
            //                ageGroup: getAgeGroup(attendee.age)
            //            }));
            //            console.log({allAttendeesWithAgeGroup})
            //            // assignUsersToGroups(attendeeResult, groups.data, groupSizes.data, allAttendeesWithAgeGroup);
            //        }
            //         // if (groups.data && groupSizes.data) {
            //         //     assignUserToGroup(attendeeResult, groups.data, groupSizes.data)
            //         // } else {``
            //         //     console.log("Something is really wrong")
            //         // }
            //     },
            //     onError: (error) => {
            //         toast.error(`Error creating attendee: ${error.message}`);
            //     }
            // })
        } else {
            console.error("Test")
        }
    };

    return (
        <div className="p-6 rounded-md shadow-md md:max-w-xl -z-50">
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
                            <span className="text-base label-text">Age</span>
                        </label>
                        <input {...register('age')} type="number"
                               className="input input-bordered w-full "/>
                        {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
                    </div>
                    <div>
                        <label className="label">
                            <span className="text-base label-text">City</span>
                        </label>
                        {/*<input {...register('city')} type="select" placeholder="Carmona"*/}
                        {/*       className="input input-bordered w-full "/>*/}
                        <select {...register('city')} className="select select-bordered w-full">
                            <option value="Alaminos">Alaminos</option>
                            <option value="Bagong Kalsada">Bagong Kalsada</option>
                            <option value="Balibago">Balibago</option>
                            <option value="Bay">Bay</option>
                            <option value="Biñan">Biñan</option>
                            <option value="Cabuyao">Cabuyao</option>
                            <option value="Cabuyao">Calamba</option>
                            <option value="Calauan">Calauan</option>
                            <option value="Canlubang">Canlubang</option>
                            <option value="Carmona">Carmona</option>
                            <option value="GMA">GMA</option>
                            <option value="Pagsanjan">Pagsanjan</option>
                            <option value="Rizal">Rizal</option>
                            <option value="San Pablo">San Pablo</option>
                            <option value="Silang Bayan">Silang Bayan</option>
                            <option value="Silang Narra">Silang Narra</option>
                            <option value="Simara">Simara</option>
                            <option value="Santa Cruz">Santa Cruz</option>
                            <option value="Santa Rosa">Santa Rosa</option>
                            <option value="Timbao">Timbao</option>
                            <option value="Victoria">Victoria</option>
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
                <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-2 md:space-y-0 space-y-2">
                    <div>
                        <input type="file" onChange={handleFileUpload} className="file-input w-full max-w-xs"/>
                    </div>
                    <div>
                    <button type="button" onClick={displayExcelData} className='btn btn-primary w-full uppercase'>Display</button>
                    </div>

                </div>
                {/*{displayExcelData()}*/}

            </form>
        </div>
    );
}

export default AttendeeForm