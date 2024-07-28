'use client';

import './ImageUpload.scss';
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
  uploadType: string;
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
    <div className="preview-upload">
      <div className="preview">
        {isUploaded &&
          (props.uploadType === 'event' ? (
            <CldImage
              width="300"
              height="500"
              src={imagePreviewUrl}
              sizes="100vw"
              crop="fill"
              alt={props.alt}
            />
          ) : (
            <div style={{ borderRadius: '50%' }}>
              <CldImage
                width="150"
                height="150"
                src={imagePreviewUrl}
                sizes="100vw"
                crop="fill"
                alt={props.alt}
              />
            </div>
          ))}
      </div>
      <div className="upload">
        <CldUploadWidget
          options={props.options}
          signatureEndpoint={`/api/imageUpload/${props.uploadType}`}
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
              <button className="button-action" onClick={handleOnClick}>
                {!isUploaded ? props.buttonText : 'Reupload new image'}
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
}
