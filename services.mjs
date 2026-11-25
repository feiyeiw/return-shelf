export const serviceRequestUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfLIhomp29Wapl2lzzDH2U2fNcLP8ehGs27CCXYXnrJupRoMA/viewform';

export const services = {
  tracking: {
    slug: 'order-tracking-setup',
    title: 'Add a Track Your Order page to Shopify',
    pilotPrice: 29,
    summary: 'We put a tracking page with your logo on your store, link it from your menu and one shipping email, and show you that both links work on a phone.',
    deliverables: [
      'A live Track Your Order page with your logo.',
      'A store menu link and a link in one compatible shipping notification email.',
      'The live page URL, a list of changes, and screenshots showing both links opening the page on mobile and the result of one test lookup.',
    ],
    scope: 'The pilot covers one Shopify store and one compatible tracking app.',
    workflow: [
      'Send your store URL and tell us which carrier or fulfillment service you use.',
      'Approve the setup and grant Shopify collaborator access, or join a screen share to make the changes with us.',
      'Provide an order for testing. Open the page from the store menu and a test shipping email, and check that it shows the expected shipment status.',
    ],
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
