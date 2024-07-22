'use client';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function ImageUpload() {
  const [resource, setResource] = useState();
  return (
    <CldUploadWidget
      signatureEndpoint="/api/imageUpload"
      onSuccess={(result, { widget }) => {
        setResource(result?.info); // { public_id, secure_url, etc }
        widget.close();
      }}
    >
      {({ open }) => {
        function handleOnClick() {
          setResource(undefined);
          open();
        }
        return <button onClick={handleOnClick}>Upload an Image</button>;
      }}
    </CldUploadWidget>
  );
}
