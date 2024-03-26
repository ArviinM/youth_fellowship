import GroupedTable from '../components/shared/GroupedTable.tsx';


function AttendeeGroups() {
    return (
        <div className="flex-1 justify-center p-5 m-auto items-center">
            <div className="justify-center m-auto">
                <div className="text-center w-full text-4xl md:text-9xl font-custom pb-3">Groups</div>
                <div className="flex justify-center text-center z-10">
                    <GroupedTable/>
                </div>
            </div>
        </div>
    );
}

export default AttendeeGroups;
