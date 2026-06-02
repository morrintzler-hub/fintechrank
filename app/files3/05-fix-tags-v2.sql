-- ============================================================
-- Fix incorrect tags and missing tags
-- Run in Supabase → SQL Editor
-- ============================================================

-- Remove Payroll tag from Ripple (incorrect)
delete from company_tags
where company_id = (select id from companies where slug = 'ripple')
and tag_id = (select id from tags where name = 'Payroll');

-- Remove Payroll from any other crypto companies that got it incorrectly
delete from company_tags ct
using companies c, tags t
where ct.company_id = c.id
and ct.tag_id = t.id
and t.name = 'Payroll'
and c.category = 'Crypto'
and c.slug != 'ripple'; -- already handled above

-- Make sure correct payroll companies have the tag
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Payroll'
and c.slug in ('gusto','deel','razorpay','tipalti','payoneer','wise-business','ramp','mercury','navan')
on conflict do nothing;

-- Fix: Payments pill searches description and matches too broadly
-- Add a dedicated "Payments" tag to all Payments category companies
insert into tags (name) values ('Payment processing') on conflict do nothing;

-- Ensure all Payments category companies have clear tags
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Global'
and c.category = 'Payments'
on conflict do nothing;

-- Add missing Neobank tags
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Neobank'
and c.slug in ('revolut','monzo','starling-bank','n26','chime','current',
               'varo-bank','bunq','lunar','dave','aspiration','greenlight',
               'novo','qonto','nubank','solaris')
on conflict do nothing;

-- Verify Crypto tag on all crypto companies
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Crypto'
and c.category = 'Crypto'
on conflict do nothing;

-- Add BNPL tag to correct companies only
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'BNPL'
and c.slug in ('klarna','afterpay','sezzle','affirm','block','paytm')
on conflict do nothing;

-- Remittance - correct companies only
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Remittance'
and c.slug in ('wise','remitly','worldremit','m-pesa','moneygram')
on conflict do nothing;

-- Africa - correct companies
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'Africa'
and c.slug in ('flutterwave','m-pesa','worldremit','tala')
on conflict do nothing;

-- India - correct companies
insert into company_tags (company_id, tag_id)
select c.id, t.id from companies c, tags t
where t.name = 'India'
and c.slug in ('razorpay','paytm','phonepe','pine-labs')
on conflict do nothing;

