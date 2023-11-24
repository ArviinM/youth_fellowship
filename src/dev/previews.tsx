import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import AttendeeForm from "../components/attendees/AttendeeForm.tsx";
import Attendee from "../pages/./Attendee.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AttendeeForm">
                <AttendeeForm/>
            </ComponentPreview>
            <ComponentPreview path="/Attendee">
                <Attendee/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;