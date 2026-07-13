---
title: "How to Choose a Payment Gateway in 2026: The Complete Guide"
date: "July 23, 2026"
readTime: "13 min read"
category: "Guide"
categoryColor: "#38bdf8"
excerpt: "Everything a non-technical founder needs to know about choosing between Stripe, Adyen, Checkout.com, and PayPal."
---

The payment gateway decision is one of the most consequential technical choices an e-commerce or SaaS business makes. Unlike most software decisions, switching payment gateways is painful — it requires engineering time, creates downtime risk, and can disrupt subscriptions and stored payment methods. Getting it right the first time is worth the research investment.

## What a payment gateway actually does

When a customer enters their card details at checkout, the gateway:

1. Encrypts the card data so it never touches your servers
2. Routes the transaction to the card network (Visa, Mastercard, Amex)
3. The card network contacts the customer's issuing bank for authorisation
4. The bank returns an approve or decline response in real time
5. If approved, the gateway holds the funds and settles them to your account within 1-2 business days

Modern providers like Stripe and Adyen bundle the gateway, payment processor, and acquiring bank into a single product, which simplifies setup significantly compared to older architectures where these were purchased separately.

## The five questions that determine the right gateway

**1. Where are your customers?**
Local acquiring — where the transaction is processed by a bank in the same country as your customer — typically delivers 2-5% higher authorisation rates and lower costs than cross-border processing. If you are selling across multiple regions, local acquiring capability in each should be your primary filter.

**2. What is your monthly processing volume?**
- Under £50,000/month: Blended pricing is fine. Simplicity outweighs the slight cost premium.
- £50,000-500,000/month: Worth getting quotes from Checkout.com.
- Over £500,000/month: Negotiate. Every provider at this volume will offer custom interchange-plus pricing.

**3. Do you have subscriptions or recurring billing?**
Stripe Billing is the market standard. Its handling of failed payment retries, plan upgrades, prorations, and dunning sequences saves significant engineering time. If subscriptions are central to your model, Stripe is the default choice.

**4. How important is developer experience?**
If your engineering team is making the integration decision, they will almost always prefer Stripe. Faster integration means less engineering time, which translates directly into money.

**5. Do you need a specialist solution?**
High-risk merchants, marketplaces, and businesses processing high-value B2B transactions have specific requirements. Filter for providers with experience in your category before comparing general features.

## The four main providers compared

**Stripe** is the right default for most businesses. Its developer experience is class-leading, documentation is comprehensive, and its product suite covers almost every use case. Standard pricing is 1.5% + 25p for UK cards, 2.9% + 30c in the US.

Weaknesses: more expensive than alternatives at high volumes without negotiation, and local acquiring is not as deep as Adyen's in some markets.

**Adyen** is the enterprise standard. It processes payments for Netflix, Uber, Microsoft, and eBay. Its local acquiring network is the broadest of any provider, producing the highest authorisation rates for global merchants. Adyen uses interchange-plus pricing with no monthly fees, making it genuinely competitive at scale.

Weaknesses: requires more technical investment to integrate, minimum volume requirements exclude smaller merchants, and onboarding takes longer. For businesses under £5 million in annual processing, the overhead rarely justifies the marginal acceptance rate improvement.

**Checkout.com** sits between Stripe and Adyen. It offers enterprise-grade features with a lower barrier to entry than Adyen and more flexibility on commercial terms. A strong choice for mid-market businesses that have outgrown Stripe's standard offering.

**PayPal** is a consumer wallet that also functions as a payment gateway. Adding a PayPal button alongside your primary gateway can increase checkout conversion by 5-15% for consumer e-commerce. PayPal as a primary gateway for developer-built products is not recommended — fees are higher, developer experience is behind Stripe, and the product is more limited.

## Understanding pricing

**Blended pricing** — Stripe's standard model — combines all fees into a single percentage plus fixed fee. Simple to understand, slightly more expensive than interchange-plus at high volumes.

**Interchange-plus pricing** — Adyen and Checkout.com at scale — charges the actual interchange rate set by Visa/Mastercard plus a fixed processor margin. More complex to reconcile but typically cheaper by 0.1-0.5% at high volumes.

The savings from interchange-plus begin to meaningfully offset the reconciliation complexity at around £50,000-100,000 monthly processing volume.

## Fraud and chargebacks

**Stripe Radar** uses machine learning trained on billions of transactions to flag suspicious activity. Its rules engine allows custom logic — blocking specific countries, requiring 3D Secure above certain amounts. For most businesses, default settings catch the majority of fraud without meaningful false positives.

**Adyen's RevenueProtect** is more configurable and better suited to merchants with industry-specific fraud patterns or high-value transactions requiring manual review.

**3D Secure** reduces fraud but increases friction and cart abandonment. The right implementation uses 3DS selectively — on high-risk transactions or amounts above a threshold — rather than universally.

## Our recommendation

**For most startups and SMBs:** Start with Stripe. Use blended pricing, add Stripe Billing for subscriptions, revisit when processing over £50,000/month.

**At £50,000-500,000/month:** Get a quote from Checkout.com. If their pricing is 0.2% lower at your volume, the switching cost might be worth it.

**At £500,000+/month or global scale:** Evaluate Adyen. Acceptance rate improvements in key markets and interchange-plus pricing deliver material savings.

**For consumer e-commerce regardless of gateway:** Add PayPal as a secondary checkout option. The conversion lift typically pays for the integration cost within weeks.

The gateway decision is not permanent, but migrating is painful enough that choosing thoughtfully at the start saves significant operational cost later.
