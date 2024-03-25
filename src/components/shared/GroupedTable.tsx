import {useEffect, useState} from 'react';
import {Attendee} from "../../types/Attendee.ts";
import {useAttendeeGroup} from "../../hooks/attendees/useAttendeesGroup.ts";
// import {AttendeeGroup} from "../../types/AttendeeGroup.ts";
import {AttendeeGroupServerResponse} from "../../types/ServerResponse.ts";
import {Group} from "../../types/Group.ts";

interface GroupedRecord {
    [groupId: number]: {
        groupName: string;
        groupScore: number | null;
        members: Attendee[];
    };
}

function GroupedTable() {
    const {isPending, isError, data, error} = useAttendeeGroup();
    const [groupedAttendees, setGroupedAttendees] = useState<GroupedRecord | null>(null);

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const groupedData = sortAndGroupAttendees(data);
            setGroupedAttendees(groupedData);
        }
    }, [data]);

    // Function to sort and group attendees by group ID
    const sortAndGroupAttendees = (data: AttendeeGroupServerResponse): GroupedRecord => {
        const { attendee_groups, groups, attendee } = data;

        // Create a map of group IDs to group objects for easy lookup
        const groupMap: { [key: number]: Group } = groups.reduce((acc, group) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            acc[group.id] = group;
            return acc;
        }, {});

        // Initialize the grouped record
        const groupedRecord: GroupedRecord = {};

        // Iterate over attendee_groups to group attendees by group ID
        attendee_groups.forEach(({ attendeeID, groupsID }) => {
            if (groupsID !== undefined) {
                const group = groupMap[groupsID];
                const attendeeData = attendee.find((a) => a.id === attendeeID);

                if (group && attendeeData) {
                    const groupId = group.id;

                    if (!groupedRecord[groupId]) {
                        groupedRecord[groupId] = {
                            groupName: group.name,
                            groupScore: group.score,
                            members: [],
                        };
                    }

                    groupedRecord[groupId].members.push(attendeeData);
                } else {
                    throw new Error('Invalid data structure');
                }
            } else {
                throw new Error('groupsID is undefined');
            }
        });


        return groupedRecord;
    };


    if (isPending) {
        return <div className="px-5">Loading...</div>;
    }

    if (isError && error) {
        return <div className="px-5">There's something wrong: {error?.message}</div>;
    }

    if (!groupedAttendees) {
        return <div className="px-5">No data available</div>;
    }

    return (
        <div className="w-full justify-center items-center">
            {Object.values(groupedAttendees).map((group) => (
                <div key={group.groupName} className="card rounded-md shadow-md md:max-w-2xl m-3 inline-flex -z-50">
                    <div className="card-body">
                        {/*<h2 className="text-2xl lg:text-5xl font-bold">{`${group.groupName} | Score: ${group.groupScore}`}</h2>*/}
                        <h2 className="text-2xl lg:text-5xl font-bold">{`${group.groupName}`}</h2>
                         <table className="table">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium text-xs md:text-md">Name
                                </th>
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium text-xs md:text-md">City
                                </th>
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium text-xs md:text-md">Age
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-left ">
                            {group.members.map((member: Attendee) => (
                                <tr key={member.id} className="text-md md:text-lg">
                                    <td>{member.firstname} {member.lastname}</td>
                                    <td>{member.city}</td>
                                    <td>{member.age}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <p className="uppercase justify-end text-right my-2 font-light text-xs"> Members: {group.members.length}</p>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default GroupedTable;
