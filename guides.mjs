export const topicGuides = {
  returns: {
    title: 'Shopify Returns & Exchange Apps',
    description: 'Compare Shopify returns apps for self-service portals, product exchanges, store credit, and carrier labels. See what to test before switching.',
    summary: 'Choose by the part of the returns workflow you need to improve. A customer request form, a product exchange, and a carrier label call for different capabilities.',
    examples: [
      ['Run a branded return portal', 'returngo', 'Consider ReturnGO when you need one portal for returns and exchanges with rules for different outcomes. Try a request that qualifies and one your store would reject.'],
      ['Let shoppers swap a size', 'return-prime', 'Start with Return Prime if variant exchanges are the main task. Check separately whether your plan lets shoppers switch to a different product.'],
      ['Generate return labels', 'returnzap', 'Look at ReturnZap if your team spends time creating labels. Confirm your carrier account, the return origin countries, and when a label is issued.'],
    ],
    check: 'Run one refund, one size exchange, and one rejected request before switching. Record what the shopper sees, what staff must do, and when a label or credit is created.',
  },
  tracking: {
    title: 'Shopify Order Tracking Apps',
    description: 'Compare Shopify order tracking apps for branded lookup, multilingual tracking, delivery estimates, and shipment exception alerts.',
    summary: 'Begin with the missing piece in your tracking workflow: a customer-facing lookup page, carrier coverage across markets, or alerts for staff.',
    examples: [
      ['Give shoppers a branded lookup page', 'cwill-tracking', 'CWILL Order Tracking lists a branded page and shipment notifications. Open an order from a shipping email and check that the lookup works on a phone.'],
      ['Support customers in several languages', '17track', '17TRACK lists multilingual tracking on eligible plans. Check the language list, the carriers on your routes, and the shipment allowance.'],
      ['Monitor shipments that need attention', 'aftership-tracking', 'AfterShip lists tools for shipment exceptions. Review its Tracking plan separately from its Shipping and Returns modules.'],
    ],
    check: 'Compare the apps using your own carrier and destination mix. Check how each handles an order before the first scan, an order with two packages, and an exception your support team needs to see.',
  },
  preorders: {
    title: 'Shopify Preorder & Back-in-Stock Apps',
    description: 'Compare Shopify apps for taking preorders, collecting deposits, and sending back-in-stock alerts. See which tools fit each launch workflow.',
    summary: 'Decide whether you want to accept an order, take a partial payment, or collect interest until inventory is available. The same storefront button can lead to very different payment and fulfillment workflows.',
    examples: [
      ['Manage preorders and restock alerts together', 'stoq', 'STOQ lists both preorder payments and restock notifications. Check the monthly limits for the two features you expect to use.'],
      ['Collect a deposit for made-to-order items', 'downpay', 'Downpay focuses on taking a deposit and collecting the balance later. Confirm how your team triggers the balance and handles a failed payment.'],
      ['Measure demand before taking orders', 'notify-me', 'Notify Me! supports a restock waitlist for shoppers who want an alert. Try the signup and the first notification on a variant that comes back in stock.'],
    ],
    check: 'Test one preorder from product page to confirmation. Check the payment and estimated fulfillment terms shown to the shopper, then test a cart containing both a preorder and an in-stock item.',
  },
  invoices: {
    title: 'Shopify Invoice & Packing Slip Apps',
    description: 'Compare Shopify apps for PDF invoices, bulk printing, credit notes, payment reminders, and e-invoicing. Match the app to the documents you actually use.',
    summary: 'Start with the documents your team creates repeatedly. A warehouse printing slips has a different job from a team that sends invoices or credit notes automatically.',
    examples: [
      ['Print documents for many orders', 'order-printer-pro', 'Order Printer Pro lists bulk printing for invoices and packing slips. Check how staff select orders and print the two document types together.'],
      ['Send invoices and follow up on payment', 'sufio', 'Sufio lists invoice delivery, credit notes, and payment reminders. Verify how reminders fit your payment terms.'],
      ['Check a specific e-invoicing format', 'avada-invoices', 'Avada lists PDF documents and e-invoicing options. Ask the vendor to confirm the specific format and market before selecting a plan.'],
    ],
    check: 'Generate an invoice, a packing slip, and a credit note if you use one. Check the template, numbering, currency, and who receives each document.',
  },
  'local-delivery': {
    title: 'Shopify Local Delivery & Store Pickup Apps',
    description: 'Compare Shopify apps for delivery time slots, pickup calendars, order limits, and driver route planning. Check fit for your stores and delivery zones.',
    summary: 'Separate customer scheduling from the work your team does after checkout. Booking a window, limiting orders per slot, and dispatching drivers are different jobs.',
    examples: [
      ['Let customers choose a pickup or delivery slot', 'zapiet-pickup', 'Zapiet lists scheduled pickup and local delivery. Try a valid address and check what the shopper sees when a slot is full.'],
      ['Limit orders per slot', 'pickeasy', 'Pickeasy lists order limits, blackout dates, and postal-code rules. Confirm how the limits apply across your locations.'],
      ['Plan routes for your own drivers', 'easyroutes', 'EasyRoutes lists route planning, driver dispatch, and proof of delivery. Check how your team assigns an order and records a completed stop.'],
    ],
    check: 'Run a test order for a covered address and another outside your zone. Check the pickup or delivery slot, the staff handoff, and the message the customer receives.',
  },
};
