'use client';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import BackButton from '../BackButton/page';
import { DataFactory, Writer } from 'n3';

const Sonderfahrt = () => {
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
      const { namedNode, literal } = DataFactory;
      const writer = new Writer();
      const studentURI = `https://github.com/seen22/fahrlehre-nextapp/formEntry-${studentId}`;
      const lessonURI = `https://github.com/seen22/fahrlehre-nextapp/lesson-${studentId}`;


      Object.entries(checkboxData).forEach(([key, value]) => {
        const predicate = namedNode(`fahrl:${key}`);
        const object = literal(value as 'true', namedNode('http://www.w3.org/2001/XMLSchema#boolean'));
        writer.addQuad(namedNode(lessonURI), predicate, object);
      });


      writer.addQuad(
        namedNode(studentURI),
        namedNode('fahrl:hasDrivingLesson'),
        namedNode(lessonURI)
      );

      // Serialisiere und sende die Daten an Fuseki
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
          console.log('Sonderfahrt-Daten erfolgreich gespeichert.');
          window.location.href = `/DashboardPage?id=${studentId}`;
        } else {
          const resultText = await response.text();
          console.error('Fehler beim Speichern der Sonderfahrt-Daten:', resultText);
        }
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Sonderfahrt-Daten:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="font-bold text-xl mb-2">Sonderfahrt</h3>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Überlandsfahrt</label>
            <input type="checkbox" {...register('countryRoadDrive')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Autobahn</label>
            <input type="checkbox" {...register('highwayDrive')} className="h-5 w-5" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Nachtsfahrt</label>
            <input type="checkbox" {...register('nightDrive')} className="h-5 w-5" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default Sonderfahrt;




