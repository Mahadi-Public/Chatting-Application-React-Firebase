import RegisterForm from "../Components/Register";

const Register = () => {
    return (
        <>
            <div className='flex flex-col items-center justify-center h-screen w-full'>
                <h1 className='font-fontJotiRegular font-bold text-[70px]'>TalkNest</h1>
                <div className='bg-white shadow-md rounded-md p-10'>
                    <RegisterForm />
                </div>
            </div>
        </>
    )
}

export default Register;
