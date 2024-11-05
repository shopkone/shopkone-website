import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const General = lazy(async () => await import('./general'))
const Staff = lazy(async () => await import('./staff/staff'))
const StaffChange = lazy(async () => await import('./staff/change'))
const Domains = lazy(async () => await import('./domains'))
const Taxes = lazy(async () => await import('./taxes/taxes'))
const TaxInfo = lazy(async () => await import('./taxes/taxes/info'))
const Locations = lazy(async () => await import('./locations/locations'))
const LocationsChange = lazy(async () => await import('./locations/change'))
const Shipping = lazy(async () => await import('./shipping'))
const ShippingCourierService = lazy(async () => await import('./shipping/courier-service'))
const ShippingCourierServiceChange = lazy(async () => await import('./shipping/courier-service/change/index'))
const ShippingLocalDelivery = lazy(async () => await import('./shipping/local-delivery'))
const ShippingLocalDeliveryChange = lazy(async () => await import('./shipping/local-delivery/local-change'))
const ShippingPickupInStore = lazy(async () => await import('./shipping/pickup-in-store'))
const ShippingPickupInStoreChange = lazy(async () => await import('./shipping/pickup-in-store/change'))
const Files = lazy(async () => await import('./files'))
const Markets = lazy(async () => await import('./markets'))
const MarketChange = lazy(async () => await import('./markets/change'))

export const SettingsRoutes: RouteObject[] = [
  { element: <General />, path: '/settings/general' },
  { element: <Staff />, path: '/settings/staff' },
  { element: <StaffChange />, path: '/settings/staff/change' },
  { element: <Domains />, path: '/settings/domains' },

  { element: <Taxes />, path: '/settings/taxes' },
  { element: <TaxInfo />, path: '/settings/taxes/info/:id' },

  { element: <Locations />, path: '/settings/locations' },
  { element: <LocationsChange />, path: '/settings/locations/change/:id' },
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
  { element: <ShippingCourierServiceChange />, path: '/settings/shipping/courier-service/change' },
  { element: <ShippingCourierServiceChange />, path: '/settings/shipping/courier-service/change/:id' },

  { element: <ShippingLocalDeliveryChange />, path: '/settings/shipping/local-delivery/change/:id' },

  { element: <ShippingPickupInStoreChange />, path: '/settings/shipping/pickup-in-store/change/:id' },

  { element: <Files />, path: '/settings/files/:groupId' },
  { element: <Files />, path: '/settings/files' },

  { element: <Markets />, path: '/settings/markets' },
  { element: <MarketChange />, path: '/settings/markets/change/:id' }
]
