
'use client'
import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { DataFactory, Writer } from 'n3';
import { SetStateAction, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // UUID für eindeutige IDs


export default function HalloPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [formData, setFormData] = useState({});
  const [rdfData, setRdfData] = useState('');
  const router = useRouter(); 

    // Funktion zum Senden der Daten an den Fuseki-Server
    const sendToFuseki = async (rdfData : any) => {
      const updateQuery = `
         PREFIX ex: <https://github.com/seen22/fahrlere-nextapp/>
        PREFIX schema: <http://schema.org/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        INSERT DATA {
          ${rdfData}
        }
      `;
      console.log("SPARQL Update Query:", updateQuery);

    
      try {
        const response = await fetch('http://localhost:3030/FahrlehrerApp/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-update',
          },
          body: updateQuery,
        });
    
        const responseText = await response.text();
        if (response.ok) {
          console.log('Daten erfolgreich an Fuseki gesendet');
        } else {
          console.error('Fehler beim Senden der Daten an Fuseki', responseText);
        }
      } catch (error) {
        console.error('Fehler:', error);
      }
    };


    const onSubmit = async (formData: any) => {
      const { namedNode, literal } = DataFactory;
      const writer = new Writer();
    
      // Create a unique subject using timestamp or another identifier
      const uniqueID = uuidv4();
      const uniqueSubject = `https://github.com/seen22/fahrlere-nextapp/formEntry-${uniqueID}`;
      const subject = namedNode(uniqueSubject);
    
      // Get the current timestamp in local time
      const currentTimestamp = new Date().toLocaleString("sv-SE", { timeZone: 'Europe/Berlin' }).replace(' ', 'T') + 'Z';
    
      // Add the timestamp
      const timestampPredicate = namedNode('https://github.com/seen22/fahrlere-nextapp/timestamp');
      const timestampObject = literal(currentTimestamp, namedNode('https://github.com/seen22/fahrlere-nextapp/XMLSchema#dateTime'));
      writer.addQuad(subject, timestampPredicate, timestampObject);
    
      // Map form data to RDF triples
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'birthDate') {
          const predicate = namedNode('https://github.com/seen22/fahrlere-nextapp/birthDate');
          const object = literal(value as string | number, namedNode('http://www.w3.org/2001/XMLSchema#date'));
          writer.addQuad(subject, predicate, object);
        } else if (key === 'eyewear') {
          const predicate = namedNode('http://schema.org/eyewear');
          const object = literal(value as string | number);
          writer.addQuad(subject, predicate, object);
        } else {
          const predicate = namedNode(`https://github.com/seen22/fahrlere-nextapp/${key}`);
          const object = literal(value as string | number);
          writer.addQuad(subject, predicate, object);
        }
      });
    
      // Serialize and send to Fuseki
      writer.end((error: any, result: any) => {
        if (error) {
          console.error('Failed to serialize RDF data', error);
        } else {
          console.log("RDF-Triple:\n", result);
          setRdfData(result);
          sendToFuseki(result); // Send the serialized data to Fuseki

          router.push(`/DashboardPage?id=${uniqueID}`);
        }
      });
    };
    
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
   const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
    if (error && 'message' in error) {
      return error.message as string;
      
    }
    return undefined;
    
  };
//   const fetchFromFuseki = async () => {
//     const latestDataQuery = `
//       PREFIX ex: <https://github.com/seen22/fahrlere-nextapp/>
//       SELECT ?subject ?predicate ?object
//       WHERE {
//         ?subject ex:timestamp ?timestamp .
//         ?subject ?predicate ?object .
//       }
//       ORDER BY DESC(?timestamp)
//     `; 
  
//     try {
//       // Fetch RDF data from Fuseki
//       const response = await fetch('http://localhost:3030/test_next/query', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded', // Correct content type for SPARQL queries
//           'Accept': 'application/sparql-results+json', // Expecting SPARQL results in JSON
//         },
//         body: `query=${encodeURIComponent(latestDataQuery)}`, // Encode query
//       });
  
//       if (!response.ok) {
//         throw new Error(`Failed to fetch data from Fuseki: ${response.statusText}`);
//       }
  
