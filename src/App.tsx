import './App.css'
import 'react-toastify/dist/ReactToastify.min.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {Slide, ToastContainer} from "react-toastify";
import Attendee from "./pages/Attendee.tsx";
import Navbar from "./components/shared/Navbar.tsx";
import Home from "./pages/Home.tsx";
import Groups from "./pages/Groups.tsx";
import AttendeeGroups from "./pages/AttendeeGroups.tsx";
import AnimatedCursor from "react-animated-cursor";
import {useAuthenticationStore} from "./store/authenticationStore.ts";


function App() {
    const {isAuthenticated} = useAuthenticationStore();

    return (
        <>
            <AnimatedCursor
                innerSize={8}
                outerSize={35}
                innerScale={1}
                outerScale={2}
                outerAlpha={0}
                innerStyle={{
                    backgroundColor: 'var(--cursor-color)'
                }}
                outerStyle={{
                    border: '3px solid var(--cursor-color)'
                }}
                clickables={[
                    'a',
                    'input[type="text"]',
                    'input[type="email"]',
                    'input[type="number"]',
                    'input[type="submit"]',
                    'input[type="image"]',
                    'input[type="date"]',
                    'label[for]',
                    'select',
                    'textarea',
                    'button',
                    '.link'
                ]}/>
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
                    <Route index path="/" element={<Home/>}/>
                    <Route index path="/attendee-groups" element={<AttendeeGroups/>}/>

                    {/* Protected routes */}
                    {isAuthenticated && (
                        <>
                            <Route index path="/attendees" element={<Attendee/>}/>
                            <Route index path="/groups" element={<Groups/>}/>
                        </>
                    )}

                    {/* Redirect to the home page for any unmatched routes */}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default App
