import { useEffect, useState } from 'react';
import AvatarUsersImages from '../../../public/Images/Demo.png'
import { AddUserButtonIcons } from '../../Svg/AddUserButton';
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { getStorage, ref as Ref, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import { FriendsButtonIcons } from '../../Svg/FriendsButton';

const UserLists = () => {
  const user = useSelector((user) => user.Login.loggedIn);
  const [searchItem, setSearchItem] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cancelRequest, setCancelRequest] = useState([]);
  const db = getDatabase();
  const storage = getStorage();

  // search functionality
  const handleInputChange = (e) => {
    let searchTerm = e.target.value;
    setSearchItem(searchTerm)

    let filteredItems = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filteredItems);
  }

  // create a userList and filter user  
  useEffect(() => {
    const starCountRef = ref(db, 'users/');
    onValue(starCountRef, (snapshot) => {
      let users = []
      snapshot.forEach((userList) => {
        if (user.uid !== userList.key) {
          getDownloadURL(Ref(storage, userList.key))
            .then((downloadURL) => {
              users.push({
                ...userList.val(),
                id: userList.key,
                photoURL: downloadURL
              })
            }).catch((error) => {
              users.push({
                ...userList.val(),
                id: userList.key,
                photoURL: null
              })
            }).then(() => {
              setUsers([...users])
              setFilteredUsers([...users])
            })
        }
      })
    });
  }, [db, user.uid, storage]);


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
    });
  }, [db, user.uid]);

  // find friends
  const isFriend = (userId) => {
    return friends.find(friend =>
      (friend.senderId === userId && friend.receiverId === user.uid) ||
      (friend.receiverId === userId && friend.senderId === user.uid)
    );
  };

  // send friend request 
  const handleFriendRequest = (data) => {
    set(push(ref(db, "friendRequest")), {
      senderName: user.displayName,
      senderId: user.uid,
      senderProfile: user.photoURL ?? '../../../public/Images/Demo.png',
      receiverName: data.username,
      receiverId: data.id,
      receiverProfile: data.photoURL ?? '../../../public/Images/Demo.png',
    })
  }

  // show friend reuest list and cancel list 
  useEffect(() => {
    let startCountRef = ref(db, "friendRequest/");
    onValue(startCountRef, (snapshot) => {
      let requestArray = []
      let cancelArray = []
      snapshot.forEach((item) => {
        requestArray.push(item.val().receiverId + item.val().senderId)
        cancelArray.push({ ...item.val(), id: item.key })
      })
      setFriendRequest(requestArray)
      setCancelRequest(cancelArray)
    })
  }, [db])

  // cancel request 
  const handleCancelRequest = (itemId) => {
    let reqToCancel = cancelRequest.find((req) => req.receiverId === itemId && req.senderId === user.uid)
    if (reqToCancel) {
      remove(ref(db, 'friendRequest/', reqToCancel.id))
    }
  }

  return (
    <>
      <div className="bg-[#FFFFFF] shadow-xl rounded-md h-[635px] p-6 overflow-y-auto mt-6">
        <h1 className='font-fontInterBold text-[#494949] text-2xl'>All Users</h1>
        <div className='pt-5'>
          <input
            type="text"
            value={searchItem}
            onChange={handleInputChange}
            placeholder="Search Users..."
            className="w-[100%] h-[50%] bg-[#F8F8F8] p-4 outline-none text-[#3D3C3C]"
          />
        </div>
        {(filteredUsers.length > 0 ? filteredUsers : users).map((item) => (
          <div className='flex items-center justify-between mt-7' key={item.id}>
            <div className='flex items-center gap-x-2'>
              <div className='w-12 h-12 rounded-full overflow-hidden'>
                <img src={item.photoURL || AvatarUsersImages} alt="User Avatar" className='w-full h-full object-cover' />
              </div>
              <h3 className='font-fontInterRegular text-black text-lg'>{item.username}</h3>
            </div>
            {
              isFriend(item.id) ?
                (
                  <div className='text-[#4A81D3] cursor-not-allowed'>
                    <FriendsButtonIcons />
                  </div>
                )
                :
                friendRequest.includes(item.id + user.uid) || friendRequest.includes(user.uid + item.id) ?
                  cancelRequest.find((req) => req.receiverId === item.id && req.senderId === user.uid)
                    ?
                    <button
                      className='px-4 py-2 font-fontInterRegular bg-[#D34A4A] text-white rounded-md text-sm'
                      onClick={() => handleCancelRequest(item.id)}
                    > Cancel
                    </button>

                    :
                    <button
                      className='px-4 py-2 font-fontInterRegular bg-[#4A81D3] text-white rounded-md text-sm cursor-not-allowed'
                    > Pending
                    </button>
                  :
                  <div className='text-red-500 cursor-pointer' onClick={() => handleFriendRequest(item)}>
                    <AddUserButtonIcons />
                  </div>
            }
          </div>
        ))}
      </div>
    </>
  )
}

export default UserLists;
