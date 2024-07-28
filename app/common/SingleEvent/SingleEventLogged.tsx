'use server';

import './SingleEvent.scss';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Event } from '../../../database/events';
import { getValidSession } from '../../../database/sessions';
import { getUserPublicByIdInsecure } from '../../../database/users';
import {
  checkStatus,
  countAttendantsInsecure,
} from '../../../database/usersEventsStatus';
import AttendanceStatusForm from '../AttendanceStatus/AttendanceStatusForm';
import DownloadIcs from '../DownloadIcs/DownloadIcs';
import DownloadIcsButton from '../DownloadIcs/DownloadIcs';
import EventImage from '../Images/EventImage/EventImage';

type Props = {
  event: Event;
};

export default async function SingleEventLogged(props: Props) {
  const sessionCookie = cookies().get('sessionToken');
  const session = sessionCookie && (await getValidSession(sessionCookie.value));
  if (!session) {
    return redirect('/profile?returnTo=/profile/events');
  }

  const organiser = await getUserPublicByIdInsecure(props.event.userId);

  const attendanceSessionCheck = await checkStatus(
    session.token,
    session.userId,
    Number(props.event.id),
  );
  const attendantsCount = await countAttendantsInsecure(Number(props.event.id));
  if (!attendantsCount) {
    return redirect('/profile?returnTo=/profile/events');
  }

  return (
    <div className="event">
      <div className="event-left">
        <h1>
          <Link href={`/events/${props.event.id}`}>{props.event.name}</Link>
        </h1>
        <a href={props.event.image} target="_blank" rel="noreferrer">
          <EventImage event={props.event} />
        </a>

        <p>
          <Link href={`/events/${props.event.id}/chat`}>
            <svg
              className="menu-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#0f0c1d"
            >
              <title id="chatTitle">Enter chat</title>
              <desc id="chatDesc">Link to enter event chat.</desc>
              <path d="M320-60v-221q-101-8-170.5-82T80-540q0-109 75.5-184.5T340-800h27l-63-64 56-56 160 160-160 160-56-56 63-64h-27q-75 0-127.5 52.5T160-540q0 75 52.5 127.5T340-360h60v107l107-107h113q75 0 127.5-52.5T800-540q0-75-52.5-127.5T620-720h-20v-80h20q109 0 184.5 75.5T880-540q0 109-75.5 184.5T620-280h-80L320-60Z" />
            </svg>
            event lounge & info stream
          </Link>
        </p>
      </div>
      <div className="event-right">
        <p>
          Organiser:{' '}
          <Link href={`/profile/${organiser?.username}`}>
            {organiser?.username}
          </Link>
        </p>
        <p>
          start:{' '}
          {dayjs(props.event.timeStart).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>
          end: {dayjs(props.event.timeEnd).format('dddd, HH:mm, DD/MM/YYYY')}
        </p>
        <p>price: {props.event.price}</p>
        <p>location: {props.event.location}</p>
        <p>
          category: <Link href="/categories">{props.event.category}</Link>
        </p>
        <div>
          <p>{props.event.description}</p>
          <p>
            <a target="_blank" rel="noreferrer" href={props.event.link}>
              {props.event.link}
            </a>
          </p>

          <p>
            number of attendants:{' '}
            {attendantsCount.count
              ? attendantsCount.count
              : 'No one yet. Be first!'}
          </p>

          <DownloadIcsButton event={props.event} />

          <Link href={`/events/${props.event.id}`}>See more</Link>
        </div>

        {attendanceSessionCheck ? (
          session.userId === organiser?.id ? (
            <div>
              <strong>You are an organiser</strong>
              <p>
                <Link href={`/events/${props.event.id}/edit`}>
                  Edit or delete this event
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <p>
                chat:{' '}
                <Link href={`/events/${props.event.id}/chat`}>
                  event lounge & info stream
                </Link>
              </p>
              <AttendanceStatusForm
                event={props.event}
                session={session}
                isAttending={attendanceSessionCheck.isAttending}
                isOrganising={false}
                methodAPI="PUT"
              />
            </div>
          )
        ) : (
          <AttendanceStatusForm
            event={props.event}
            session={session}
            isOrganising={false}
            methodAPI="POST"
          />
        )}
      </div>
    </div>
  );
}
