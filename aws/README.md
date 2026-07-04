# Nevian contact form (AWS)

Sends submissions from the `nevian.info` contact form to a Gmail inbox using
**API Gateway (HTTP API) → Lambda → SES**. Fits entirely inside the AWS Free
Tier for a small marketing site:

- Lambda: 1M requests / 400K GB-s free every month, forever.
- API Gateway HTTP API: 1M requests free for the first 12 months.
- SES: 62,000 emails / month free when sent from a Lambda / EC2 in AWS.

## What lives here

```
aws/
  template.yaml          SAM template (API Gateway + Lambda + IAM + CORS)
  lambda/
    index.mjs            Handler that validates input and calls SES
    package.json         Node.js metadata (SDK v3 SES is bundled in nodejs20.x)
```

## Prerequisites

Install once on your machine:

- **AWS CLI** ([install docs](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **AWS SAM CLI** ([install docs](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- A configured AWS profile: `aws configure` (or export env vars). Pick a
  region that supports SES; `us-east-1` is a safe default.

## Verify SES identities

New AWS accounts start in the **SES sandbox**. In sandbox mode:

- You can only send **from** verified identities.
- You can only send **to** verified identities.

For this contact form (nevian.info sending to nevian.info@gmail.com) that is
fine, you just need to verify both.

1. Open the SES console in the region you plan to deploy to.
2. Under **Identities → Create identity**:
   - Add `nevian.info@gmail.com` as an **Email address** identity.
   - Click the confirmation link Gmail receives.
3. If you want to send from a domain address later
   (`hello@nevian.info`, `noreply@nevian.info`, etc.), add `nevian.info` as a
   **Domain** identity and add the DNS records SES gives you. Optional.

To leave the sandbox and email anyone, request production access under
**Account dashboard → Request production access**. Not required for this form.

## Deploy

From the repo root:

```
cd aws
sam build
sam deploy --guided
```

The guided prompts will ask for a stack name (`nevian-contact` works), the
region, and confirmation. When it finishes, it prints an output:

```
Outputs
-----------------------------------------
Key                 ContactEndpoint
Description         POST this URL from the website contact form.
Value               https://abc123xyz.execute-api.us-east-1.amazonaws.com/contact
```

Copy that URL. Open `website/index.html` and set it on the form:

```html
<form id="contact-form" data-endpoint="https://abc123xyz.execute-api.us-east-1.amazonaws.com/contact" novalidate>
```

Commit and push. GitHub Pages redeploys the site and the form is live.

## Overriding defaults

The template ships with sensible defaults for a Nevian deployment. Change any
of them at deploy time:

```
sam deploy --guided \
  --parameter-overrides \
      RecipientEmail=you@example.com \
      SenderEmail=hello@nevian.info \
      AllowedOrigin=https://nevian.info
```

- `RecipientEmail`: where submissions land (default `nevian.info@gmail.com`).
- `SenderEmail`: SES-verified From address (default `nevian.info@gmail.com`).
- `AllowedOrigin`: origin allowed by CORS. Set to your production origin,
  not `*`, so random sites cannot invoke your Lambda from a browser.

## Updating

Make a change to `lambda/index.mjs` or `template.yaml`, then:

```
sam build && sam deploy
```

Same stack name, no `--guided` needed the second time.

## Tearing it down

```
sam delete
```

Removes the stack, the Lambda, the API, and their logs. SES identities stay
verified until you remove them manually.

## Debugging

- **Test locally.** SAM has `sam local invoke` and `sam local start-api`
  but sending real email needs live SES credentials, so tests here are
  mostly for the validation logic.
- **Tail logs.** After a real submission, run:
  ```
  sam logs -n ContactFunction --stack-name nevian-contact --tail
  ```
- **CORS errors.** Confirm `AllowedOrigin` matches exactly (including
  `https://` and no trailing slash).
- **`Email address is not verified.`** SES sandbox. Verify the sender AND
  the recipient in the SES console.
