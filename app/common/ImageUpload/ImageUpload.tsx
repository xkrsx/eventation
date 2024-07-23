'use client';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

type Props = {
  buttonText: string;
  options: {
    sources: (
      | 'camera'
      | 'dropbox'
      | 'facebook'
      | 'gettyimages'
      | 'google_drive'
      | 'image_search'
      | 'instagram'
      | 'istock'
      | 'local'
      | 'shutterstock'
      | 'unsplash'
      | 'url'
    )[];
  };
  alt: string;
};
interface UploadedImageData {
  public_id: string;
  width: number;
  height: number;
  id: string;
}

export default function ImageUpload(props: Props) {
  const [resource, setResource] = useState();
  const [isUploaded, setIsUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [resultPicture, setResultPicture] = useState<UploadedImageData | null>(
    null,
  );
  return (
    <div>
      <CldUploadWidget
        options={props.options}
        signatureEndpoint="/api/imageUpload"
        onSuccess={(res) => {
          setResultPicture(res.info as UploadedImageData);
          setIsUploaded(true);
          try {
            if (typeof res.info === 'string') {
              throw new Error('Unexpected string in res.info');
            }
            if (typeof res.info === 'undefined') {
              throw new Error('Unexpected undefined in res.info');
            }
            const secureUrl = res.info.secure_url;
            setImageUrl(secureUrl);
          } catch (error) {
            console.error('Error:', error);
          }
        }}
      >
        {({ open }) => {
          function handleOnClick() {
            setResource(undefined);
            open();
          }
          return (
            <button onClick={handleOnClick}>
              {!isUploaded ? props.buttonText : 'Reupload new image'}
            </button>
          );
        }}
      </CldUploadWidget>

      {isUploaded && (
        <CldImage
          width="960"
          height="600"
          src={imageUrl}
          sizes="100vw"
          alt={props.alt}
        />
      )}
    </div>
  );
}
