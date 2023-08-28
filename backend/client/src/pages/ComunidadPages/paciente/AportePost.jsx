import React from 'react';

const AportePost = ({ aporte }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2 text-black">{aporte.titulo}</h2>
      {aporte.aporte && <p className="text-gray-600 mb-2">{aporte.aporte}</p>}
      {aporte.url && (
        <a href={aporte.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {aporte.url}
        </a>
      )}
      <p className="text-gray-400 text-sm mb-1 ">Author: {aporte.user.nombre}</p>
      <p className="text-gray-400 text-sm">Date: {new Date(aporte.date).toLocaleDateString()}</p>
    </div>
  );
};

export default AportePost;
