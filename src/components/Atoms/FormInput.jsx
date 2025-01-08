import React from 'react';

const FormInput = ({ id, type, placeholder, onChange }) => {
  return (
    <div className="flex flex-col gap-5 mt-3">
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input
        id={id}
        type={type}
        className="px-4 py-3.5 w-full bg-white border border-neutral-400 rounded-xl"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
