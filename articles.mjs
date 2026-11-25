export const articles = {
  tracking: {
    slug: 'shopify-branded-order-tracking-page',
    title: 'How to Add a Branded Order Tracking Page to Shopify',
    description: 'Set up a branded Shopify tracking page, connect it to your store and shipping emails, and test it with three shipment scenarios.',
    published: '2026-11-25',
    intro: 'Add a branded tracking page with a Shopify tracking app, put its storefront link in your store menu, and test the links in your shipping emails. If your customers only need to see delivery progress, Shopify’s built-in order status page may already cover the job.',
    sections: [
      {
        id: 'built-in-tracking',
        title: 'Start with Shopify’s order status page',
        body: `<p>Shopify gives customers a link to their order status page. Once a fulfillment has a tracking number, customers can follow it from that page, shipping emails, or the Shop app. Supported carriers can display updates on the order status page. For another carrier, enter the full tracking URL so customers can follow the shipment on the carrier’s site.</p>
        <p>Use a branded page when shoppers need a permanent <strong>Track your order</strong> link in your store menu, or when your team needs features such as localized lookup and shipment exception alerts. Before installing an app, check the carriers you use, the monthly shipment allowance, and which plan includes the features you need.</p>
        <p class="source-note"><a class="text-link" href="https://help.shopify.com/en/manual/fulfillment/setup/order-status-page/order-tracking">Shopify’s guide to order tracking</a></p>`,
      },
      {
        id: 'set-up-the-page',
        title: 'Set up the page and link it from your store',
        body: `<ol>
          <li><strong>Connect your orders.</strong> Install the app and check that it receives tracking data from your Shopify fulfillments. Open an order with a tracking number and verify the carrier before editing your storefront.</li>
          <li><strong>Set up the lookup page.</strong> Apply your logo and colors, then preview the lookup fields on a phone. With AfterShip, open <strong>Branded pages → URLs and embedding</strong> and choose <strong>Embed using Shopify proxy URL</strong>. Select the tracking page destination and copy the storefront URL for your store. It will be a link on your store domain, with a path such as <code>/apps/aftership/tracking</code>.</li>
          <li><strong>Add the menu link.</strong> In Shopify admin, open <strong>Content → Menus</strong>. Choose your footer or support menu, add a <strong>Track your order</strong> item using the storefront tracking URL, and save. Open the public store and follow the link on a phone.</li>
          <li><strong>Test the email destination.</strong> If your app supports it, update the relevant email links using the vendor’s Shopify instructions. In Shopify, open <strong>Settings → Notifications → Customer notifications</strong>. Preview the affected templates and open the links from test emails before using the changes for live orders. Check that customers receive one shipping update per event if both Shopify and the app send notifications.</li>
        </ol>
        <p class="source-note"><a class="text-link" href="https://support.aftership.com/en/articles/18436569-add-pages-to-your-shopify-store-using-the-proxy-url">AfterShip’s storefront and email setup</a></p>`,
      },
      {
        id: 'test-three-orders',
        title: 'Test three shipment scenarios before launch',
        body: `<p>Open each case from both the store menu and a shipping email on a phone. Use orders and contact details you control for the tests.</p>
        <dl class="article-checklist">
          <dt>Label created, carrier still awaiting the parcel</dt>
          <dd>The page should show a pending status without implying that the carrier has received the parcel. Check what shoppers see if an estimated date is unavailable.</dd>
          <dt>One order, two shipments</dt>
          <dd>Fulfill different items separately and add tracking to each fulfillment. Make sure customers can find both packages and tell which items are on the way.</dd>
          <dt>Shipment with an exception</dt>
          <dd>Use an order with a documented delay or failed delivery attempt. Check the shopper’s next step and confirm that any staff alert you enabled goes to the right team.</dd>
        </dl>
        <p>If a link opens the carrier’s site instead of your branded page, check whether you followed a carrier link or an order lookup link. Then check your app’s redirect settings and the current email template before changing either again.</p>
        <p class="source-note"><a class="text-link" href="https://help.shopify.com/en/manual/fulfillment/setup/order-status-page/understanding-order-status-pages">Shopify’s guide to statuses and multiple shipments</a></p>`,
      },
    ],
    tools: ['aftership-tracking', 'cwill-tracking', '17track'],
    compareLabel: 'Compare Shopify order tracking apps',
  },
  invoices: {
    slug: 'print-shopify-packing-slips',
    title: 'How to Print and Customize Packing Slips in Shopify',
    description: 'Print one Shopify packing slip or a batch, edit the default template, and use a field checklist to test split shipments.',
    published: '2026-11-25',
    intro: 'Print a packing slip from an order in Shopify admin, or select several orders and print them together. To change the layout, edit your default packing slip template in Shipping and delivery. The slip lists what goes in the specific shipment, which matters when an order ships in more than one box.',
    sections: [
      {
        id: 'print-one-or-in-bulk',
        title: 'Print one packing slip or a batch',
        body: `<ol>
          <li><strong>One order.</strong> In Shopify admin, open <strong>Orders</strong> and select the order. In <strong>More actions</strong>, find the print section and choose <strong>Print packing slips</strong>. Save the preview as a PDF or print it.</li>
          <li><strong>Several orders.</strong> On the <strong>Orders</strong> list, select the orders you’re packing. Choose <strong>Print → Print packing slips</strong>. If Shopify asks for a fulfillment location, select the location preparing those orders.</li>
          <li><strong>Slips and invoices in one print run.</strong> Use <strong>Print documents</strong>, select both document types, and turn on <strong>Collate</strong> if you want to keep each order’s documents together.</li>
        </ol>
        <p>If the preview doesn’t open, check your browser’s pop-up settings for Shopify admin. If a staff member can open the order but can’t print from it, check their <strong>Manage order information</strong> permission.</p>
        <p class="source-note"><a class="text-link" href="https://help.shopify.com/en/manual/fulfillment/managing-orders/printing-orders/printing-documents">Shopify’s order document printing instructions</a></p>`,
      },
      {
        id: 'packing-slip-fields',
        title: 'Use this packing slip field checklist',
        body: `<p>Copy these fields into your template brief. Give the packer enough detail to identify the correct item, color, size, and quantity.</p>
        <dl class="article-checklist">
          <dt>Store name and order reference</dt>
          <dd>Use the store name and the order number the customer sees. Add an order date if it helps your team match paperwork.</dd>
          <dt>Recipient and shipping address</dt>
          <dd>Use the delivery address for this shipment. Include your support or returns contact if shoppers rely on it after delivery.</dd>
          <dt>Items in this box</dt>
          <dd>Show product name, variant, SKU if your team uses it, and the quantity packed. For a split order, list the items and quantities in the current fulfillment.</dd>
          <dt>Optional customer note</dt>
          <dd>Include only notes intended for the recipient. For gift orders, preview the slip to check that prices and internal notes are absent.</dd>
        </dl>
        <p>For example, an order contains two large navy shirts and one cap. If you send one shirt today, today’s slip should show <strong>Navy Shirt · Large · Qty 1</strong>. When the rest ships, that slip should show the second shirt and the cap. In a native Shopify template, use <code>line_items_in_shipment</code> and <code>line_item.shipping_quantity</code> to show what was packed.</p>
        <p class="source-note"><a class="text-link" href="https://help.shopify.com/en/manual/fulfillment/managing-orders/printing-orders/packing-slip-variable-reference">Shopify’s packing slip variables</a></p>`,
      },
      {
        id: 'customize-the-template',
        title: 'Edit the default packing slip template',
        body: `<ol>
          <li>In Shopify admin, open <strong>Settings → Shipping and delivery</strong>. In <strong>Documents</strong>, open the default packing slip template.</li>
          <li>Save a copy of the existing template code before editing. Make one change at a time, such as adding your logo, removing product images, or increasing the type size.</li>
          <li>Use <strong>Preview</strong> with an ordinary order and a split shipment. Check long variant names, page breaks, and the printed result on the paper your packing station uses. Save the template once the preview is correct.</li>
        </ol>
        <p>The <strong>Print packing slips</strong> shortcut uses the default template. If your edits aren’t appearing, check which template is set as the default. Keep the native template if it covers your layout. Compare apps when you need automatic PDF invoices, more template controls, or a workflow that combines several documents.</p>
        <p class="source-note"><a class="text-link" href="https://help.shopify.com/en/manual/fulfillment/managing-orders/printing-orders/customizing-packing-slips">Shopify’s packing slip customization guide</a></p>`,
      },
    ],
    tools: ['order-printer-pro', 'oxilayer', 'sufio'],
    compareLabel: 'Compare Shopify invoice and packing slip apps',
  },
};
