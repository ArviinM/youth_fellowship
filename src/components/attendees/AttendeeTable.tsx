import {useAttendees} from "../../hooks/attendees/useAttendees.ts";
import {useAttendeeStore} from "../../store/attendeeStore.ts";
import {Attendee} from "../../types/Attendee.ts";

const AttendeeTable = () => {
    const setSelectedAttendee = useAttendeeStore((state) => state.setSelectedAttendee);
    const activeAttendee = useAttendeeStore((state) => state.activeAttendee);
    const setActiveAttendee = useAttendeeStore((state) => state.setActiveAttendee);


    const {isPending, isError, data, error} = useAttendees();
    if (isPending) {
        return (<div>Loading...</div>)
    }
    if (isError && error) {
        return (<div>There's something wrong: {error?.message}</div>)
    }
    if (!data) {
        return (<div>No data available</div>)
    }

    const handleRowClick = (attendee: Attendee) => {
        setSelectedAttendee(attendee);
        if (attendee.id !== undefined) {
            setActiveAttendee(attendee.id);
        }
    }


    return (
        <table className="table -z-50">
            <thead className="">
            <tr>
                <th scope="col"
                    className="uppercase tracking-wider font-medium">
                    Name
                </th>
                <th scope="col"
                    className="uppercase tracking-wider font-medium">
                    City
                </th>
                <th scope="col"
                    className="uppercase tracking-wider font-medium">
                    Birthdate
                </th>
            </tr>
            </thead>
            <tbody className="">
            {data.map((attendee) => (
                <tr key={attendee.id}
                    className={`hover ${activeAttendee === attendee.id ? 'bg-base-200' : ''}`}
                    onClick={() => handleRowClick(attendee)}>
                    <td className="">
                        <div className="">{attendee.firstname} {attendee.lastname}</div>
                    </td>
                    <td className="">
                        <div className="">{attendee.city}</div>
                    </td>
                    <td className="">
                        <div className="">{attendee?.birthdate ? attendee.birthdate.toString() : ''}</div>
                    </td>
                    {/*<td className="px-6 py-4 whitespace-nowrap">*/}
                    {/*    <div className="text-sm text-gray-500"></div>*/}
                    {/*</td>*/}
                    {/* Add more cells as needed */}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default AttendeeTable
