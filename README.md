# Microsoft Tenant Lookup Tool
A really simple tool that allows you to use a domain to find a Microsoft tenant ID

## What is this thing?
I got really tired of the tenant ID locating tools I was using disappearing overnight, so I made my own! This tool will take in a domain name and return a Microsoft tenant ID and region (if the domain is attached to a tenant). It does this without taking any information onto the server it is hosted (it uses jQuery to directly query the Entra ID OpenID Connect API).

# Deploying
- Download the repo
- Update images/content as you see fit. Do not mess with `tenant-lookup.js` unless you know what you are doing.
- Upload it to your server (it is just an HTML and Javascript combo, any modern browser can run it, your server does not need PHP or anything).
- If you upload to a subdirectory (like `yourdomain[.]com/TenantLookup/`), be sure to keep the folder structure intact or update relative links as is appropriate. I would recommend using a subdomain for simplicity like `tenantlookup.yourdomain[.]com`

  ## Online Version
  I'm also hosting a copy of this (at least for now) at https://tenantlookup.hugethunder.io if you'd just like to use the tool.