//       // Get the response as JSON
//       const rdfData = await response.json();
//       console.log('Fetched RDF data:', rdfData);

//       if (rdfData.results.bindings.length > 0) {
//         console.log('Bindings:', rdfData.results.bindings); // Überprüfe die Bindings

//           //convert JSON to Dictionary
//         const finalDictionary = convertJsonToDict(rdfData);
//         console.log('Finales Dictionary:', finalDictionary)

//         convertDictToPdf(finalDictionary);
//       }
//       else {
//           console.log('No data available for download');
//       }


  
//         // Convert the JSON response to a string (you can format it if needed)
//         // const rdfDataString = JSON.stringify(rdfData, null, 2);
  
//         // Create a Blob (text file) with the fetched data
//         // const blob = new Blob([rdfDataString], { type: 'application/json' }); // or 'text/turtle' for Turtle format
  
//         // Create a temporary link element to download the file
//         // const link = document.createElement('a');
//         // link.href = URL.createObjectURL(blob);
//         // link.download = 'latest_data.json'; // or '.ttl' if you're using Turtle format
  
//         // // Append the link to the body and trigger a click
//         // document.body.appendChild(link);
//         // link.click();
  
//         // // Remove the link from the DOM
//         // document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error fetching RDF data:', error);
//     }
//   };  
//    // Funktion zur Umwandlung von JSON in ein Dictionary
//    const convertJsonToDict = (retrievedDictionary: { [x: string]: any }) => {
//     const resultsDictionary = retrievedDictionary['results'];
//     const bindings = resultsDictionary['bindings'];
//     const newFinalDictionary: { [key: string]: string } = {}; // Definiere das Dictionary
  
//     bindings.forEach((bind: { subject: any; predicate: { value: string }; object: { value: string } }) => {
//       // Überprüfe und extrahiere den Wert aus dem Subject
//       const subjectValue = bind.subject?.value || 'No Subject';
//       const predicateValue = bind.predicate?.value || 'No Predicate'; // Prädikatwert
//       const objectValue = bind.object?.value || 'No Object'; // Objektwert
  
//       console.log('Subject:', subjectValue);
//       console.log('Predicate:', predicateValue);
//       console.log('Object:', objectValue);
  
//       // Letzten Teil der Subject-URI extrahieren
//       const subjectKey = subjectValue.split('/').pop() || 'subject';
//       // Letzten Teil der Predicate-URI extrahieren
//       const predicateKey = predicateValue.split('/').pop() || 'predicate';
  
//       // Falls Predicate und Object vorhanden sind, zum Dictionary hinzufügen
//       if (predicateKey && objectValue) {
//         newFinalDictionary[predicateKey] = objectValue; // Prädikat als Schlüssel, Objekt als Wert
//       }
//     });
  
//     console.log('Finales Dictionary:', newFinalDictionary);
//     return newFinalDictionary; // Rückgabe des finalen Dictionarys
//   };
  

//   const convertDictToPdf = (dictionary: { [key: string]: string }) => {

//   const doc = new jsPDF();

//   // Set a main title for the PDF
//   doc.setFontSize(18);
//   doc.text("GOLD Fahrschule", 10, 10);

//   // Subtitle or additional information
//   doc.setFontSize(14);
//   doc.text("Fahrschule Datenübersicht", 10, 20);

//   let y = 40; // Starting y position for content
//   doc.setFontSize(12);

//   // Separate the data into categories
//   const studentDataKeys = ['firstName', 'lastName', 'birthDate', 'eyewear']; // Keys that belong to "Schülerdaten"
//   const AdToCardKeys = ['stop', 'rightTurn', 'multiLaneRightTurn', 'railwayCrossing', 'leftTurn', 'multiLaneLeftTurn', 'gearSelection', 'bikeLane', 'bikeOvertake', 'entrance', 'speedAdjustment']; // Keys that belong to "Users Page"
//   const userPageDataKey =['Bremsübungen', 'Abbremsen_und_Schalten'];

//   const studentData: { [key: string]: string } = {};
//   const AdToCard: { [key: string]: string } = {};
//   const userPageData: {[key:string]: string} = {};

