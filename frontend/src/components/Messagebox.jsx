import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { GrChat } from "react-icons/gr";
import { FaImage, FaVideo, FaFilePdf, FaFile } from "react-icons/fa";
import socket from './Socket';
import axios from 'axios';

export const Messagebox = ({ selectedUser, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!currentUser || !selectedUser) return;

        socket.emit("join", currentUser._id);

        axios.get(`http://localhost:3333/api/messages/get/${currentUser._id}/${selectedUser._id}`)
            .then(res => setMessages(res.data.messages))
            .catch(err => console.error(err));

        socket.on("receive-message", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socket.off("receive-message");
    }, [currentUser, selectedUser]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const messageData = {
            senderId: currentUser._id,
            receiverId: selectedUser._id,
            message,
            messageType: 'text',
            createdAt: new Date().toISOString(),
        };

        await axios.post("http://localhost:3333/api/messages/send", messageData);
        socket.emit("send-message", { to: selectedUser._id, messageData });

        setMessages(prev => [...prev, messageData]);
        setMessage("");
    };

    const handleFileUpload = async (file) => {
        if (!file || isUploading) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('senderId', currentUser._id);
            formData.append('receiverId', selectedUser._id);

            const response = await axios.post("http://localhost:3333/api/messages/send-file", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const messageData = response.data.message;
            socket.emit("send-message", { to: selectedUser._id, messageData });
            setMessages(prev => [...prev, messageData]);
        } catch (error) {
            console.error('File upload failed:', error);
            alert('Failed to send file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
        // Reset the input value so the same file can be selected again
        event.target.value = '';
    };
    return (
        <>
            {selectedUser ? (
                <div className='w-full flex flex-col sm:w-2/3 border-l-1 border-zinc-300 bg-zinc-50 h-full'>
                    <Header selectedUser={selectedUser} />
                    <Conversation selectedUser={selectedUser} messages={messages} />
                    <Footer 
                        sendMessage={sendMessage} 
                        message={message} 
                        setMessage={setMessage}
                        onFileSelect={handleFileSelect}
                        fileInputRef={fileInputRef}
                        isUploading={isUploading}
                    />
                </div>
            ) : (<div className='w-full flex flex-col sm:w-2/3 border-l-1 border-zinc-300 bg-zinc-50 h-full justify-center items-center'>
                <GrChat className='text-7xl text-zinc-700' />
                <h1 className='text-xl mt-5 font-medium'>Select a conversation to begin chatting</h1>
            </div>)
            }
        </>

    )
}



const Header = ({ selectedUser }) => {
    return (
        <header className='w-full h-15 border-b-1 flex items-center px-3 border-zinc-300'>
            <div className="w-10 h-10 rounded-full  flex items-center justify-center bg-zinc-400 text-white text-xl font-semibold shrink-0 ">
                {selectedUser?.name[0]}
            </div>
            <div className='ml-2 font-semibold text-[18px] leading-tight'>{selectedUser?.name} <div className='text-[13px] leading-tight text-zinc-600'>{selectedUser?.phone}</div></div>
        </header>
    )
}


// const Conversation = ({ selectedUser, messages }) => {

//     const formatMessageDate = (isoString) => {
//         const msgDate = new Date(isoString);
//         const today = new Date();

//         today.setHours(0, 0, 0, 0);
//         const yesterday = new Date(today);
//         yesterday.setDate(yesterday.getDate() - 1);

//         const msgDay = new Date(msgDate);
//         msgDay.setHours(0, 0, 0, 0);

//         if (msgDay.getTime() === today.getTime()) {
//             return "Today";
//         } else if (msgDay.getTime() === yesterday.getTime()) {
//             return "Yesterday";
//         } else {
//             const day = msgDate.getDate().toString().padStart(2, '0');
//             const month = (msgDate.getMonth() + 1).toString().padStart(2, '0');
//             const year = msgDate.getFullYear().toString().slice(-2);
//             return `${day}/${month}/${year}`;
//         }
//     };


//     const beautifyTime = (isostring) => {
//         const date = new Date(isostring);

//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');

//         const time24hr = `${hours}:${minutes}`;
//         return time24hr;
//     }

//     return (
//         <div className=' flex-1 px-3 sm:px-7 overflow-x-auto pb-5'>



//             {messages.map((msg, idx) => (
//                 <div key={idx}>
//                     {
//                         <div className='w-full text-center mt-5 text-[13px]'><span className='bg-fuchsia-100 rounded-md px-3.5 py-1'>{formatMessageDate(msg.createdAt)}</span></div>
//                     }
//                     {msg.senderId === selectedUser._id ?
//                         (
//                             <div className='mt-5 flex'>
//                                 <div className='bg-zinc-200  max-w-9/10 sm:max-w-8/10 md:max-w-7/10  px-2.5 pt-1 rounded-md leading-tight shadow-md flex flex-col'>
//                                     {msg.message}
//                                     <span className='text-end  flex-1 text-[10px] mt-1 mb-1'>{formatMessageDate(msg.createdAt)}</span>
//                                 </div>
//                             </div>
//                         )
//                         :
//                         (

//                             <div className='mt-5 flex justify-end w-full'>
//                                 <div className='bg-yellow-100 max-w-9/10 sm:max-w-8/10 md:max-w-7/10 px-2.5 pt-1 rounded-md leading-tight shadow-md flex flex-col'>
//                                     <span className=' '>{msg.message}</span>

//                                     <span className='text-end  flex-1 text-[10px] mt-1 mb-1'>{beautifyTime(msg.createdAt)}</span>
//                                 </div>

//                             </div>
//                         )
//                     }
//                 </div>

//             ))}
//         </div>
//     )
// }


const Conversation = ({ selectedUser, messages }) => {

    const lastMessageRef = useRef(null);

    const formatMessageDate = (isoString) => {
        const msgDate = new Date(isoString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const msgDay = new Date(msgDate);
        msgDay.setHours(0, 0, 0, 0);

        if (msgDay.getTime() === today.getTime()) {
            return "Today";
        } else if (msgDay.getTime() === yesterday.getTime()) {
            return "Yesterday";
        } else {
            const day = msgDate.getDate().toString().padStart(2, '0');
            const month = (msgDate.getMonth() + 1).toString().padStart(2, '0');
            const year = msgDate.getFullYear().toString().slice(-2);
            return `${day}/${month}/${year}`;
        }
    };

    const beautifyTime = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView();
        }
    }, [messages]);

    let lastShownDate = "";

    return (
        <div className='flex-1 px-3 sm:px-7 overflow-y-auto pb-5'>

            {messages.map((msg, idx) => {
                const currentDate = formatMessageDate(msg.createdAt);
                const showDate = currentDate !== lastShownDate;
                if (showDate) lastShownDate = currentDate;

                const isLast = idx === messages.length - 1;

                return (
                    <div key={idx} ref={isLast ? lastMessageRef : null}>
                        {/* Show date separator only once per date group */}
                        {showDate && (
                            <div className='w-full text-center mt-5 text-[13px]'>
                                <span className='bg-fuchsia-100 rounded-md px-3.5 py-1'>
                                    {currentDate}
                                </span>
                            </div>
                        )}

                        {msg.senderId === selectedUser._id ? (
                            <div className='mt-4 flex'>
                                <div className='bg-zinc-200 max-w-9/10 sm:max-w-8/10 md:max-w-7/10 px-2.5 pt-1 rounded-md leading-tight shadow-md flex flex-col'>
                                    <MessageContent message={msg} />
                                    <span className='text-end text-[10px] mt-1 mb-1'>
                                        {beautifyTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className='mt-4 flex justify-end w-full'>
                                <div className='bg-yellow-100 max-w-9/10 sm:max-w-8/10 md:max-w-7/10 px-2.5 pt-1 rounded-md leading-tight shadow-md flex flex-col'>
                                    <MessageContent message={msg} />
                                    <span className='text-end text-[10px] mt-1 mb-1'>
                                        {beautifyTime(msg.createdAt)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MessageContent = ({ message }) => {
    const { messageType, fileUrl, fileName, message: text } = message;

    switch (messageType) {
        case 'image':
            return (
                <div className=''>
                    {text && <div className="mb-2">{text}</div>}
                    <img 
                        src={fileUrl} 
                        alt="Shared image" 
                        className="w-full h-auto cursor-pointer"
                        style={{ maxWidth: 220, objectFit: 'cover' }}
                        onClick={() => window.open(fileUrl, '_blank')}
                    />
                </div>
            );
        
        case 'video':
            return (
                <div>
                    {text && <div className="mb-2">{text}</div>}
                    <video 
                        src={fileUrl} 
                        controls 
                        className="max-w-full h-auto rounded-md"
                        style={{ maxWidth: 280, objectFit: 'cover' }}
                        
                    />
                </div>
            );
        
        case 'document':
            return (
                <div>
                    {text && <div className="mb-2">{text}</div>}
                    <div className="flex items-center p-2 bg-white rounded-md border">
                        {fileName?.endsWith('.pdf') ? (
                            <FaFilePdf className="text-red-500 text-lg mr-2" />
                        ) : (
                            <FaFile className="text-blue-500 text-lg mr-2" />
                        )}
                        <div className="flex-1">
                            <div className="text-sm font-medium">{fileName}</div>
                            <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline mr-2"
                            >
                                Open file
                            </a>
                        </div>
                    </div>
                </div>
            );
        
        default:
            return <span>{text}</span>;
    }
};

const Footer = ({ message, setMessage, sendMessage, onFileSelect, fileInputRef, isUploading }) => {
    return (
        <div className=' w-full h-13 flex items-center px-5 shadow-2xl border-t-1 border-zinc-300'>
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} p-1 rounded`}
            >
                <GrAttachment className='text-xl' />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                onChange={onFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mov,.avi"
                className="hidden"
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isUploading && sendMessage()}
                placeholder={isUploading ? 'Uploading file...' : 'Type a Message...'}
                className='flex-1 h-full ml-4 focus:outline-0'
                disabled={isUploading}
            />
            <button 
                onClick={sendMessage}
                disabled={isUploading || !message.trim()}
                className={`${isUploading || !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} p-1 rounded`}
            >
                <IoSend className='text-xl' />
            </button>
        </div>
    )
}
