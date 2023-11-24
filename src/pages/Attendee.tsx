import AttendeeForm from "../components/attendees/AttendeeForm.tsx";
import AttendeeTable from "../components/attendees/AttendeeTable.tsx";

function Attendee () {
    return (
        <>
            <div className='px-5'>
                <div className="md:grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                        <AttendeeForm/>
                        {/*<AttendeeForm/>*/}
                    </div>
                    <div className="col-span-2">
                        <AttendeeTable/>
                    </div>
                </div>

            </div>
        </>)
}

export default Attendee;