//   // Split dictionary data into categories
//   for (const [key, value] of Object.entries(dictionary)) {
//     if (studentDataKeys.includes(key)) {
//       studentData[key] = value;
//     } else if (userPageDataKey.includes(key)) {
//       userPageData[key] = value;
//     }else if (AdToCardKeys.includes(key)) {
//       AdToCard[key] = value;
      
//     }
//   }

//   // Add "Schülerdaten" section
//   if (Object.keys(studentData).length > 0) {
//     doc.setFontSize(14);
//     doc.text("Schülerdaten:", 10, y);
//     y += 10;
//     doc.setFontSize(12);

//     for (const [key, value] of Object.entries(studentData)) {
//       doc.text(`${key}: ${value}`, 10, y);
//       y += 10;

//       if (y > 280) { // Page break if necessary
//         doc.addPage();
//         y = 10;
//       }
//     }
//   }

 
//   if (Object.keys(AdToCard).length > 0) {
//     y += 10; // Add some spacing before the next section
//     doc.setFontSize(14);
//     doc.text("Add to Card Page:", 10, y);
//     y += 10;
//     doc.setFontSize(12);

//     for (const [key, value] of Object.entries(AdToCard)) {
//       doc.text(`${key}: ${value}`, 10, y);
//       y += 10;

//       if (y > 280) { // Page break if necessary
//         doc.addPage();
//         y = 10;
//       }
//     }
//   }
//   if (Object.keys(userPageData).length > 0) {
//     y += 10; // Add some spacing before the next section
//     doc.setFontSize(14);
//     doc.text("Users Page:", 10, y);
//     y += 10;
//     doc.setFontSize(12);

//     for (const [key, value] of Object.entries(userPageData)) {
//       doc.text(`${key}: ${value}`, 10, y);
//       y += 10;

//       if (y > 280) { // Page break if necessary
//         doc.addPage();
//         y = 10;
//       }
//     }
//   }

//   // Save the PDF file
//   doc.save('fahrschule_daten.pdf');
// };

  
  
  
//   const onSubmit = async (studentData: any) => {
//     console.log(studentData);
//     const updateQuery = `
//       PREFIX foaf: <http://xmlns.com/foaf/0.1/>
//       PREFIX ex: <http://example.org/ontology/>
//       INSERT DATA {
//           <http://example.org/student/Person51> a foaf:Person ;
//             foaf:givenName "${studentData.firstName}" ;
//             foaf:familyName "${studentData.lastName}" ;
//             ex:birthDate "${studentData.birthDate}" ;
//             ex:phoneNumber "${studentData.phoneNumber}" ;
//             ex:address "${studentData.address}" ;
//             ex:applicationDate "${studentData.applicationDate}" ;
//             ex:visionAid "${studentData.sehhilfe}" .
//       }`;
  
//     try {
//       // Sende den SPARQL-Update Query an Fuseki
//       const response = await fetch('http://localhost:3030/test-next-app/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `update=${encodeURIComponent(updateQuery)}`,
//       }); 
//       console.log('Response Status:', response.status);

//     const result = await response.json();
//     console.log('API Response:', result);

//     if (response.ok && result.id) {
//       console.log(' Saved successfully');
//       window.location.href = `/DachboardPage?id=${result.id}`;
//       //reset();  
//     } else {
//       console.error('Failed to save data', result.message);
//     }
//   } catch (error) {
//     console.error('Error saving data:', error);
//   }
// };

