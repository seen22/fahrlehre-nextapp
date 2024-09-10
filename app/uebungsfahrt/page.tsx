'use client'
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';

const uebungsfahrt = () => {
 const { register, handleSubmit } = useForm();
 const [studentId, setStudentId] = useState<string | null>(null);

 // Retrieve the student ID from the URL when the page loads
 useEffect(() => {
   const urlParams = new URLSearchParams(window.location.search);
   const id = urlParams.get('id');
   if (id) {
     setStudentId(id);
     console.log('Extracted ID from URL:', id);  // Log to verify
   } else {
     console.error('No ID found in URL');
   }
 }, []);

 const onSubmit = async (checkboxData: any) => {

   if (!studentId) {
     console.error('No student ID found.');
     return;
   }

   try {
     // Include the student ID in the data to be submitted
     const dataToSubmit = { ...checkboxData, id: studentId };

     // Send data to the API
     const response = await fetch('/api/saveStudentData', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(dataToSubmit),
     });
     const result = await response.json();

     if (response.ok && result.message === 'Data stored successfully') {
       console.log('Checkbox data saved successfully');
       window.location.href = `/DashboardPage?id=${result.id}`;
     } else {
       console.error('Failed to save checkbox data');
     }
   } catch (error) {
     console.error('Error saving checkbox data:', error);
   }
 };

 // if (!studentId) {
 //   return <div>Loading...</div>;
 // }

 return (
   <div className="max-w-xl mx-auto p-4">
     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div>
         <h3 className="font-bold text-lg mb-2">Rollen und Schalten</h3>
         <div className="flex justify-between items-center">
           <label className="text-sm font-medium">Abbremsen und Schalten</label>
           <input type="checkbox" {...register('Abbremsen und Schalten')} className="h-4 w-4" />
         </div>
         <div className="flex justify-between items-center">
           <label className="text-sm font-medium">Bremsübungen</label>
           <input type="checkbox" {...register('Bremsübungen')} className="h-4 w-4" />
         </div>
       </div>
       <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
         Speichern
       </button>
     </form>
   </div>
 );
};

export default uebungsfahrt;

// import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';


// const uebungsfahrt = () => {

 
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//    const [studentId, setStudentId] = useState<string | null>(null);
//   // const router= useRouter();
//   // const { id } = router.query; //Extract the student ID from the URL 
 
//   const onSubmit = async (checkboxData: any) => {
//  try{
//   const urlParams = new URLSearchParams(window.location.search);
//     const studentId = urlParams.get('id');

//       const dataToSubmit = {...checkboxData, id: studentId};

   
//   // Add the id to the checkbox data
//    //checkboxData.id = studentId;
    
//     // Send data to the API
//     const response = await fetch('/api/saveStudentData', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(dataToSubmit),
//     });
//     const result = await response.json();

//     if (response.ok && result.status === 200) {
//       console.log('Data saved successfully');
//     } else {
//       console.error('Failed to save data');
//     }
//   } catch (error) {
//     console.error('Error saving data:', error);
//   }
// };

// // const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
// //   if (error && 'message' in error) {
// //     return error.message as string;
// //   }
// //   return undefined;
// // };
//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     
//         <div>
//           <h3 className="font-bold text-lg mb-2">Rollen und Schalten</h3>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Abbremsen und Schalten</label>
//             <input type="checkbox" {...register('Abbremsen und Schalten')}
//              className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Bremsübungen</label>
//             <input type="checkbox"{...register('Bremsübungen')} className="h-4 w-4" />
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Speichern
//         </button>
//         </form>
//     </div>
//   );
// };

// export default uebungsfahrt;
//         {/* Section 2
//         <div>
//           <h3 className="font-bold text-lg mb-2">Bremsübungen</h3>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">degressiv</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Gefahrsituationen</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Zielbremsung</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//         </div> */

//         /* Section 3
//         <div>
//           <h3 className="font-bold text-lg mb-2">Gefälle und Steigung</h3>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Gefälle</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Steigung</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="ml-4 space-y-2">
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium">Anhalten</label>
//               <input type="checkbox" className="h-4 w-4" />
//             </div>
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium">Anfahren</label>
//               <input type="checkbox" className="h-4 w-4" />
//             </div>
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium">Rückwärts</label>
//               <input type="checkbox" className="h-4 w-4" />
//             </div>
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium">Sichern</label>
//               <input type="checkbox" className="h-4 w-4" />
//             </div>
//             <div className="flex justify-between items-center">
//               <label className="text-sm font-medium">Schalten</label>
//               <input type="checkbox" className="h-4 w-4" />
//             </div>
//           </div>
//         </div> */

//         /* Section 4
//         <div>
//           <h3 className="font-bold text-lg mb-2">Weitere Übungen</h3>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Tastgeschwindigkeit</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Bedienungs- + Kontrolleinrichtungen</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//           <div className="flex justify-between items-center">
//             <label className="text-sm font-medium">Örtliche Besonderheiten</label>
//             <input type="checkbox" className="h-4 w-4" />
//           </div>
//         // </div> */}
    
