'use client'
import { useForm, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

export default function schuelerDatenPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (studentData: any) => {
    try{  
    // Send data to the API
    const response = await fetch('/api/saveStudentData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });   
    const result = await response.json();
    console.log('API Response:', result);

    if (response.ok && result.id) {
      console.log(' Saved successfully');
      window.location.href = `/DashboardPage?id=${result.id}`;
      //reset();  
    } else {
      console.error('Failed to save data', result.message);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

  const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string | undefined => {
    if (error && 'message' in error) {
      return error.message as string;
    }
    return undefined;
  };

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
          />
          {getErrorMessage(errors.firstName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.firstName)}</span>}
        </div>

         <div>
          <label className="block text-sm font-medium text-gray-300">Nachname</label>
          <input
            type="text"
            {...register('lastName', { required: 'Nachname ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.lastName) && <span className="text-red-500 text-sm">{getErrorMessage(errors.lastName)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Geburtsdatum</label>
          <input
            type="date"
            {...register('birthDate', { required: 'Geburtsdatum ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.birthDate) && <span className="text-red-500 text-sm">{getErrorMessage(errors.birthDate)}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Telefonnummer</label>
          <input
            type="tel"
            {...register('phoneNumber', { required: 'Telefonnummer ist erforderlich' })}
            className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-md"
          />
          {getErrorMessage(errors.phoneNumber) && <span className="text-red-500 text-sm">{getErrorMessage(errors.phoneNumber)}</span>}
        </div>

        <div>
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
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('sehhilfe')}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
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
