const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`${className} bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center`}>
      <span className="text-white font-bold text-lg">N</span>
    </div>
  )
}

export default Logo