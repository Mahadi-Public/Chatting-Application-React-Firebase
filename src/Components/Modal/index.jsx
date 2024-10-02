import React, { useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { CrossButtonIcons } from '../../Svg/CrossButton';
import { UploadImageIcons } from '../../Svg/UploadImage';
import ImageCroppers from '../ImageCropper';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, updateProfile } from "firebase/auth";
import { LoggedInUser } from '../../features/loginSlice';
import { useToast } from '../../useToast';

const ProfileUpload = ({ showProfileModal, setShowProfileModal }) => {
    const user = useSelector((state) => state.Login.loggedIn);
    const auth = getAuth();
    const toast = useToast();
    const dispatch = useDispatch();
    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("#");
    const cropperRef = useRef();
    const fileRef = useRef(null);
    const storage = getStorage();
    const storageRef = ref(storage, user.uid);

    const handleChange = (e) => {
        e.preventDefault();
        let files = e.target.files;

        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const getCropData = async () => {
        if (cropperRef.current?.cropper) {
            const croppedCanvasDataUrl = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            setCropData(croppedCanvasDataUrl);
            const toastId = toast.loading("Profile photo is uploading, please wait...");
            try {
                await uploadString(storageRef, croppedCanvasDataUrl, 'data_url');
                const downloadURL = await getDownloadURL(storageRef);

                await updateProfile(auth.currentUser, { photoURL: downloadURL });
                dispatch(LoggedInUser({ ...user, photoURL: downloadURL }));
                localStorage.setItem("LoginUser", JSON.stringify({ ...user, photoURL: downloadURL }));
                setShowProfileModal(false);

                toast.update(toastId, {
                    render: 'Successfully uploaded your profile photo',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                    theme: "light",
                });
            } catch (error) {
                toast.update(toastId, {
                    render: 'Please reupload your photo',
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    theme: "light",
                });
            }
        } else {
            toast.error("Cropper not initialized");
        }
    };

    return (
        <>
            {showProfileModal && (
                <div className='fixed inset-0 flex items-center justify-center z-10'>
                    <div className='absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm' />
                    <div className='w-full max-w-lg rounded-lg bg-white p-6 relative shadow-lg z-20'>
                        <h3 className='font-fontInterRegular text-black text-lg text-center mb-3'>Upload Photo</h3>
                        <div className='absolute top-2 right-2 cursor-pointer text-red-500' onClick={() => setShowProfileModal(false)}>
                            <CrossButtonIcons />
                        </div>
                        <div className='bg-slate-200 rounded-md w-full h-[230px] flex items-center justify-center cursor-pointer' onClick={() => fileRef.current.click()}>
                            <div className='flex flex-col items-center'>
                                <UploadImageIcons />
                                <h4 className='font-fontInterRegular text-[#494949] mt-2'>Upload your profile picture</h4>
                                <input type="file" ref={fileRef} hidden onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    {image && (
                        <ImageCroppers
                            image={image}
                            setImage={setImage}
                            cropperRef={cropperRef}
                            getCropData={getCropData}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default ProfileUpload;
