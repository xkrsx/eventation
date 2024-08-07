import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  addStatus,
  updateStatus,
  UsersEventsStatus,
} from '../../../../database/usersEventsStatus';
import { usersEventsStatusSchema } from '../../../../migrations/00003-createTableUsersEvents';

export type UsersEventsStatusResponseBodyPost =
  | {
      status: UsersEventsStatus;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<UsersEventsStatusResponseBodyPost>> {
  const requestBody = await request.json();

  // Validation schema for request body
  const result = usersEventsStatusSchema.safeParse(requestBody);

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain attendance object.',
        errorIssues: result.error.issues,
      },
      { status: 400 },
    );
  }

  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  const newAttendanceStatus =
    sessionCookie &&
    (await addStatus(
      sessionCookie.value,
      result.data.userId,
      result.data.eventId,
      result.data.isOrganising,
      result.data.isAttending,
    ));

  if (!newAttendanceStatus) {
    return NextResponse.json(
      {
        error: 'Attendance status not changed or access denied updating it.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: newAttendanceStatus });
}

export type UsersEventsStatusResponseBodyPut =
  | {
      status: UsersEventsStatus;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
): Promise<NextResponse<UsersEventsStatusResponseBodyPut>> {
  const requestBody = await request.json();

  // If client sends request body with incorrect data,
  // return a response with a 400 status code to the client
  const result = usersEventsStatusSchema.safeParse(requestBody);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Request does not contain event object.',
        errorIssues: result.error.issues,
      },
      { status: 400 },
    );
  }

  // 1. Checking if the sessionToken cookie exists
  const sessionCookie = cookies().get('sessionToken');

  // TODO FIX it doesn't update, but apparently post new record
  const updatedAttendance =
    sessionCookie &&
    (await updateStatus(
      sessionCookie.value,
      result.data.userId,
      result.data.eventId,
      result.data.isOrganising,
      result.data.isAttending,
    ));

  if (!updatedAttendance) {
    return NextResponse.json(
      {
        error:
          'Attendance not changed or access denied changing attendance status.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: updatedAttendance });
}

// type UsersEventsStatusResponseBodyDelete =
//   | {
//       status: UsersEventsStatus;
//     }
//   | {
//       error: string;
//     };

// // export async function DELETE(
// //   request: Request,
// //   { params }: EventParams,
// // ): Promise<NextResponse<UsersEventsStatusResponseBodyDelete>> {
// //   // 1. Checking if the sessionToken cookie exists
// //   const sessionCookie = cookies().get('sessionToken');
// //   const event =
// //     sessionCookie &&
// //     (await deleteUsersEventOrganising(
// //       sessionCookie.value,
// //       Number(params.eventId),
// //     ));

// //   if (!event) {
// //     return NextResponse.json({ error: 'Event not found' }, { status: 404 });
// //   }
// //   return NextResponse.json({ event: event });
// // }
