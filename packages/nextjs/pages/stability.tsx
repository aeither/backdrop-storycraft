import { useState } from "react";
import type { NextPage } from "next";
import { UploadButton } from "~~/utils/uploadthing";

const Stability: NextPage = () => {
  const [currentImage, setCurrentImage] = useState("https://utfs.io/f/11307319-c248-48ff-8e59-60119c8f0cb8-c6yva7.jpg");
  const [base64Image, setBase64Image] = useState("");
  const [textInput, setTextInput] = useState("");

  const convertImage = async () => {
    try {
      const response = await fetch("/api/image-to-image", {
        method: "POST",
        body: JSON.stringify({ image: currentImage }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { base64Image } = await response.json();
        setBase64Image(base64Image);
      } else {
        throw new Error("Failed to convert image");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to call the Next.js API endpoint
  async function callTextToImageAPI(text: string) {
    const response = await fetch("/api/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to call the API");
    }

    const data = await response.json();
    return data;
  }

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
      <img className="w-full h-auto" src={base64Image} alt="Base64 encoded" />

      <input
        className="input"
        type="text"
        onChange={e => {
          setTextInput(e.target.value);
        }}
      />
      <button onClick={convertImage} className="btn btn-primary">
        Convert
      </button>
      <button
        onClick={() => {
          callTextToImageAPI(textInput)
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              console.error(error);
            });
        }}
        className="btn btn-primary"
      >
        Generate
      </button>
    </div>
  );
};

export default Stability;
