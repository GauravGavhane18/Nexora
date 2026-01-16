// Indian Rupee Currency Formatter
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format without symbol
export const formatPrice = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0
  }
  
  return `₹${amount.toLocaleString('en-IN')}`
}

export default formatCurrency
