import Friends from "../Components/Friend";
import FriendRequests from "../Components/FriendRequest";
import LoggedInUserRoute from "../Components/PrivateRoute/loggedInUserRoute";
import UserLists from "../Components/UserLists";

const Home = () => {
  return (
    <div className="grid grid-cols-[2fr,5fr] gap-x-10 ml-6">
      <div>
        <UserLists />
        <LoggedInUserRoute />
      </div>
      <div className="w-full grid grid-cols-2 gap-x-6">
        <div >
          <FriendRequests />
        </div>
        <div >
          <Friends />
        </div>
      </div>
    </div>
  );
};

export default Home;
