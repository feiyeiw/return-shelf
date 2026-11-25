export const serviceRequestUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfLIhomp29Wapl2lzzDH2U2fNcLP8ehGs27CCXYXnrJupRoMA/viewform';

export const services = {
  tracking: {
    slug: 'order-tracking-setup',
    title: 'Set up a Track Your Order page for Shopify',
    summary: 'Try a page with your logo and a test shipping email, or have us connect a live tracking page to your store menu and shipping email.',
    plans: [
      {
        title: '30-day branded preview',
        price: 6,
        priceContext: 'for 30 days',
        shortLabel: 'preview for 30 days',
        billing: 'One payment. Buy again for another 30 days. No automatic renewal.',
        deliverables: [
          'A separate preview page with your logo and a tracking link in an email sent to your test inbox. Your live store menu and outgoing emails stay as they are.',
          '30 days to try the preview and get help, starting the day we send your preview link.',
        ],
        checkoutUrl: 'https://payhip.com/buy?link=rNQhc',
      },
      {
        title: 'Live Shopify installation',
        price: 29,
        priceContext: 'one time',
        shortLabel: 'one-time live setup',
        billing: 'One payment. No automatic renewal.',
        deliverables: [
          'A live tracking page with your logo, linked from your store menu and one compatible shipping email.',
          'A mobile test of both links with a test order, followed by the live URL and a written list of changes.',
        ],
        checkoutUrl: 'https://payhip.com/buy?link=4RZrl',
      },
    ],
    scope: 'Live setup covers one Shopify store and one compatible tracking app.',
    customerExperience: 'The store menu opens the general lookup. When your app and email template support direct links, the shipping email button opens the order or shipment’s tracking result. Some setups ask shoppers to verify their order details first. We confirm whether your email will use a direct link or the general lookup before setup.',
    workflow: [
      'We review your checkout details and email you to confirm which tracking app, email link, and test order we can use.',
      'For the live setup, approve the changes and grant Shopify collaborator access, or join a screen share to apply them with us.',
    ],
  },
  invoices: {
    slug: 'packing-slip-setup',
    title: 'Custom Shopify packing slip',
    summary: 'We set up the piece of paper that goes in each box, with your logo and a list of what’s in that shipment. Your team prints it straight from Shopify Orders.',
    price: 19,
    checkoutUrl: 'https://payhip.com/buy?link=AuJxK',
    scope: 'One Shopify store, one template, one paper size.',
  },
};
