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

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US',
    {
      year: options?.year ?? '2-digit',
      month: options?.month ?? 'short',
      day: options?.day ?? '2-digit',
      ...options,
    }
  ).format(date);
}