//   const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
//     if (error && 'message' in error) {
//       return error.message as string;
//     }
//     return undefined;
//   };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-white">Schülerdaten Formular</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Vorname</label>
          <input
            type="text"
            {...register('firstName', { required: 'Vorname ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="firstName" 
          />
          {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Nachname</label>
          <input
            type="text"
            {...register('lastName', { required: 'Nachname ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="lastName"
          />
          {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Geburtsdatum</label>
          <input
            type="date"
            {...register('birthDate', { required: 'Geburtsdatum ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="birthDate"
          />
          {getErrorMessage(errors.birthDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.birthDate)}</span>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('eyewear')}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            onChange={handleChange}
            name="eyewear"
          /> 
          <label className="ml-2 text-sm font-medium text-gray-300">Sehhilfe</label>
        </div> 

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Speichern
        </button>

        {/* <button
          type="button"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          onClick={fetchFromFuseki}
        >
          Download
        </button> */}
      </form>
    </div>
  );
}

         {/* 

        <div>
          <label className="block text-sm font-medium text-gray-300">Telefonnummer</label>
          <input
            type="tel"
            {...register('phoneNumber', { required: 'Telefonnummer ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.phoneNumber) && <span className="text-red-500 text-sm">{getErrorMessage(errors.phoneNumber)}</span>}
        </div> */}

        {/* <div>
          <label className="block text-sm font-medium text-gray-300">Anschrift</label>
          <input
            type="text"
            {...register('address', { required: 'Anschrift ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.address) && <span className="text-red-500 text-sm">{getErrorMessage(errors.address)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Antrag gestellt am</label>
          <input
            type="date"
            {...register('applicationDate', { required: 'Antrag gestellt am ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.applicationDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.applicationDate)}</span>}
        </div> */}

//...................................................................................................
//für ID von URL extrahieren 
//.................................................................................................

// 'use client'
// import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
// import { DataFactory, Writer } from 'n3';
// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid'; // Falls du UUID verwenden möchtest
// import { useRouter } from 'next/navigation'; // useRouter für Navigation

// export default function HalloPage() {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const [rdfData, setRdfData] = useState('');
//   const router = useRouter(); // Für die Navigation
//   const [formData, setFormData] = useState({}); 
//   // Funktion zum Senden der Daten an den Fuseki-Server
//   const sendToFuseki = async (rdfData: any) => {
//     const updateQuery = `
//       PREFIX ex: <https://github.com/seen22/fahrlere-nextapp/>
//       PREFIX schema: <http://schema.org/>
//       PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      
//       INSERT DATA {
//         ${rdfData}
//       }
//     `;
//     try {
//       const response = await fetch('http://localhost:3030/test_next/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/sparql-update',
//         },
//         body: updateQuery,
//       });
  
//       const responseText = await response.text();
//       if (response.ok) {
//         console.log('Daten erfolgreich an Fuseki gesendet');
//       } else {
//         console.error('Fehler beim Senden der Daten an Fuseki', responseText);
//       }
//     } catch (error) {
//       console.error('Fehler:', error);
//     }
//   };

//   // Funktion zur Generierung einer eindeutigen Schüler-ID und zum Speichern
//   const onSubmit = async (formData: any) => {
//     const { namedNode, literal } = DataFactory;
//     const writer = new Writer();

//     // Eindeutige ID für den Schüler erzeugen (z.B. mit uuidv4 oder Date.now)
//     const studentID = uuidv4(); // Falls du UUID verwenden möchtest: uuidv4()
//     console.log('Generated Student ID:', studentID);

//     // Subject mit dieser eindeutigen ID
//     const subject = namedNode(`https://github.com/seen22/fahrlere-nextapp/student-${studentID}`);

//     // Aktuelles Datum (Timestamp)
//     const currentTimestamp = new Date().toISOString();

//     // Füge Timestamp zu RDF hinzu
//     const timestampPredicate = namedNode('https://github.com/seen22/fahrlere-nextapp/timestamp');
//     const timestampObject = literal(currentTimestamp, namedNode('http://www.w3.org/2001/XMLSchema#dateTime'));
//     writer.addQuad(subject, timestampPredicate, timestampObject);

//     // Map Form Data to RDF triples
//     Object.entries(formData).forEach(([key, value]) => {
//       let predicate;
//       let object;

//       if (key === 'birthDate') {
//         predicate = namedNode('https://github.com/seen22/fahrlere-nextapp/birthDate');
//         object = literal(value as string | number, namedNode('http://www.w3.org/2001/XMLSchema#date'));
//       } else if (key === 'eyewear') {
//         predicate = namedNode('http://schema.org/eyewear');
//         object = literal(value as string | number);
//       } else {
//         predicate = namedNode(`https://github.com/seen22/fahrlere-nextapp/${key}`);
//         object = literal(value as string | number);
//       }
//       writer.addQuad(subject, predicate, object);
//     });

//     // Serialize and send to Fuseki
//     writer.end((error: any, result: any) => {
//       if (error) {
//         console.error('Failed to serialize RDF data', error);
//       } else {
//         console.log('RDF-Triple:\n', result);
//         setRdfData(result);
//         sendToFuseki(result); // Send the serialized data to Fuseki

//         // Weiterleitung zur "users"-Seite mit der generierten studentID in der URL
//         router.push(`/users?id=${studentID}`);
//       }
//     });
//   };

//   const handleChange = (event: { target: { name: string; value: string; }; }) => {
//     setFormData({
//       ...formData, // Use the existing formData state
//       [event.target.name]: event.target.value, // Update the specific field
//     });
//   };
  
  
//     const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
//     if (error && 'message' in error) {
//       return error.message as string;
//     }
//     return undefined;
//   };

//   const fetchFromFuseki= async() => {
//     throw new Error('Function not implemented.');
//   }

//     return (
//     <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
//       <h1 className="text-4xl font-bold mb-6 text-white">Schülerdaten Formular</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-300">Vorname</label>
//           <input
//             type="text"
//             {...register('firstName', { required: 'Vorname ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//             onChange={handleChange}
//             name="firstName" 
//           />
//           {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Nachname</label>
//           <input
//             type="text"
//             {...register('lastName', { required: 'Nachname ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//             onChange={handleChange}
//             name="lastName"
//           />
//           {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Geburtsdatum</label>
//           <input
//             type="date"
//             {...register('birthDate', { required: 'Geburtsdatum ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//             onChange={handleChange}
//             name="birthDate"
//           />
//           {getErrorMessage(errors.birthDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.birthDate)}</span>}
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             {...register('eyewear')}
//             className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
//             onChange={handleChange}
//             name="eyewear"
//           /> 
//           <label className="ml-2 text-sm font-medium text-gray-300">Sehhilfe</label>
//         </div> 

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Speichern
//         </button>

//         <button
//           type="button"
//           className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//           onClick={fetchFromFuseki}
//         >
//           Download
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client'
// import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

// export default function schuelerDatenPage() {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();

//   const onSubmit = async (studentData: any) => {
//     try{  
//     // Send data to the API
//     const response = await fetch('/api/saveStudentData', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(studentData),
//     });   
//     const result = await response.json();
//     console.log('API Response:', result);

//     if (response.ok && result.id) {
//       console.log(' Saved successfully');
//       window.location.href = `/DashboardPage?id=${result.id}`;
//       //reset();  
//     } else {
//       console.error('Failed to save data', result.message);
//     }
//   } catch (error) {
//     console.error('Error saving data:', error);
//   }
// };

//   const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
//     if (error && 'message' in error) {
//       return error.message as string;
//     }
//     return undefined;
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
//       <h1 className="text-4xl font-bold mb-6 text-white">Schülerdaten Formular</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-300">Vorname</label>
//           <input
//             type="text"
//             {...register('firstName', { required: 'Vorname ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
//         </div>

//          <div>
//           <label className="block text-sm font-medium text-gray-300">Nachname</label>
//           <input
//             type="text"
//             {...register('lastName', { required: 'Nachname ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Geburtsdatum</label>
//           <input
//             type="date"
//             {...register('birthDate', { required: 'Geburtsdatum ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.birthDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.birthDate)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Telefonnummer</label>
//           <input
//             type="tel"
//             {...register('phoneNumber', { required: 'Telefonnummer ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.phoneNumber) && <span className="text-red-500 text-sm">{getErrorMessage(errors.phoneNumber)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Anschrift</label>
//           <input
//             type="text"
//             {...register('address', { required: 'Anschrift ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.address) && <span className="text-red-500 text-sm">{getErrorMessage(errors.address)}</span>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300">Antrag gestellt am</label>
//           <input
//             type="date"
//             {...register('applicationDate', { required: 'Antrag gestellt am ist erforderlich' })}
//             className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
//           />
//           {getErrorMessage(errors.applicationDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.applicationDate)}</span>}
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             {...register('sehhilfe')}
//             className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
//           /> 
//           <label className="ml-2 text-sm font-medium text-gray-300">Sehhilfe</label>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Speichern
//         </button>
//       </form>
//     </div>
//   );
// }
