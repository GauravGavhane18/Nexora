const StyleTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Style Test Page</h1>
        
        {/* Test Basic Styling */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Styling Test</h2>
          <p className="text-gray-600 mb-4">This is a test to verify Tailwind CSS is working properly.</p>
          
          <div className="flex space-x-4 mb-4">
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Blue Card</h3>
              <p className="text-blue-600">This should be blue themed</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Green Card</h3>
              <p className="text-green-600">This should be green themed</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Purple Card</h3>
              <p className="text-purple-600">This should be purple themed</p>
            </div>
          </div>
        </div>

        {/* Test Form Elements */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Form Elements Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Input Field</label>
              <input type="text" className="form-input" placeholder="Test input field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Field</label>
              <select className="form-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <label className="text-sm text-gray-700">Checkbox test</label>
            </div>
          </div>
        </div>

        {/* Test Primary Colors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Primary Color Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-primary-100 p-3 rounded text-center">
              <div className="text-xs">primary-100</div>
            </div>
            <div className="bg-primary-300 p-3 rounded text-center">
              <div className="text-xs">primary-300</div>
            </div>
            <div className="bg-primary-500 p-3 rounded text-center text-white">
              <div className="text-xs">primary-500</div>
            </div>
            <div className="bg-primary-700 p-3 rounded text-center text-white">
              <div className="text-xs">primary-700</div>
            </div>
            <div className="bg-primary-900 p-3 rounded text-center text-white">
              <div className="text-xs">primary-900</div>
            </div>
          </div>
        </div>

        {/* API Connection Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Connection Test</h2>
          <div className="space-y-2">
            <p><strong>Frontend URL:</strong> {window.location.origin}</p>
            <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL}</p>
            <p><strong>Socket URL:</strong> {import.meta.env.VITE_SOCKET_URL}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleTest