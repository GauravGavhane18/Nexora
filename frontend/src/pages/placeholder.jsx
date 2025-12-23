// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title = "Coming Soon" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </div>
  )
}

export default PlaceholderPage