import React from 'react';

interface props {
  pageTitle: string;
  breadcrumbs: string[];
  actions?: JSX.Element;
  children: JSX.Element;
}

export default function Layout({
  pageTitle,
  breadcrumbs,
  actions,
  children,
}: props) {
  return (
    <>
      <div className="bg-red-800 pt-8 pb-16 relative z-10">
        <div className="container px-6 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex-col flex sm:flex-row items-start sm:items-center">
            <div className="ml-0 my-6 lg:my-0">
              <h4 className="text-2xl font-bold leading-tight text-white mb-2">
                {pageTitle}
              </h4>
              <div className="flex items-center text-gray-300 text-xs">
                <span>Home</span>
                {breadcrumbs.map((breadcrumb) => (
                  <div key={breadcrumb}>
                    <span className="mx-2">&gt;</span>
                    <span>{breadcrumb}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            {/* <button className="focus:outline-none transition duration-150 ease-in-out hover:bg-green-700 border bg-green-600 rounded text-white px-8 py-2 text-sm">
              Add New
                </button>*/}
            {actions}
          </div>
        </div>
      </div>
      {/* Page title ends */}
      <div className="container px-6 mx-auto">
        {/* Remove class [ h-64 ] when adding a card block */}
        <div className="rounded shadow-lg relative bg-white z-10 -mt-8 mb-8 w-full p-5">
          {children}
        </div>
      </div>
    </>
  );
}
