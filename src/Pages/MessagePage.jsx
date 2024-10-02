import Chattings from '../Components/Chatting';
import Friends from '../Components/Friend';

const Messages = () => {
  return (
    <>
      <div className='grid grid-cols-[3fr,6fr] gap-x-3'>
        <div className='w-full h-full'>
          <Friends />
        </div>
        <div className='mx-3'>
          <Chattings />
        </div>
      </div>
    </>
  )
}

export default Messages;
