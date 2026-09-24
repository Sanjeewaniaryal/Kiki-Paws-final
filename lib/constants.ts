export const SERVICES = ['sitting', 'walking', 'boarding', 'dropin', 'grooming'] as const
export type Service = (typeof SERVICES)[number]

const SERVICE_LABELS: Record<Service, string> = {
  sitting: 'Pet Sitting',
  walking: 'Dog Walking',
  boarding: 'Overnight Boarding',
  dropin: 'Drop-In Visits',
  grooming: 'Grooming',
}

export function serviceLabel(service: string) {
  return SERVICE_LABELS[service as Service] ?? service
}

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

export const BOOKING_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-800' },
  active: { label: 'Active', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
}
