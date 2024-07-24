import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line no-restricted-syntax
export async function POST(request: NextRequest): Promise<NextResponse> {
  await cloudinary.api
    .create_upload_preset({
      unsigned: false,
      tags: 'remote',
      allowed_formats: 'jpg,png,webp',
      asset_folder: 'eventImage',
    })
    .then((result) => console.log(result));

  const body = (await request.json()) as {
    paramsToSign: Record<string, string>;
  };

  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({ signature });
}
