import { useState, useEffect, useRef } from "react";
import "./index.css";

interface window {
  cloudinary: any;
}

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void; // Callback function prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const [image, setImage] = useState("");

  useEffect(() => {
    cloudinaryRef.current = (window as unknown as window).cloudinary;
    if (!cloudinaryRef.current) return;
    widgetRef.current = (cloudinaryRef.current as any).createUploadWidget(
      {
        cloudName: "dvrcdxqex",
        uploadPreset: "ojyuicnt",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          const imageUrl = result.info.secure_url;
          setImage(imageUrl);
          onImageUpload(imageUrl);
        }
      }
    );
  }, []);

  return (
    <>
      <button
        className="image-upload-button"
        onClick={(e) => {
          e.preventDefault();
          (widgetRef.current as any).open();
        }}>
        Upload
      </button>
      {image && (
        <img className="image-upload-preview" src={image} alt="Uploaded" />
      )}
    </>
  );
};

export default ImageUpload;
