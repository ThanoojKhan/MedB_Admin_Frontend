import React from 'react';

function FormField({ label, type, name, value, onChange, onBlur, error }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-600">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`px-4 py-2 mt-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
}

export default FormField;
