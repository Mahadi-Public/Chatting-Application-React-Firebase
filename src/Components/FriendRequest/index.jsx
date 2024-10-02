import { useEffect, useState } from 'react';
import AvatarUsersImages from '../../../public/Images/Demo.png';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useSelector } from 'react-redux';

const FriendRequests = () => {
  const user = useSelector((user) => user.Login.loggedIn);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const db = getDatabase();

  // Show all requests
  useEffect(() => {
    const starCountRef = ref(db, 'friendRequest/');
    onValue(starCountRef, (snapshot) => {
      let friendRequestArray = [];
      snapshot.forEach((item) => {
        if (user.uid === item.val().receiverId) {
          friendRequestArray.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequestList(friendRequestArray);
    });
  }, [db, user.uid]);

  // accept request
  const handleAccept = (data) => {
    set(push(ref(db, 'friends')), {
      ...data,
    }).then(() => {
      remove(ref(db, 'friendRequest/', data.id))
    })
  }

  // reject request
  const handleReject = (data) => {
    remove(ref(db, 'friendRequest/', data.id))
  }

  return (
    <>
      <div className="bg-[#FFFFFF] shadow-xl rounded-md h-[635px] p-6 overflow-y-auto mt-6">
        <h1 className='font-fontInterBold text-[#494949] text-2xl'>Friend Requests</h1>
        {friendRequestList.length === 0 ? (
          <p className='text-center text-gray-500 mt-5'>No friend requests available.</p>
        ) : (
          friendRequestList.map((item) => (
            <div key={item.id} className='flex items-center justify-between mt-7'>
              <div className='flex items-center gap-x-2'>
                <div className='w-12 h-12 rounded-full overflow-hidden'>
                  <img src={item.senderProfile || AvatarUsersImages} alt="Profile" className='w-full h-full object-cover' />
                </div>
                <h3 className='font-fontInterRegular text-black text-lg'>
                  {item.senderName}
                </h3>
              </div>
              <div className='flex items-center gap-x-2'>
                <button className='px-4 py-2 font-fontInterRegular bg-[#4A81D3] text-white rounded-md text-sm' onClick={() => handleAccept(item)}>Accept</button>
                <button className='px-4 py-2 font-fontInterRegular bg-[#D34A4A] text-white rounded-md text-sm' onClick={() => handleReject(item)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FriendRequests;
