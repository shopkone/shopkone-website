import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const General = lazy(async () => await import('./general'))
const Staff = lazy(async () => await import('./staff/staff'))
const StaffChange = lazy(async () => await import('./staff/change'))
const Domains = lazy(async () => await import('./domains'))
const Taxes = lazy(async () => await import('./taxes/taxes'))
const Locations = lazy(async () => await import('./locations/locations'))
const LocationsChange = lazy(async () => await import('./locations/change'))
const Shipping = lazy(async () => await import('./shipping'))
const ShippingCourierService = lazy(async () => await import('./shipping/courier-service'))
const ShippingCourierServiceChange = lazy(async () => await import('./shipping/courier-service/change'))
const ShippingLocalDelivery = lazy(async () => await import('./shipping/local-delivery'))
const ShippingPickupInStore = lazy(async () => await import('./shipping/pickup-in-store'))

export const SettingsRoutes: RouteObject[] = [
  { element: <General />, path: '/settings/general' },
  { element: <Staff />, path: '/settings/staff' },
  { element: <StaffChange />, path: '/settings/staff/change' },
  { element: <Domains />, path: '/settings/domains' },
  { element: <Taxes />, path: '/settings/taxes' },
  { element: <Locations />, path: '/settings/locations' },
  { element: <LocationsChange />, path: '/settings/locations/change' },
  {
    element: <Shipping />,
    path: '/settings/shipping',
    children: [
      { element: <ShippingCourierService />, index: true },
      { element: <ShippingLocalDelivery />, path: '/settings/shipping/local-delivery' },
      { element: <ShippingPickupInStore />, path: '/settings/shipping/pickup-in-store' }
    ]
  },
  { element: <ShippingCourierServiceChange />, path: '/settings/shipping/courier-service/change' }
]
