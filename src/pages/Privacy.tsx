export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <object
            data="/privacy.pdf"
            type="application/pdf"
            className="w-full h-screen min-h-[800px] border-0"
            aria-label="Privacy Policy"
          >
            <p className="text-center text-gray-600 py-8">
              Unable to display PDF. 
              <a href="/privacy.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                Click here to download
              </a>
            </p>
          </object>
        </div>
      </div>
    </div>
  );
}

