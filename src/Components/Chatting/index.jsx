import AvatarImage from "../../../public/Images/Avatar.png";
import { EmojiButtonIcons } from "../../Svg/EmojiButton";
import { GalleryButtonIcons } from "../../Svg/GalleryButton";
import recorderModal from "../Modal/recorderModal";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { getStorage, ref as Ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import { useToast } from "../../useToast";
import RecordVoiceMessage from "../VoiceRecorder";
import { MicrophoneButtonIcons } from "../../Svg/MicrophoneButton";

const Chattings = () => {
    const user = useSelector((user) => user.Login.loggedIn);
    const singleFriend = useSelector((single) => single.Active.active);
    const [messages, setMessages] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [emojiShow, setEmojiShow] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const db = getDatabase();
    const storage = getStorage();
    const chooseFile = useRef(null);
    const scrollRef = useRef(null);
    const toast = useToast();

    // Handle sending messages
    const handleSendMessage = async () => {
        if (messages.trim()) {
            if (singleFriend?.status === "Single") {
                await set(push(ref(db, "singleMessage")), {
                    whoSendName: user.displayName,
                    whoSendId: user.uid,
                    whoReceiveName: singleFriend.name,
                    whoReceiveId: singleFriend.id,
                    message: messages,
                    date: moment().toISOString()
                });
                setMessages('');
            } else {
                toast.error("Unable to send message.");
            }
        }
    };

    // Create singleMessages 
    const handleRecordSave = async (audioURL) => {
        if (singleFriend?.status === "Single") {
            await set(push(ref(db, "singleMessage")), {
                whoSendName: user.displayName,
                whoSendId: user.uid,
                whoReceiveName: singleFriend.name,
                whoReceiveId: singleFriend.id,
                date: moment().toISOString(),
                audio: audioURL
            });
        } else {
            toast.error("Unable to save audio message.");
        }
    };

    // Get all messages
    useEffect(() => {
        onValue(ref(db, "singleMessage/"), (snapshot) => {
            let singleMessageArray = [];
            snapshot.forEach((item) => {
                if (
                    (user.uid === item.val().whoSendId && item.val().whoReceiveId === singleFriend.id) ||
                    (user.uid === item.val().whoReceiveId && item.val().whoSendId === singleFriend.id)
                ) {
                    singleMessageArray.push(item.val());
                }
            });
            setAllMessages(singleMessageArray);
        });
    }, [singleFriend?.id]);

    // Emojis select function
    const handleEmojiSelect = ({ emoji }) => {
        setMessages(messages + emoji);
        setEmojiShow(!emojiShow);
    }

    // Image upload function
    const handleImageUpload = (e) => {
        const imageFiles = e.target.files[0];
        if (!imageFiles) {
            toast.error("No file selected.");
            return;
        }

        const storageRef = Ref(storage, `${user.displayName}/singleMessage/${Date.now()}_${imageFiles.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFiles);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error("Upload error:", error);
                toast.error("Error uploading image.");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    set(push(ref(db, "singleMessage")), {
                        whoSendName: user.displayName,
                        whoSendId: user.uid,
                        whoReceiveName: singleFriend.name,
                        whoReceiveId: singleFriend.id,
                        image: downloadURL,
                        date: moment().toISOString()
                    }).then(() => {
                        setMessages('');
                    }).catch(error => {
                        console.error("Error sending message:", error);
                        toast.error("Error sending message.");
                    });
                });
            }
        );
    }

    // Recorder Modal 
    const toggleModal = () => {
        setModalOpen((prev) => !prev);
    };

    // Scroll messages 
    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [allMessages]);

    // Handle send button
    const handleSendButton = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className='w-full bg-[#FFFFFF] shadow-lg rounded-md h-[635px] mt-6'>
            <div className="flex flex-col justify-between">
                <div className='py-4 bg-[#F9F9F9] px-6'>
                    <div className='flex items-center gap-x-2'>
                        <div className='w-12 h-12 rounded-full overflow-hidden'>
                            <img src={singleFriend?.profile || AvatarImage} alt="User Avatar" className='w-full h-full object-cover' />
                        </div>
                        <div>
                            <span className='font-fontInterRegular text-black'>
                                {singleFriend?.name || "please select friend for chatting"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='h-[487px] bg-white px-7 py-3 overflow-y-auto relative'>
                    {
                        singleFriend?.status === 'Single' && allMessages.map((item, i) => (
                            <div key={i} ref={scrollRef}>
                                {
                                    item.whoSendId === user.uid ? (
                                        <div>
                                            {item.image ? (
                                                <div className='w-[50%] ml-auto overflow-hidden my-3'>
                                                    <img src={item.image} alt="image" className='w-full h-full object-cover rounded-md' />
                                                </div>
                                            ) : item.audio ? (
                                                <div className='w-[50%] ml-auto flex justify-end flex-col items-end py-3'>
                                                    <audio controls>
                                                        <source src={item.audio} type="audio/wav" />
                                                    </audio>
                                                    <span className='mt-3 text-sm text-gray-400'>{moment(item.date).isValid() ? moment(item.date).fromNow() : "Invalid date"}</span>
                                                </div>
                                            ) : (
                                                <div className='w-[50%] ml-auto flex justify-end flex-col items-end'>
                                                    <p className='text-white font-fontInterRegular text-sm bg-slate-500 py-3 px-2 rounded-md inline-block'>{item.message}</p>
                                                    <span className='mt-3 text-sm text-gray-400'>{moment(item.date).isValid() ? moment(item.date).fromNow() : "Invalid date"}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {item.image ? (
                                                <div className='w-[50%] mr-auto overflow-hidden my-3'>
                                                    <img src={item.image} alt="image" className='w-full h-full object-cover rounded-md' />
                                                </div>
                                            ) : item.audio ? (
                                                <div className='w-[50%] mr-auto flex justify-end flex-col items-start py-3'>
                                                    <audio controls>
                                                        <source src={item.audio} type="audio/wav" />
                                                    </audio>
                                                    <span className='mt-3 text-sm text-gray-400'>{moment(item.date).isValid() ? moment(item.date).fromNow() : "Invalid date"}</span>
                                                </div>
                                            ) : (
                                                <div className='w-[50%] mr-auto my-4 flex justify-end flex-col items-start'>
                                                    <p className='text-black font-fontInterRegular text-sm bg-[#efefef] py-3 px-2 rounded-md inline-block'>{item.message}</p>
                                                    <span className='mt-3 text-sm text-gray-400'>{moment(item.date).isValid() ? moment(item.date).fromNow() : "Invalid date"}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
                {modalOpen && (
                    <div className="absolute top-[calc(82%)] left-[43%] transform -translate-x-2/5">
                        <recorderModal isOpen={modalOpen} onClose={toggleModal}>
                            <RecordVoiceMessage onSave={handleRecordSave} onClose={toggleModal} />
                        </recorderModal>
                    </div>
                )}
                <div className='bg-[#F9F9F9] w-[762px] rounded-md mx-auto py-3 flex items-center justify-center gap-x-10 z-0'>
                    <div className='flex items-start gap-x-2 w-[20%] text-[#292D32] cursor-pointer'>
                        <button onClick={toggleModal}>
                            <MicrophoneButtonIcons />
                        </button>
                        <div className="relative">
                            <div className="cursor-pointer" onClick={() => setEmojiShow((prev) => !prev)}>
                                <EmojiButtonIcons />
                            </div>
                            {emojiShow && (
                                <div className="absolute bottom-10">
                                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                </div>
                            )}
                        </div>
                        <div className="cursor-pointer" onClick={() => chooseFile.current.click()}>
                            <GalleryButtonIcons />
                        </div>
                        <input onChange={handleImageUpload} ref={chooseFile} type="file" hidden />
                    </div>
                    <input
                        type="text"
                        placeholder='something...'
                        className='w-[50%] outline-none bg-[#F5F5F5]'
                        onChange={(e) => setMessages(e.target.value)}
                        value={messages}
                        onKeyUp={handleSendButton}
                    />
                    <button className='bg-[#3E8DEB] w-[15%] px-3 py-3 rounded-md font-fontInterRegular text-sm text-white' onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chattings;