import {useEffect, useState} from 'react';
import {Attendee} from "../../types/Attendee.ts";
import {useAttendeeGroup} from "../../hooks/attendees/useAttendeesGroup.ts";
import {AttendeeGroup} from "../../types/AttendeeGroup.ts";

interface GroupedRecord {
    [groupId: number]: {
        groupName: string;
        groupScore: number;
        members: Attendee[];
    };
}

function GroupedTable() {
    const {isPending, isError, data, error} = useAttendeeGroup();
    const [groupedAttendees, setGroupedAttendees] = useState<GroupedRecord | null>(null);

    useEffect(() => {
        if (data) {
            const groupedData = sortAndGroupAttendees(data);
            setGroupedAttendees(groupedData);
        }
    }, [data]);

    // Function to sort and group attendees by group ID
    const sortAndGroupAttendees = (attendees: AttendeeGroup[]): GroupedRecord => {
        return attendees.reduce((groups, attendeeGroup) => {
            const {group, attendee} = attendeeGroup;
            const groupId = group.id;

            if (!groups[groupId]) {
                groups[groupId] = {
                    groupName: group.name,
                    groupScore: group.score,
                    members: [],
                };
            }

            groups[groupId].members.push(attendee);

            return groups;
        }, {} as GroupedRecord);
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
                <div key={group.groupName} className="card rounded-md shadow-md md:max-w-2xl m-3 inline-flex">
                    <div className="card-body">
                        <h2 className="text-3xl font-bold">{`${group.groupName} | Score: ${group.groupScore}`}</h2>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium">Name
                                </th>
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium">City
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-left ">
                            {group.members.map((member: Attendee) => (
                                <tr key={member.id} className="text-lg">
                                    <td>{member.firstname} {member.lastname}</td>
                                    <td>{member.city}</td>
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
