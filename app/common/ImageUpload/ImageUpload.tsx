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
  addUrlOnUpload: (url: string) => void;
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
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [resultImage, setResultImage] = useState<UploadedImageData | null>(
    null,
  );

  return (
    <div>
      <CldUploadWidget
        options={props.options}
        signatureEndpoint="/api/imageUpload"
        onSuccess={(res) => {
          setResultImage(res.info as UploadedImageData);
          setIsUploaded(true);
          try {
            if (typeof res.info === 'string') {
              throw new Error('Unexpected string in res.info');
            }
            if (typeof res.info === 'undefined') {
              throw new Error('Unexpected undefined in res.info');
            }
            const secureUrl = res.info.secure_url;
            setImagePreviewUrl(secureUrl);
            props.addUrlOnUpload(secureUrl);
          } catch (error) {
            console.error('Error: ', error);
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
          width="300"
          height="100"
          src={imagePreviewUrl}
          sizes="100vw"
          crop="fill"
          alt={props.alt}
        />
      )}
    </div>
  );
}
