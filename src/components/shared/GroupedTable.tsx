import {useEffect, useState} from 'react';
import {Attendee} from "../../types/Attendee.ts";
import {useAttendeeGroup} from "../../hooks/attendees/useAttendeesGroup.ts";
// import {AttendeeGroup} from "../../types/AttendeeGroup.ts";
import {AttendeeGroupServerResponse} from "../../types/ServerResponse.ts";
import {Group} from "../../types/Group.ts";
import {getAgeGroup} from "../../hooks/attendees/useAttendees.ts";
import ExcelJS from 'exceljs';


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

                    // Sort members by age before adding them to the group
                    groupedRecord[groupId].members.push(attendeeData);
                    groupedRecord[groupId].members.sort((a, b) => a.age - b.age);
                } else {
                    throw new Error('Invalid data structure');
                }
            } else {
                throw new Error('groupsID is undefined');
            }
        });

        return groupedRecord;
    };

    const exportToExcel = (members: Attendee[], groupName: string) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Group Members');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'City', key: 'city', width: 15 },
            { header: 'Age', key: 'age', width: 10 },
            { header: 'Age Group', key: 'ageGroup', width: 15 },
        ];

        members.forEach((member) => {
            worksheet.addRow({
                name: `${member.firstname} ${member.lastname}`,
                city: member.city,
                age: member.age,
                ageGroup: getAgeGroup(member.age),
            });
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // a.download = 'group_members.xlsx';
            a.download = `${groupName}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        });
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
                        {/*<h2 className="text-2xl lg:text-5xl font-bold">{`${group.groupName} | Score: ${group.groupScore}`}</h2>*/}
                        <h2 className="text-2xl lg:text-5xl font-bold">{`${group.groupName}`}</h2>
                        <button type="button" className="btn btn-primary mt-2 cursor-pointer"
                                onClick={() => exportToExcel(group.members, group.groupName)}>
                            Export to Excel
                        </button>

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
                                <th scope="col"
                                    className="uppercase tracking-wider font-medium text-xs md:text-md">Age Group
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-left ">
                            {group.members.map((member: Attendee) => (
                                <tr key={member.id} className="text-md md:text-lg">
                                    <td>{member.firstname} {member.lastname}</td>
                                    <td>{member.city}</td>
                                    <td>{member.age}</td>
                                    <td className="capitalize">{getAgeGroup(member.age)}</td>
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
