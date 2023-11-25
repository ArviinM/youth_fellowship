import GroupForm from "../components/groups/GroupForm.tsx";
import GroupTable from "../components/groups/GroupTable.tsx";

function Attendee() {
    return (
        <>
            <div className='px-5'>
                <div className="md:grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <GroupForm/>
                    </div>
                    <div className="col-span-2">
                        <GroupTable/>
                    </div>
                </div>

            </div>
        </>)
}

export default Attendee;