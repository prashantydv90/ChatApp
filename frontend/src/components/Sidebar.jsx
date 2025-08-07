import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoSettingsOutline } from "react-icons/io5";
import { VscSearch } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { VscThreeBars } from "react-icons/vsc";
import { EditProfile } from './EditProfile';
import { toast } from 'react-toastify';

export const Sidebar = ({ setSelectedUser, setCurrentUser ,currentUser}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3333/api/getalluser', { withCredentials: true }).then((res) => {
            setUsers(res.data.users);
            setCurrentUser(res.data.loggedUser);
        }).catch((err) => {
            navigate('/user/login')
            console.log(err, 'error in fetching users details');
        })
    }, [])

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate(`/chat/${user._id}`);
    }

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.phone.toString().includes(term)
        );
    });

    return (
        <div className='h-full w-full sm:w-1/3 bg-zinc-50 flex flex-col'>
            <div className='h-16 border-b-0 flex items-center px-5'>
                <h1 className='w-1/2 text-2xl font-bold'>ChatApp</h1>
                <div className='flex-1 flex justify-end text-xl'>
                    <VscThreeBars className='cursor-pointer' onClick={()=>{setMenuOpen(!menuOpen)}}/>
                    {menuOpen && <Menu currentUser={currentUser} setCurrentUser={setCurrentUser} setMenuOpen={setMenuOpen}/> }
                </div>
            </div>
            
            <div className='px-3 sm:px-5 mt-1 '>
                <div
                    className='border-1 w-full border-zinc-300 py-1 flex items-center px-3 gap-3 rounded-md shadow'>
                    <VscSearch className='text-md pt-0.5 ' />
                    <input type="text"
                        placeholder='Search User'
                        className='flex-1 focus:outline-0'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>
            </div>
            <div className='pl-3 pr-4 sm:px-3 mt-5 flex-1 overflow-y-auto'>
                {filteredUsers.map((user) => (
                    <div key={user._id} onClick={() => handleUserClick(user)}>
                        <User user={user} />
                    </div>
                ))}

            </div>
        </div>
    )
}

const User = ({ user }) => {
    return (
        <div className="w-full flex items-center mt-2.5 sm:px-2 py-1.5 hover:bg-zinc-100 rounded cursor-pointer"
        >

            <div className="w-13 h-13 rounded-full  flex items-center justify-center bg-zinc-400 text-white text-2xl font-semibold shrink-0 ">
                {user?.name[0]}
            </div>


            <div className="flex flex-col justify-center ml-3  w-full overflow-hidden pb-1">
                <div className="flex">
                    <div className='text-xl font-medium w-2/3'>{user?.name}</div>
                    {/* <div className='flex-1 flex justify-end text-[13px] items-center'>23:59 </div> */}
                </div>
                <div className="leading-tight overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 text-sm">
                    {user?.phone}
                </div>
            </div>
        </div>

    )
}


const Menu = ({setCurrentUser,currentUser,setMenuOpen}) => {
    const [showEditProfile, setShowEditProfile] = useState(false);
    const navigate=useNavigate();

    return (
        <div className="absolute top-16  w-40 bg-white border rounded-md shadow-lg z-50 text-[16px]">
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {                  
                    setShowEditProfile(true);
                    // setMenuOpen(false);                  
                }}
            >
                Edit Profile
            </button>
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={async () => {
                    if (window.confirm("Are you sure you want to delete your profile? This will delete all your chats and media permanently.")) {
                        try {
                            await axios.delete(`http://localhost:3333/api/deleteuser/${currentUser._id}`, { withCredentials: true });
                            toast.success("Profile deleted successfully");
                            setMenuOpen(false);
                            // Log out and redirect
                            await axios.post("http://localhost:3333/api/logout", {}, { withCredentials: true });
                            navigate("/user/login");
                        } catch (err) {
                            toast.error("Failed to delete profile");
                            console.error("Delete profile failed", err);
                        }
                    }
                }}
            >
                Delete Profile
            </button>
            <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                    // Handle logout
                    axios.post("http://localhost:3333/api/logout", {}, { withCredentials: true })
                        .then(() => {toast.success("Logged out successfully");navigate("/user/login")})
                        .catch((err) => console.error("Logout failed", err));
                    setMenuOpen(false);
                }}
            >
                Logout
            </button>
            {showEditProfile && (
            <EditProfile
                currentUser={currentUser}
                setShowEditProfile={setShowEditProfile}
                setCurrentUser={setCurrentUser}
            />
            )}

        </div>


    )
}