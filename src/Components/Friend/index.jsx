import { useEffect, useState } from 'react';
import AvatarUsersImages from '../../../public/Images/Demo.png'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { ActiveSingle } from '../../features/activeSingleSlice';
import { useLocation } from 'react-router-dom';
import { useToast } from "../../useToast";

const Friends = () => {

  const user = useSelector((user) => user.Login.loggedIn);
  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const db = getDatabase();
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast()


  // get friends list
  useEffect(() => {
    const starCountRef = ref(db, 'friends/');
    onValue(starCountRef, (snapshot) => {
      let friendsArray = []
      snapshot.forEach((item) => {
        if (user.uid === item.val().senderId || user.uid === item.val().receiverId) {
          friendsArray.push({ ...item.val(), id: item.key })
        }
      })
      setFriends(friendsArray);
      // Set the first friend as active if available
      if (friendsArray.length > 0 && location.pathname === '/message' && !activeFriend) {
        setActiveFriend(friendsArray[0].id);
        handleSingleChat(friendsArray[0]);
      }
    });
  }, [db, user.uid]);


  // Unfriend functionality
  const handleUnfriend = (item) => {
    const friendToUnfriendId = item.id;
    if (friendToUnfriendId) {
      remove(ref(db, `friends/${friendToUnfriendId}`))
        .then(() => {
          toast.success('Friend successfully removed!');
        })
        .catch((error) => {
          toast.error('Error removing friend: ', error);
        });
    }
  };

  // handleBlocked functionality
  const handleBlocked = (data) => {
    const friendId = data.id;
    const isBlocked = data.isBlocked || null;
    const blockedBy = data.blockedBy || null;

    if (!isBlocked || (isBlocked && blockedBy === user.uid)) {
      set(ref(db, `friends/${friendId}`), {
        ...data,
        isBlocked: !isBlocked,
        blockedBy: !isBlocked ? user.uid : data.receiverId,
      });
    } else {
      toast.error("You cannot unblock this friend.");
    }
  };

  // singleChat data
  const handleSingleChat = (data) => {
    setActiveFriend(data.id)
    if (user.uid === data.receiverId) {
      dispatch(ActiveSingle({
        status: "Single",
        id: data.senderId,
        name: data.senderName,
        profile: data.senderProfile,
        isBlocked: data.isBlocked || null,
        blockedBy: data.blockedBy || null,
      }))
      localStorage.setItem('Active', JSON.stringify({
        status: "Single",
        id: data.senderId,
        name: data.senderName,
        profile: data.senderProfile,
        isBlocked: data.isBlocked || null,
        blockedBy: data.blockedBy || null,
      }))
    } else {
      dispatch(ActiveSingle({
        status: "Single",
        id: data.receiverId,
        name: data.receiverName,
        profile: data.receiverProfile,
        isBlocked: data.isBlocked || null,
        blockedBy: data.blockedBy || null,
      }))
      localStorage.setItem('Active', JSON.stringify({
        status: "Single",
        id: data.receiverId,
        name: data.receiverName,
        profile: data.receiverProfile,
        isBlocked: data.isBlocked || null,
        blockedBy: data.blockedBy || null,
      }))
    }
  }


  return (
    <>
      <div className="bg-[#FFFFFF] shadow-xl rounded-md h-[635px] p-6 overflow-y-auto mt-6">
        <h1 className='font-fontInterBold text-[#494949] text-2xl'>My Friends</h1>
        {friends.length === 0 ? (
          <p className='text-center text-gray-500 mt-5'>No friends available.</p>
        ) : (
          friends?.map((item) => (
            <div
              className={`flex items-center justify-between mt-7 ${activeFriend === item.id ? 'bg-[#efefef]' : ''} cursor-pointer px-2 py-3 rounded-md transition-all ease-in-out duration-100`}
              key={item.id}
              onClick={() => handleSingleChat(item)}

            >
              <div>
                {item.isBlocked && item.blockedBy === user.uid
                  ?
                  <div className='flex items-center gap-x-2'>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                      {
                        user.uid === item.receiverId ?
                          <img src={item.senderProfile || AvatarUsersImages} alt="img" className='w-full h-full object-cover' />
                          :
                          <img src={item.receiverProfile || AvatarUsersImages} alt="img" className='w-full h-full object-cover' />
                      }
                    </div>
                    <h3 className='font-fontInterRegular text-black text-lg'>
                      {user.uid === item.senderId ? item.receiverName : item.senderName}
                    </h3>
                  </div>
                  : item.isBlocked
                    ?
                    <div className='flex items-center gap-x-2'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img src={AvatarUsersImages} alt="img" className='w-full h-full object-cover' />
                      </div>
                    </div>
                    :
                    <div className='flex items-center gap-x-2'>
                      <div className='w-12 h-12 rounded-full overflow-hidden'>
                        {
                          user.uid === item.receiverId ?
                            <img src={item.senderProfile || AvatarUsersImages} alt="img" className='w-full h-full object-cover' />
                            :
                            <img src={item.receiverProfile || AvatarUsersImages} alt="img" className='w-full h-full object-cover' />
                        }
                      </div>
                      <h3 className='font-fontInterRegular text-black text-lg'>
                        {user.uid === item.senderId ? item.receiverName : item.senderName}
                      </h3>
                    </div>
                }
              </div>
              <div className="text-black cursor-pointer flex gap-x-2 items-center">
                {item.isBlocked && item.blockedBy === user.uid
                  ?
                  <button
                    className='px-3 py-2 font-fontInterRegular bg-[#4A81D3] text-white rounded-md text-sm'
                    onClick={() => handleBlocked(item)}
                  >
                    UnBlock
                  </button>
                  : item.isBlocked
                    ?
                    <span className='font-fontInterRegular text-sm text-red-400'>You are Blocked by {user.uid === item.senderId ? item.receiverName : item.senderName}</span>
                    :
                    <div className='flex items-center gap-x-2'>
                      <button
                        className='px-3 py-2 font-fontInterRegular bg-[#4A81D3] text-white rounded-md text-sm'
                        onClick={() => handleUnfriend(item)}
                      >
                        Unfriend
                      </button>
                      <button
                        className='px-3 py-2 font-fontInterRegular bg-[#D34A4A] text-white rounded-md text-sm'
                        onClick={() => handleBlocked(item)}
                      >
                        Block
                      </button>
                    </div>
                }
              </div>
            </div>
          ))
        )
        }
      </div>
    </>
  )
}

export default Friends;