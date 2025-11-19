export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <iframe
            src="/terms.pdf"
            className="w-full h-screen min-h-[800px] border-0"
            title="Terms of Service"
          />
        </div>
      </div>
    </div>
  );
}

