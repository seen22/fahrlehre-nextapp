'use client';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import BackButton from '../BackButton/page';

const uebungsfahrt = () => {
  const { register, handleSubmit } = useForm();
  const [studentId, setStudentId] = useState<string | null>(null);

  // Retrieve the student ID from the URL when the page loads
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setStudentId(id);
      console.log('Extracted ID from URL:', id);
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
      // Construct the RDF data for the checkboxes
      const triples = Object.entries(checkboxData).map(([key, value]) => {
        const predicate = `https://github.com/seen22/fahrlere-nextapp/${key.replace(/\s+/g, '_')}`;
        const object = value ? `"true"` : `"false"`;
        return `<https://github.com/seen22/fahrlere-nextapp/formEntry-${studentId}> <${predicate}> ${object} .`;
      }).join('\n');

      const updateQuery = `
        PREFIX ex: <https://github.com/seen22/fahrlere-nextapp/>
        INSERT DATA {
          ${triples}
        }
      `;

      // Send the update query to Fuseki
      const response = await fetch('http://localhost:3030/FahrlehrerApp/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-update',
        },
        body: updateQuery,
      });

      const result = await response.text();
      if (response.ok) {
        console.log('Checkbox data saved successfully');
        
        console.log('student ID ', studentId);
        console.log('RDF', triples);
        console.log('RDF2', updateQuery);
        window.location.href = `/DashboardPage?id=${studentId}`;

      } else {
        console.error('Failed to save checkbox data:', result);
      }
    } catch (error) {
      console.error('Error saving checkbox data:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <BackButton/>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Rollen und Schalten</h3>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Abbremsen und Schalten</label>
            <input type="checkbox" {...register('Abbremsen_und_Schalten')} className="h-4 w-4" />
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


