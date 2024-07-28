// 'use client';
// import {
//   GeoapifyContext,
//   GeoapifyGeocoderAutocomplete,
// } from '@geoapify/react-geocoder-autocomplete';
// import React, { ChangeEvent, useState } from 'react';
// import { categoriesObject } from '../../../database/categories';
// import { Event } from '../../../database/events';

// type Props = {
//   addResultsToShow: (events: Event[] | string) => void;
// };

// type FormFields = {
//   name: string;
//   userId: string;
//   location: string;
//   category: string;
// };

// type EventResponseBodyPost =
//   | {
//       events: Event[];
//     }
//   | { message: string };

// export default function FindEventCccurateForm(props: Props) {
//   const [selectedField, setSelectedField] = useState<keyof FormFields>('name');
//   const [formFields, setFormFields] = useState<FormFields>({
//     name: '',
//     userId: '',
//     category: '',
//     location: '',
//   });

//   const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSelectedField(e.target.value as keyof FormFields);
//   };

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
//   ) => {
//     const { name, value } = event.target;

//     setFormFields({
//       ...formFields,
//       [name]: value,
//     });
//   };

//   const categories = categoriesObject;

//   function sendGeocoderRequest(value: string, geocoder: any) {
//     return geocoder.sendGeocoderRequest(value);
//   }

//   function sendPlaceDetailsRequest(feature: any, geocoder: any) {
//     setFormFields({
//       ...formFields,
//       location: feature.properties.formatted,
//     });
//     return geocoder.sendPlaceDetailsRequest(feature);
//   }

//   async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const response = await fetch('/api/events/findAccurate', {
//       method: 'POST',
//       body: JSON.stringify({
//         field: selectedField,
//         query: formFields[selectedField],
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     const data: EventResponseBodyPost = await response.json();

//     if ('errors' in data) {
//       props.addResultsToShow(data.errors.message);
//       return;
//     }

//     if ('event' in data) {
//       props.addResultsToShow(data.events);
//     }
//   }

//   return (
//     <div className="wrapper">
//       <div className="event">
//         Choose one option to find exact match
//         <form onSubmit={handleSearch}>
//           <div>
//             <label htmlFor="name">
//               <label>
//                 <input
//                   type="radio"
//                   name="selectedField"
//                   value="name"
//                   checked={selectedField === 'name'}
//                   onChange={handleRadioChange}
//                 />
//                 Name:
//                 <input
//                   name="name"
//                   value={formFields.name}
//                   onChange={handleInputChange}
//                 />
//               </label>
//             </label>
//           </div>
//           <div>
//             <label htmlFor="userId">
//               <label>
//                 <input
//                   type="radio"
//                   name="selectedField"
//                   value="userId"
//                   checked={selectedField === 'userId'}
//                   onChange={handleRadioChange}
//                 />
//                 Organiser:
//                 <input
//                   name="userId"
//                   value={formFields.userId}
//                   onChange={handleInputChange}
//                 />
//               </label>
//             </label>
//           </div>
//           <div>
//             <label htmlFor="category">
//               <label>
//                 <input
//                   type="radio"
//                   name="selectedField"
//                   value="category"
//                   checked={selectedField === 'category'}
//                   onChange={handleRadioChange}
//                 />
//                 Category
//                 <select name="category" onChange={handleInputChange}>
//                   <option defaultValue="true" />
//                   {categories.map((category) => {
//                     return (
//                       <option
//                         key={`option-key-${category.name}`}
//                         value={category.name}
//                       >
//                         {category.name}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </label>
//             </label>
//           </div>
//           <div>
//             <label htmlFor="location">
//               <label>
//                 <input
//                   type="radio"
//                   name="selectedField"
//                   value="location"
//                   checked={selectedField === 'location'}
//                   onChange={handleRadioChange}
//                 />
//                 Location:
//                 <GeoapifyContext apiKey="4ca7dda985114a55bf51c15172c59328">
//                   <GeoapifyGeocoderAutocomplete
//                     placeholder="City"
//                     type="city"
//                     limit={3}
//                     allowNonVerifiedHouseNumber={true}
//                     sendGeocoderRequestFunc={sendGeocoderRequest}
//                     addDetails={true}
//                     sendPlaceDetailsRequestFunc={sendPlaceDetailsRequest}
//                   />
//                 </GeoapifyContext>
//               </label>
//             </label>
//           </div>
//           <button className="button-action">Find matching events</button>
//         </form>
//       </div>
//     </div>
//   );
// }
