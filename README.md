# Commerce Shelf

An independent Shopify app directory with five topics. The returns listings are in [directory.mjs](directory.mjs). The topic descriptions and other listings are in [shopify.mjs](shopify.mjs). Each tool page links to its Shopify source and official website.

## Build and deploy

Requires Node.js 22 or later.

```sh
npm ci
npm run build
npm run dev
```

The static build writes `dist/`. Cloudflare Pages runs the subscription endpoint from `functions/`. Deploy the checked-out main branch to the existing Direct Upload project with `npm run deploy`. Set `CLOUDFLARE_ACCOUNT_ID` and a Pages-scoped `CLOUDFLARE_API_TOKEN` in your deployment environment. Deployment does not require Vercel.

## Subscription

Create a dedicated segment in Resend. In the Cloudflare Pages production environment, set `RESEND_API_KEY` as an encrypted secret using a key with Contacts access, and set `RESEND_SEGMENT_ID` to the corresponding segment ID. Deploy again if Cloudflare prompts for a new deployment. For local testing use `.dev.vars`, which is ignored by Git.

The form sends only the submitted email to the server-side Resend Contacts API. It displays an unavailable message until configuration is present and reports success only after the provider accepts the request.

## Sponsorship

The sponsor page opens a public GitHub issue template for applications. To activate checkout after approving an offer, supply a live Stripe Payment Link in `STRIPE_PAYMENT_LINK` at build time, then redeploy. No Stripe API key is required. Approved listings can be marked as sponsored in the corresponding listings file.

## Setup services

The tracking and invoice topics link to service scopes in [services.mjs](services.mjs). Merchants request an invoice setup quote through the setup form. Review submissions in the Responses tab of the Commerce Shelf Shopify Setup Request form.

Tracking plans use one-time Payhip checkout links from the Tool & Page store, with PayPal as the payment method. The Payhip download guides customers to the private setup form. Match the purchase email and receipt reference to a completed payment in Payhip before scheduling. Start the 30-day preview period when you send the preview URL. Use a separate preview and a test inbox for the preview order.
