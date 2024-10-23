
'use client';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import BackButton from '../BackButton/page';
import { DataFactory, Writer } from 'n3';

const Uebungsfahrt = () => {
  const { register, handleSubmit } = useForm();
  const [studentId, setStudentId] = useState<string | null>(null);

  //Retrieve the student ID from the URL when the page loads
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
      const { namedNode, literal } = DataFactory;
      const writer = new Writer();
      const studentURI = `https://github.com/seen22/fahrlehre-nextapp/formEntry-${studentId}`;
      const lessonURI= `https://github.com/seen22/fahrlehre-nextapp/lesson-${studentId}`;
      const subject = namedNode(lessonURI);

      // Map checkbox data to RDF triples with xsd:boolean
      Object.entries(checkboxData).forEach(([key, value]) => {
        const predicate = namedNode(`fahrl:${key}`);
        const object = literal(value as 'true', namedNode('http://www.w3.org/2001/XMLSchema#boolean'));
        writer.addQuad(subject, predicate, object);
      });

      writer.addQuad(namedNode(studentURI), namedNode('fahrl:hasDrivingLesson'),namedNode (lessonURI));

      // Serialisieren und Daten an Fuseki senden
      writer.end(async (error, result) => {
        if (error) {
          console.error('Error while serializing RDF:', error);
          return;
        }

        const updateQuery = `
          PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          INSERT DATA {
            ${result}
          }
        `;

        const response = await fetch('http://localhost:3030/FahrlehrerApp/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/sparql-update',
          },
          body: updateQuery,
        });

        if (response.ok) {
          console.log('Checkbox data saved successfully');
          window.location.href = `/DashboardPage?id=${studentId}`;
        } else {
          const resultText = await response.text();
          console.error('Failed to save checkbox data:', resultText);
        }
      });
    } catch (error) {
      console.error('Error saving checkbox data:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="font-bold text-xl mb-2">Aufbaustufe</h3>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Bremsübungen</label>
            <input type="checkbox" {...register('brakingExercises')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Schaltübungen</label>
            <input type="checkbox" {...register('gearShiftingExercises')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Geschwindigkeitanpassung</label>
            <input type="checkbox" {...register('speedAdjustment')} className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">Leistungsstufe</h3>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fahrbahnbenutzung</label>
            <input type="checkbox" {...register('roadUsage')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fahrstreifenwechsel</label>
            <input type="checkbox" {...register('laneChange')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Abbiegen</label>
            <input type="checkbox" {...register('turning')} className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">Vorfahrt</h3>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Rechts vor Links</label>
            <input type="checkbox" {...register('rightBeforeLeft')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Vorfahrtregelnde Verkehrszeichen</label>
            <input type="checkbox" {...register('priorityRoadSigns')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Fußgängerüberwege</label>
            <input type="checkbox" {...register('pedestrianCrossings')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Kreisverkehr</label>
            <input type="checkbox" {...register('roundabout')} className="h-5 w-5" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-2">Grundfahraufgaben</h3>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Rückwärtsfahren</label>
            <input type="checkbox" {...register('reversing')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Umkehren</label>
            <input type="checkbox" {...register('uturn')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Gefahrbremsung</label>
            <input type="checkbox" {...register('emergencyBraking')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Einparken längs</label>
            <input type="checkbox" {...register('parallelParking')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Einparken quer</label>
            <input type="checkbox" {...register('perpendicularParking')} className="h-5 w-5" />
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






