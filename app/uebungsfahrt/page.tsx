'use client';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import BackButton from '../BackButton/page';

const Uebungsfahrt = () => {
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
        const predicate = `fahrl:${key}`;
        const object = value ? `"true"` : `"false"`;
        return `<https://github.com/seen22/fahrlehre-nextapp/formEntry-${studentId}> <${predicate}> ${object} .`;
      }).join('\n');

      const updateQuery = `
       PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>
          PREFIX schema: <http://schema.org/>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
          <h3 className="font-bold text-xl mb-2">Aufbaustufe</h3> 
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Bremsübungen</label> 
            <input type="checkbox" {...register('BrakingExercises')} className="h-5 w-5" /> 
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Schaltübungen</label> 
            <input type="checkbox" {...register('GearShiftingExercises')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Geschwindigkeitanpassung</label> 
            <input type="checkbox" {...register('SpeedAdjustment')} className="h-5 w-5" />
          </div>
        </div>
  
        <div>
          <h3 className="font-bold text-xl mb-2">Leistungsstufe</h3> 
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fahrbahnbenutzung</label> 
            <input type="checkbox" {...register('RoadUsage')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fahrstreifenwechsel</label> 
            <input type="checkbox" {...register('LaneChange')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Abbiegen</label> 
            <input type="checkbox" {...register('Turning')} className="h-5 w-5" />
          </div>
        </div>
  
        <div>
          <h3 className="font-bold text-xl mb-2">Vorfahrt</h3> 
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Rechts vor Links</label> 
            <input type="checkbox" {...register('RightBeforeLeft')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Vorfahrtregelnde Verkehrszeichen</label> 
            <input type="checkbox" {...register('PriorityRoadSigns')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fußgängerüberwege</label> 
            <input type="checkbox" {...register('PedestrianCrossings')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Kreisverkehr</label>
            <input type="checkbox" {...register('Roundabout')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Bahnübergang</label> 
            <input type="checkbox" {...register('RailwayCrossing')} className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">Grundfahraufgaben</h3> 
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Rückwärtsfahren</label> 
            <input type="checkbox" {...register('Reversing')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Umkehren</label> 
            <input type="checkbox" {...register('Uturn')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Gefahrbremsung</label> 
            <input type="checkbox" {...register('EmergencyBraking.')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Einparken längs</label>
            <input type="checkbox" {...register('ParallelParking')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Einparken quer</label> 
            <input type="checkbox" {...register('PerpendicularParking')} className="h-5 w-5" />
          </div>
        </div>
  
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
          Speichern
        </button>
      </form>
    </div>
  );  
};

export default Uebungsfahrt;


