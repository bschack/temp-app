export const formatCurrency = (value?: number) => {
  if (!value) return '';
  return new Intl.NumberFormat('en-US',
    {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      // maximumSignificantDigits: 5,
      useGrouping: true,
    }
  ).format(value);
}

export const formatPercent = (value?: number) => {
  if (!value) return '';
  return new Intl.NumberFormat('en-US',
    {
      style: 'percent',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }
  ).format(value);
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US',
    {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
    }
  ).format(date);
}