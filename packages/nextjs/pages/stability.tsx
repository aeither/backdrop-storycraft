import { useState } from "react";
import type { NextPage } from "next";
import { UploadButton } from "~~/utils/uploadthing";

const Stability: NextPage = () => {
  const [currentImage, setCurrentImage] = useState("https://utfs.io/f/11307319-c248-48ff-8e59-60119c8f0cb8-c6yva7.jpg");

  return (
    <div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={res => {
          console.log("Files: ", res);
          setCurrentImage(res[0]?.url);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <img src={currentImage} alt="" className="max-w-2xl mx-auto p-16" />
      <button
        onClick={() => {
          // textToImage();
        }}
        className="btn btn-primary"
      >
        Convert
      </button>
    </div>
  );
};

export default Stability;
