import './App.css'
import 'react-toastify/dist/ReactToastify.min.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Slide, ToastContainer} from "react-toastify";
// import Home from "./pages/Home.tsx";
import Attendee from "./pages/Attendee.tsx";
import Navbar from "./components/shared/Navbar.tsx";
import Home from "./pages/Home.tsx";
import Groups from "./pages/Groups.tsx";
import AttendeeGroups from "./pages/AttendeeGroups.tsx";


function App() {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                transition={Slide}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"/>
            <Router>
                <Navbar/>
                <Routes>
                    <Route index path='/' element={<Home/>}/>
                    <Route index path='/attendees' element={<Attendee/>}/>
                    <Route index path='/groups' element={<Groups/>}/>
                    <Route index path='/attendee-groups' element={<AttendeeGroups/>}/>
                    {/*<Route path='*' element={<NotFound/>}/>*/}
                </Routes>
            </Router>
        </>
    )
}

export default App
