import LoginForm from "../Components/Login";

const Login = () => {
  return (
    <>
      <div className='flex items-center justify-center h-screen w-full'>
        <div className='flex flex-col justify-center'>
          <h1 className='font-fontJotiRegular font-bold text-[70px] text-center'>TalkNest</h1>
          <div className='bg-white shadow-md rounded-md p-10'>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
