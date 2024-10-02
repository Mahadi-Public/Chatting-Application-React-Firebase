import React from 'react'
import { CrossButtonIcons } from '../../Svg/CrossButton';
import { Cropper } from 'react-cropper';

const ImageCroppers = ({ image, setImage, cropperRef, getCropData }) => {
    return (
        <>
            <div className='fixed inset-0 flex items-center justify-center z-30'>
                {/* Backdrop with blur effect */}
                <div className='absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm' />
                {/* Modal content */}
                <div className='w-full max-w-lg rounded-lg bg-white p-4 relative shadow-lg z-20'>
                    <h3 className='font-fontInterRegular text-black text-lg text-center'>Upload Photo</h3>
                    <div
                        className='absolute top-2 right-2 cursor-pointer text-red-500'
                        onClick={() => setImage()}
                    >
                        <CrossButtonIcons />
                    </div>
                    <div className='w-20 h-20 rounded-full overflow-hidden'>
                        <div
                            className="img-preview"
                            style={{ width: "100%", float: "left", height: "300px" }}
                        />
                    </div>
                    <div className='py-4'>
                        <Cropper
                            ref={cropperRef}
                            style={{ height: 400, width: "100%" }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false}
                            guides={true}
                        />
                    </div>
                    <div>
                        <button onClick={() => getCropData()} className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition duration-200 font-fontInterRegular'> Crop</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageCroppers;