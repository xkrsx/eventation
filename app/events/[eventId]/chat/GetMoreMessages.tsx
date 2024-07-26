// 'use client';

// import { useState } from 'react';
// import ErrorMessage from '../../../ErrorMessage';

// type Props = {
//   eventId: number;
// };

// export default function GetMoreMessages(props: Props) {
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const response = await fetch(`/api/eventLounge/${time}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     setErrorMessage('');

//     if (!response.ok) {
//       let newErrorMessage = 'Error creating message';

//       try {
//         const body: BodyResponse = await response.json();
//         newErrorMessage = body.error;
//       } catch {}

//       setErrorMessage(newErrorMessage);
//       return;
//     }

//     const data: ApiResponse = await response.json();

//     setInput('');
//     return data;
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <button disabled={!input && true}>Send</button>
//         </div>
//       </form>

//       <ErrorMessage>{errorMessage}</ErrorMessage>
//     </div>
//   );
// }
