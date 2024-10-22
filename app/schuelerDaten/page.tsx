
'use client'
import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import { DataFactory, Writer } from 'n3';
import { SetStateAction, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import BackButton from '../BackButton/page';


export default function HalloPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [formData, setFormData] = useState({});
  const [rdfData, setRdfData] = useState('');
  const router = useRouter(); 

    // Funktion zum Senden der Daten an den Fuseki-Server
    const sendToFuseki = async (rdfData : any) => {
      const updateQuery = `
         PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>
          PREFIX schema: <http://schema.org/>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
                
        INSERT DATA {
          ${rdfData}
        }
      `;
      console.log("SPARQL Update Query:", updateQuery);
      console.log("result", rdfData);

    
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
    
      // Create a unique studentURI using timestamp or another identifier
      const uniqueID = uuidv4();
      const uniquestudentURI = `https://github.com/seen22/fahrlehre-nextapp/formEntry-${uniqueID}`;
      const studentURI = namedNode(uniquestudentURI);
    
      // Get the current timestamp in local time
      const currentTimestamp = new Date().toLocaleString("sv-SE", { timeZone: 'Europe/Berlin' }).replace(' ', 'T') + 'Z';
    
      // Add the timestamp
      const timestampPredicate = namedNode('fahrl:timestamp');
      const timestampObject = literal(currentTimestamp);
      writer.addQuad(studentURI, timestampPredicate, timestampObject);
        
    
      // Map form data to RDF triples
      Object.entries(formData).forEach(([key, value]) => {
        let predicate, object;
        if (key === 'hasDateOfBirth') {
           predicate = namedNode(`fahrl:${key}`);
           object = literal(value as string | number, namedNode('http://www.w3.org/2001/XMLSchema#date'));
          writer.addQuad(studentURI, predicate, object);
        } else if (key === 'hasEyewear') {
           predicate = namedNode(`fahrl:${key}`);
           object =  literal(value as 'true', namedNode('http://www.w3.org/2001/XMLSchema#boolean'));
          writer.addQuad(studentURI, predicate, object);
        } else {
          predicate = namedNode(`fahrl:${key}`);
          object = literal(value as string);
          writer.addQuad(studentURI, predicate, object);
        } 
        
      });
    
      // Serialize and send to Fuseki
      writer.end((error: any, result: any) => {
        if (error) {
          console.error('Failed to serialize RDF data', error);
        } else {
          console.log("RDF-Triple:\n", result);
          setRdfData(result);
          sendToFuseki(result); 

          router.push(`/DashboardPage?id=${uniqueID}`);
        }
      });
    };
    
    const handleChange = (event: { target: { name: any; value: any; type: string; checked: boolean; }; }) => {
      let { name, value, type, checked } = event.target;
  
      if (type === 'checkbox') {
        value = checked ? 'true' : 'false';
      }
  
      setFormData({
        ...formData,
        [name]: value,
      });
    };
   const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
    if (error && 'message' in error) {
      return error.message as string;
      
    }
    return undefined;
    
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg">
     <BackButton></BackButton>
      <h1 className="text-4xl font-bold mb-6 text-white">Schülerdaten Formular</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Vorname</label>
          <input
            type="text"
            {...register('hasFirstName', { required: 'Vorname ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="hasFirstName" 
          />
          {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Nachname</label>
          <input
            type="text"
            {...register('hasLastName', { required: 'Nachname ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="hasLastName"
          />
          {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Geburtsdatum</label>
          <input
            type="date"
            {...register('hasDateOfBirth', { required: 'Geburtsdatum ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
            onChange={handleChange}
            name="hasDateOfBirth"
          />
          {getErrorMessage(errors.birthDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.birthDate)}</span>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('hasEyewear')}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            onChange={handleChange}
            name="hasEyewear"
          /> 
          <label className="ml-2 text-sm font-medium text-gray-300">Sehhilfe</label>
        </div> 

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Speichern
        </button>
      </form>
    </div>
  );
}

        
