export default function ZoomDocumentation() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <object
        data="/Follow Funnel documentation.pdf"
        type="application/pdf"
        className="w-full h-full border-0"
        aria-label="Zoom Documentation"
      >
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Unable to display PDF.
            </p>
            <a 
              href="/Follow Funnel documentation.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Click here to download
            </a>
          </div>
        </div>
      </object>
    </div>
  );
}

