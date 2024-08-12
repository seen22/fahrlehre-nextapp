import React from 'react';

const UsersPage = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <form className="space-y-6">
        {/* Section 1 */}
        <div>
          <h3 className="font-bold text-lg mb-2">Rollen und Schalten</h3>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Abbremsen und Schalten</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Bremsübungen</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="font-bold text-lg mb-2">Bremsübungen</h3>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">degressiv</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Gefahrsituationen</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Zielbremsung</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="font-bold text-lg mb-2">Gefälle und Steigung</h3>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Gefälle</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Steigung</label>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="ml-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Anhalten</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Anfahren</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Rückwärts</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Sichern</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Schalten</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </div>

    
      </form>
    </div>
  );
};

export default UsersPage;
