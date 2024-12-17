# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| CVSS v3.0 | Supported Versions                        |
| --------- | ---------------------------------------- |
| 9.0-10.0  | Releases within the last 6 months        |
| 4.0-8.9   | Most recent release                      |

## Reporting a Vulnerability

Please report security vulnerabilities through [GitHub's Security Advisory feature](https://github.com/humanjavaenterprises/nostr-crypto-utils/security/advisories/new).

The security team will review your report and respond through GitHub's Security Advisory platform within 48 hours. You'll receive a more detailed response within 72 hours indicating the next steps in handling your report.

After the initial reply to your report, the security team will keep you informed of the progress towards a fix and full announcement through the Security Advisory dashboard. We may ask for additional information or guidance during this process.

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions.
2. Audit code to find any potential similar problems.
3. Prepare fixes for all still-maintained versions of nostr-crypto-utils.
4. Release new versions and update the GitHub Security Advisory.

Security updates will be released through our normal release process with a security advisory published through GitHub's Security Advisory feature.

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a pull request.
