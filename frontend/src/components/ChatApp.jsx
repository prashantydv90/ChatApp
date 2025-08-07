
// import React, { useEffect, useState } from 'react'
// import { Sidebar } from './Sidebar'
// import { Messagebox } from './Messagebox'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'

// export const ChatApp = () => {
//   const { userId } = useParams();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [currentUser,setCurrentUser]=useState();

//   useEffect(() => {
//     if (userId) {
//       axios.get(`https://chatapp-rtvj.onrender.com/api/getuser/${userId}`, { withCredentials: true })
//         .then(res => {
//           setSelectedUser(res.data.user);
//         })
//         .catch(err => {
//           console.log("Error fetching user:", err);
//         });
//     } else {
//       setSelectedUser(null);
//     }
//   }, [userId]);

//   return (
//     <div className='w-full h-screen sm:flex'>
//       <Sidebar setSelectedUser={setSelectedUser} setCurrentUser={setCurrentUser} currentUser={currentUser} />
//       <Messagebox selectedUser={selectedUser} currentUser={currentUser}/>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Messagebox } from './Messagebox'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export const ChatApp = () => {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // sm breakpoint

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 440);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get(`https://chatapp-rtvj.onrender.com/api/getuser/${userId}`, { withCredentials: true })
        .then(res => {
          setSelectedUser(res.data.user);
        })
        .catch(err => {
          console.log("Error fetching user:", err);
        });
    } else {
      setSelectedUser(null);
    }
  }, [userId]);

  return (
    <div className='w-full h-screen sm:flex'>
      {(!isMobile || !selectedUser) && (
        <Sidebar
          setSelectedUser={setSelectedUser}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
        />
      )}

      {((!isMobile || selectedUser)) && (
        <Messagebox
          selectedUser={selectedUser}
          currentUser={currentUser}
          goBack={() => setSelectedUser(null)} // Pass goBack to Messagebox
        />
      )}
    </div>
  );
};
