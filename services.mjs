export const serviceRequestUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfLIhomp29Wapl2lzzDH2U2fNcLP8ehGs27CCXYXnrJupRoMA/viewform';

export const services = {
  tracking: {
    slug: 'order-tracking-setup',
    title: 'Shopify order tracking setup',
    summary: 'We set up a branded tracking page for your store and connect it to your menu and shipping emails.',
    deliverables: [
      'Review your carriers and confirm the tracking app that fits your store.',
      'Set up the branded page, the storefront menu link, and supported shipping email links.',
      'Test a pending shipment, a split order, and a delivery exception with examples available in your setup.',
    ],
    scope: 'One Shopify store. We confirm app compatibility and the scope before quoting. You pay any app subscription directly.',
  },
  invoices: {
    slug: 'packing-slip-setup',
    title: 'Shopify packing slip template setup',
    summary: 'We customize your Shopify packing slip and check how it prints for single orders and packing batches.',
    deliverables: [
      'Customize one default Shopify packing slip with your logo, order reference, SKUs, and quantities.',
      'Verify that a split shipment shows the items and quantities packed in that shipment.',
      'Provide a PDF proof and show your team how to print slips individually or in bulk.',
    ],
    scope: 'One default packing slip in one Shopify store. We confirm the fields, paper size, and print workflow before quoting.',
  },
};
