import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/medb-logo.svg';   
const FormWrapper = ({ formTitle, formDescription, formFields, formSubmitButtonText, formLink, formButton, onSubmit }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <main className="flex-grow px-5 md:px-20 md:py-20 flex justify-center">
        <section className="flex flex-col md:flex-row justify-between items-center px-5 md:px-16 py-12 bg-white rounded-[30px] mx-auto min-w-full">
          <div className="flex-1 flex justify-center mb-4 md:mb-0">
            <img
              loading="lazy"
              src={logo}
              alt="Master Control Panel Logo"
              className="object-contain max-w-full aspect-[0.63] w-[131px]"
            />
          </div>
          <div className="flex-1">
            <form onSubmit={onSubmit} className="flex flex-col w-full max-w-md mx-auto">
              <h2 className="text-2xl md:text-3xl leading-10 text-zinc-800 text-left mb-6">
                {formTitle}
              </h2>
              <p className="text-md mb-6">{formDescription}</p>
              {formFields}
              <div className="flex justify-center md:justify-end mt-5 space-x-4">
                <div className="py-2 text-red-600 cursor-pointer hover:transform hover:scale-105">
                  <Link to={formLink}>{formButton}</Link>
                </div>
                <button
                  type="submit"
                  className="px-10 py-2 text-white rounded-3xl bg-neutral-800"
                >
                  {formSubmitButtonText}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FormWrapper;
