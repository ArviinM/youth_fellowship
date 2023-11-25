import GroupedTable from '../components/shared/GroupedTable.tsx';


function AttendeeGroups() {
    return (
        <div className="flex justify-center px-5 m-auto items-center">
            <div className="justify-center m-auto">
                <div className="text-center w-full text-5xl font-bold">Attendee's Groups</div>
                <div className="flex">
                    <GroupedTable/>
                </div>
            </div>
        </div>
    );
}

export default AttendeeGroups;
