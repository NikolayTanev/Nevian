import { useState } from 'react';
import {
  IconArrow,
  IconBolt,
  IconCheck,
  IconDevice,
  IconShield,
} from './Icons.jsx';

export const docsUrl = (slug) => (
  slug === 'introduction' ? '/documentation/' : `/documentation/${slug}/`
);

export const documentationGroups = [
  {
    label: 'Get started',
    items: [
      { slug: 'introduction', label: 'About' },
      { slug: 'onboard-first-device', label: 'Onboard your first device' },
      { slug: 'deployment-checklist', label: 'Deployment checklist' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { slug: 'devices', label: 'Devices' },
      { slug: 'agent-architecture', label: 'Agent architecture' },
      { slug: 'automations', label: 'Automations', nested: true },
      { slug: 'identity-and-access', label: 'Identity & access' },
      { slug: 'audit-trail', label: 'Audit trail' },
    ],
  },
  {
    label: 'API & integrations',
    items: [
      { slug: 'api-overview', label: 'API overview' },
      { slug: 'authentication', label: 'Authentication' },
      { slug: 'webhooks', label: 'Webhooks', nested: true },
      { slug: 'rate-limits', label: 'Rate limits' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { slug: 'troubleshooting', label: 'Troubleshooting' },
      { slug: 'security', label: 'Security' },
      { slug: 'agent-releases', label: 'Agent releases' },
    ],
  },
];

export const documentationOrder = documentationGroups.flatMap((group) => group.items);

const codeTokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|https?:\/\/[^\s"'\\]+|\$[A-Za-z_][\w:.-]*|--[\w-]+|\b(?:curl|POST|GET|PUT|PATCH|DELETE|Start-Process|true|false|null|const|return|await)\b|\b\d+(?:\.\d+)?\b)/g;

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function DocumentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h5" />
    </svg>
  );
}

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

async function copyToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy failed');
}

function HighlightedCode({ code }) {
  const lines = code.split('\n');
  return lines.map((line, lineIndex) => (
    <span className="docs-code-line" key={`${line}-${lineIndex}`}>
      {line.split(codeTokenPattern).map((token, tokenIndex) => {
        let tokenClass = '';
        if (/^["']/.test(token)) tokenClass = 'is-string';
        else if (/^\$/.test(token)) tokenClass = 'is-variable';
        else if (/^--/.test(token)) tokenClass = 'is-flag';
        else if (/^\d/.test(token)) tokenClass = 'is-number';
        else if (/^(curl|POST|GET|PUT|PATCH|DELETE|Start-Process|true|false|null|const|return|await)$/.test(token)) tokenClass = 'is-keyword';

        return tokenClass
          ? <span className={tokenClass} key={`${token}-${tokenIndex}`}>{token}</span>
          : token;
      })}
      {lineIndex < lines.length - 1 ? '\n' : ''}
    </span>
  ));
}

export function CodeBlock({ code, language, label }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <div className="docs-code-label">
          <span>{label}</span>
          <small>{language}</small>
        </div>
        <button type="button" onClick={copyCode} aria-label={`Copy ${label} code`}>
          {copied ? <IconCheck aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre tabIndex="0"><code><HighlightedCode code={code} /></code></pre>
    </div>
  );
}

function Callout({ tone = 'info', title, children }) {
  const Icon = tone === 'warning' ? IconShield : tone === 'neutral' ? IconBolt : InfoIcon;
  return (
    <aside className={`docs-callout docs-callout-${tone}`}>
      <Icon aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <div>{children}</div>
      </div>
    </aside>
  );
}

function Checklist({ items }) {
  return (
    <ul className="docs-requirements">
      {items.map((item) => (
        <li key={typeof item === 'string' ? item : item.key}>
          <span><IconCheck aria-hidden="true" /></span>
          <div>{typeof item === 'string' ? <p>{item}</p> : item.content}</div>
        </li>
      ))}
    </ul>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="docs-table-wrap">
      <table>
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.key || rowIndex}>
              {row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PageCards({ items }) {
  const iconFor = (icon) => {
    if (icon === 'device') return IconDevice;
    if (icon === 'shield') return IconShield;
    if (icon === 'bolt') return IconBolt;
    return DocumentIcon;
  };

  return (
    <div className="docs-next-grid">
      {items.map((item) => {
        const Icon = iconFor(item.icon);
        return (
          <a href={docsUrl(item.slug)} key={item.slug}>
            <span className="docs-next-icon"><Icon aria-hidden="true" /></span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <span className="docs-card-link">{item.linkLabel || 'Read the guide'} <IconArrow aria-hidden="true" /></span>
          </a>
        );
      })}
    </div>
  );
}

function Status({ tone = 'available', children }) {
  return <span className={`docs-status docs-status-${tone}`}>{children}</span>;
}

const endpointConfig = String.raw`[api]
enabled = true
base_url = "https://support.example.com"

[security]
# Set false for telemetry-only operation.
commands_enabled = true`;

const selfTestCommand = String.raw`& "C:\ProgramData\Nevian\desk-agent.exe" --api-selftest`;

const signatureShape = `deviceId
timestamp
nonce
POST
/api/agent/v1/heartbeat
sha256-of-the-exact-request-body`;

const hmacHeaders = `X-Nevian-Device: <device-id>
X-Nevian-Timestamp: <unix-time-milliseconds>
X-Nevian-Nonce: <random-unique-value>
X-Nevian-Signature: <hmac-sha256-hex>`;

export const documentationPages = {
  introduction: {
    group: 'Get started',
    title: 'About Nevian',
    summary: 'Understand how Nevian connects your help desk, Windows endpoints, support workflows, and identity systems in one operator workspace.',
    sections: [
      {
        id: 'what-is-nevian',
        title: 'What Nevian is',
        content: <>
          <p>
            Nevian is an IT support workspace for teams that need to understand an endpoint, work a ticket, and perform a controlled support action without moving through a collection of disconnected tools. It combines a browser-based service desk with a lightweight Windows Desk Agent and optional identity integrations.
          </p>
          <p>
            The platform is designed around context. Device inventory, recent health, ticket history, the signed-in operator, and available support actions are kept in the same organization boundary. An administrator can move from a user report to the affected computer, inspect its state, and decide what to do next.
          </p>
          <DataTable
            columns={['Component', 'Purpose', 'Runs where']}
            rows={[
              { cells: [<strong>Nevian workspace</strong>, 'Tickets, Fleet, users, runbooks, integrations, and administrative controls.', 'Your Nevian control plane'] },
              { cells: [<strong>Desk Agent</strong>, 'Reports Windows context and receives work addressed to its own device identity.', 'Managed Windows endpoints'] },
              { cells: [<strong>Server Agent</strong>, 'Optional worker for tightly scoped on-premises Active Directory recovery jobs.', 'A customer-managed Windows server'] },
              { cells: [<strong>Integrations</strong>, 'Optional Microsoft Graph, ServiceNow, OpenAI, and release-artifact connections.', 'Configured from the control plane'] },
            ]}
          />
        </>,
      },
      {
        id: 'core-workflow',
        title: 'The core workflow',
        content: <>
          <ol>
            <li><strong>Connect an organization.</strong> Administrators establish the organization, invite the support team, and configure only the integrations they need.</li>
            <li><strong>Enroll Windows devices.</strong> A generated installer assigns each endpoint to the selected client and exchanges its rollout token for a unique device credential.</li>
            <li><strong>Collect scoped context.</strong> Inventory, heartbeat metrics, selected Windows events, agent version, and command capability state flow to Fleet.</li>
            <li><strong>Resolve support work.</strong> Operators use ticket and device context together. Administrators can queue approved support actions when local device policy permits them.</li>
            <li><strong>Review what happened.</strong> Ticket activity, automation administration, device-command activity, and identity recovery each retain feature-specific records.</li>
          </ol>
        </>,
      },
      {
        id: 'operating-model',
        title: 'Organization and trust model',
        content: <>
          <p>
            An organization is Nevian’s customer boundary. Human access, clients, devices, tickets, automations, and connected Microsoft tenant data are resolved from the authenticated organization rather than accepted from a browser request. Administrators and users have different workspace capabilities, and a user account currently belongs to one organization at a time.
          </p>
          <p>
            Device identity is separate from human identity. An enrollment token is used only to bootstrap a machine. The agent then stores a unique device ID and secret and signs subsequent requests. The server derives the organization, client, and canonical hostname from that registered identity.
          </p>
          <Callout title="Nevian uses several identity types">
            <p>A Google/Firebase session identifies a person, a per-device HMAC credential identifies an endpoint, and Microsoft OAuth identifies a connected Entra tenant. They are intentionally not interchangeable.</p>
          </Callout>
        </>,
      },
      {
        id: 'supported-environments',
        title: 'Supported environments',
        content: <>
          <DataTable
            columns={['Area', 'Current support', 'Notes']}
            rows={[
              { cells: ['Desk Agent', <Status>Windows</Status>, 'Windows 10, Windows 11, and Windows Server 2016 or later.'] },
              { cells: ['macOS agent', <Status tone="planned">Not available</Status>, 'The current collectors and tray application use Windows APIs.'] },
              { cells: ['Linux agent', <Status tone="planned">Not available</Status>, 'Linux endpoint collection and packaging are not implemented.'] },
              { cells: ['Browser workspace', 'Modern evergreen browsers', 'Human sign-in currently uses Google through Firebase.'] },
              { cells: ['On-prem AD recovery', 'Optional Windows server worker', 'Deploy separately and begin in dry-run mode.'] },
            ]}
          />
          <Callout tone="warning" title="Do not deploy a macOS or Linux package">
            <p>The onboarding picker may show those platforms as future options, but the current source and release pipeline produce a Windows agent only.</p>
          </Callout>
        </>,
      },
      {
        id: 'choose-your-path',
        title: 'Choose where to begin',
        content: <>
          <p>New deployments should start with one test endpoint, confirm the trust and network path, and only then expand to a pilot group.</p>
          <PageCards items={[
            { slug: 'onboard-first-device', title: 'Connect a test device', description: 'Generate a client-scoped installer, enroll Windows, and verify its first heartbeat.', icon: 'device', linkLabel: 'Start onboarding' },
            { slug: 'deployment-checklist', title: 'Prepare production', description: 'Review control-plane, signing, network, policy, and rollout prerequisites.', icon: 'shield', linkLabel: 'Open the checklist' },
          ]} />
        </>,
      },
    ],
  },

  'onboard-first-device': {
    group: 'Get started',
    title: 'Onboard your first device',
    summary: 'Generate a client-scoped Windows installer, enroll the Desk Agent, and verify that the endpoint is reporting to Fleet.',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        content: <>
          <p>
            Nevian onboarding starts in the workspace, not with a public API key. An administrator selects a client and downloads an installer package generated specifically for that rollout. The package contains the Desk Agent, its configuration, and a temporary enrollment token.
          </p>
          <p>
            On first connection, the Desk Agent exchanges that token for a unique machine credential. Heartbeats and inventory then create or update the device in Fleet. A normal single-device test can be completed in a few minutes once the control plane and agent binary are ready.
          </p>
          <Callout title="Current platform support">
            <p>Use a Windows 10, Windows 11, or Windows Server 2016+ endpoint. Nevian does not currently ship a macOS or Linux Desk Agent.</p>
          </Callout>
        </>,
      },
      {
        id: 'before-you-begin',
        title: 'Before you begin',
        content: <>
          <Checklist items={[
            'An onboarded Nevian administrator account with access to the destination organization.',
            'A client record representing the customer, business unit, or managed environment that owns the device.',
            'A released Desk Agent binary available to the control plane, or a development build on a local build host.',
            'Outbound connectivity from the endpoint to the public Nevian URL embedded in the installer.',
            'Local administrator approval for installation and creation of the elevated logon task.',
          ]} />
          <p>
            If publisher trust is required by your Windows policy, configure installer signing before generating the package. Nevian can deliberately generate an unsigned installer when signing is not configured, but Windows may display an unknown-publisher warning.
          </p>
        </>,
      },
      {
        id: 'generate-installer',
        title: 'Generate the installer',
        step: 'Step 1',
        content: <>
          <ol>
            <li>Open the creation menu in the Nevian workspace and choose <strong>Device → Computer</strong>.</li>
            <li>Select an existing client or create the client that should own the endpoint.</li>
            <li>Choose <strong>Windows</strong>. macOS and Linux are shown as unavailable because no compatible agent build exists.</li>
            <li>If the workspace reports that no agent binary is ready, fetch the configured release build. Local Cargo compilation is a development fallback, not the production distribution model.</li>
            <li>Optionally enter a display name. Leave it blank to use the endpoint hostname.</li>
            <li>Generate the default single-file EXE, or choose ZIP when endpoint controls prevent use of a self-extracting executable.</li>
          </ol>
          <Callout tone="neutral" title="What the package is scoped to">
            <p>The generated token belongs to one organization and one client. Current workspace-generated tokens expire after 30 days. They authorize enrollment only and do not allow inventory reads or human workspace access.</p>
          </Callout>
        </>,
      },
      {
        id: 'install-agent',
        title: 'Install the Desk Agent',
        step: 'Step 2',
        content: <>
          <p>
            Move the installer to the target Windows endpoint and run it. The setup stages its payload outside the extraction directory, prompts for elevation, installs the agent under <code>C:\ProgramData\Nevian</code>, writes configuration, registers an elevated task at logon, and launches the tray application.
          </p>
          <p>
            For a ZIP package, extract the entire archive and run <code>install.cmd</code>. Do not move only the executable: the package’s configuration and installation script are required during setup.
          </p>
          <CodeBlock code={endpointConfig} language="toml" label="Relevant generated settings" />
          <Callout tone="warning" title="Protect generated installers">
            <p>The package contains a live enrollment token until it expires or is revoked. Do not commit it to source control, attach it to a public ticket, or reuse it as a permanent golden-image secret.</p>
          </Callout>
        </>,
      },
      {
        id: 'first-connection',
        title: 'What happens on first connection',
        content: <>
          <ol>
            <li>The installer makes a best-effort registration call so the endpoint can appear in onboarding activity.</li>
            <li>The agent sends its token and hostname to <code>/api/agent/v1/enroll</code>.</li>
            <li>Nevian validates token status, expiry, optional use limit, organization, and client.</li>
            <li>Nevian returns a unique <code>deviceId</code> and 256-bit device secret.</li>
            <li>The agent stores the credential in <code>%ProgramData%\Agent\config\device.json</code> with access restricted to SYSTEM and Administrators.</li>
            <li>All later inventory, heartbeat, event, and command requests are signed with that device credential.</li>
          </ol>
          <p>
            Reinstalling the same hostname rotates its credential instead of creating a second device identity. A device that an administrator has revoked cannot silently restore itself through re-enrollment.
          </p>
        </>,
      },
      {
        id: 'verify-device',
        title: 'Verify the device',
        step: 'Step 3',
        content: <>
          <p>Open <strong>Fleet</strong> and locate the endpoint by hostname or its optional display name. Validate more than the existence of a row:</p>
          <DataTable
            columns={['Check', 'Expected result', 'What it confirms']}
            rows={[
              { cells: ['Identity', 'Correct client, hostname, and organization', 'The installer was generated in the intended scope.'] },
              { cells: ['Last seen', 'A recent heartbeat timestamp', 'The endpoint can authenticate and reach the control plane.'] },
              { cells: ['Inventory', 'OS, hardware, adapters, disks, and security context', 'The inventory collector completed and uploaded a snapshot.'] },
              { cells: ['Agent version', 'The build used to generate the installer', 'The intended artifact is running.'] },
              { cells: ['Remote commands', 'Enabled or disabled according to local policy', 'The heartbeat is reporting the endpoint’s command kill switch.'] },
            ]}
          />
          <CodeBlock code={selfTestCommand} language="powershell" label="Optional endpoint API self-test" />
          <p>The self-test uses a scratch identity and exercises enrollment, credential loading, inventory, heartbeat, event upload, and command polling without replacing the endpoint’s production identity.</p>
        </>,
      },
      {
        id: 'rollout-next',
        title: 'After the first device',
        content: <>
          <p>
            Keep the first endpoint in a pilot group long enough to observe reconnects, logon startup, inventory refresh, and any endpoint-security alerts. Then decide whether the same client-scoped package is appropriate for the remaining rollout window or whether you should generate and revoke packages in smaller batches.
          </p>
          <PageCards items={[
            { slug: 'deployment-checklist', title: 'Move toward production', description: 'Validate URL, TLS, artifact, signing, endpoint policy, and recovery prerequisites.', icon: 'shield' },
            { slug: 'devices', title: 'Learn Fleet', description: 'Understand inventory, freshness, presence, and remote support capabilities.', icon: 'device' },
          ]} />
        </>,
      },
    ],
  },

  'deployment-checklist': {
    group: 'Get started',
    title: 'Deployment checklist',
    summary: 'Prepare the Nevian control plane, agent artifact, Windows endpoints, security policy, and rollout process for production use.',
    sections: [
      {
        id: 'control-plane',
        title: 'Control-plane prerequisites',
        content: <>
          <Checklist items={[
            { key: 'mongo', content: <p>Set <code>MONGO_URI</code> to a reachable MongoDB deployment. The server fails closed at startup when it is missing.</p> },
            { key: 'database', content: <p>Choose <code>MONGO_DB</code> when the default <code>itsm</code> database name is not appropriate.</p> },
            { key: 'port', content: <p>Expose the configured application port—<code>3000</code> by default—through your reverse proxy or load balancer.</p> },
            { key: 'firebase', content: <p>Confirm Firebase Google sign-in is configured for the production hostname and permitted redirect origins.</p> },
            { key: 'backup', content: <p>Establish database backup, restore, monitoring, and retention procedures before enrolling production endpoints.</p> },
          ]} />
          <Callout tone="warning" title="Keep secrets out of documentation and installers">
            <p>Document variable names and ownership, not live MongoDB, Firebase, Microsoft, signing, ServiceNow, or OpenAI secret values.</p>
          </Callout>
        </>,
      },
      {
        id: 'public-url',
        title: 'Public URL and network path',
        content: <>
          <p>
            Set <code>AGENT_HELPDESK_URL</code> to the externally reachable HTTPS origin that agents should use. If it is absent, the installer builder derives the URL from the download request. Behind a reverse proxy, a wrong forwarded scheme or host can embed an unusable address into every generated package.
          </p>
          <Checklist items={[
            'Terminate TLS with a certificate trusted by managed endpoints.',
            'Preserve the expected host and scheme through the reverse proxy.',
            'Allow endpoint outbound access to the control-plane origin and required identity providers.',
            'Test DNS, proxy inspection, certificate chains, and clock synchronization from the same network as the pilot endpoint.',
            'Review URL logging because browser Server-Sent Events may carry a short-lived Firebase token in the query string.',
          ]} />
        </>,
      },
      {
        id: 'agent-artifact',
        title: 'Agent artifact source',
        content: <>
          <p>
            Production onboarding expects a released <code>desk-agent.exe</code>. Configure <code>AGENT_BINARY_REPO</code> so the workspace can resolve the newest release, or provide an exact artifact URL and SHA-256 digest. Private repositories also need a read token held only by the server.
          </p>
          <DataTable
            columns={['Path', 'Use', 'Production guidance']}
            rows={[
              { cells: ['Release repository', 'Fetch tagged agent plus checksum', <Status>Preferred</Status>] },
              { cells: ['Exact URL + SHA-256', 'Pin a controlled artifact', 'Useful for a frozen release or private mirror'] },
              { cells: ['Local Cargo build', 'Compile from a source checkout', <Status tone="planned">Development only</Status>] },
            ]}
          />
          <p>Verify that the workspace reports the expected source version and a successful checksum before generating a pilot installer.</p>
        </>,
      },
      {
        id: 'installer-signing',
        title: 'Installer assembly and signing',
        content: <>
          <p>
            The current EXE builder uses Windows <code>iexpress.exe</code>; the dashboard host that assembles EXE packages must therefore be Windows. ZIP remains an escape hatch for environments that cannot use the generated self-extracting package.
          </p>
          <p>
            Authenticode signing is optional but strongly recommended for managed production estates. Configure either a certificate-store thumbprint or a PFX and password, plus an RFC 3161 timestamp service. Nevian signs the finished PE after assembly. When signing is configured but fails, package download is refused rather than quietly returning an unsigned build.
          </p>
          <Callout title="A signature and publisher trust are different checks">
            <p>A self-signed package can be cryptographically signed while still appearing untrusted on endpoints that do not trust its issuing certificate. Validate both signature state and trust on a representative device.</p>
          </Callout>
        </>,
      },
      {
        id: 'endpoint-policy',
        title: 'Endpoint and command policy',
        content: <>
          <Checklist items={[
            'Confirm the scheduled logon task is compatible with your endpoint-management and hardening policy.',
            'Decide whether the generated commands_enabled = true default is appropriate for each deployment group.',
            'Set commands_enabled = false on telemetry-only devices; the heartbeat reports this local decision to Fleet.',
            'Review antivirus, application-control, PowerShell, download, and script-execution policies before remote support testing.',
            'Limit administrator membership because administrators can queue powerful Windows support actions.',
          ]} />
          <p>
            Nevian’s remote action path is intended for administrators. The endpoint’s <code>commands_enabled</code> setting is the local hard stop: when false, the agent continues telemetry but does not accept remote work.
          </p>
        </>,
      },
      {
        id: 'optional-integrations',
        title: 'Optional integrations',
        content: <>
          <DataTable
            columns={['Integration', 'Required for basic Fleet?', 'Preparation']}
            rows={[
              { cells: ['OpenAI', 'No', 'Server-held API key and an approved data-use policy.'] },
              { cells: ['ServiceNow', 'No', 'Instance URL, service credential, assignment group, and network path.'] },
              { cells: ['Microsoft Entra / Graph', 'No', 'Multitenant app registration, consent, redirect URI, and least-required Graph permissions.'] },
              { cells: ['On-prem AD recovery', 'No', 'Separate worker, dry-run validation, replica-set MongoDB, and credential-envelope keys.'] },
              { cells: ['GitHub agent releases', 'No for a preloaded binary', 'Repository coordinates and a read token when private.'] },
            ]}
          />
          <p>Enable integrations independently. A basic device rollout should not depend on ServiceNow, OpenAI, Microsoft Graph, or the on-premises Server Agent.</p>
        </>,
      },
      {
        id: 'pilot-validation',
        title: 'Pilot and production gates',
        content: <>
          <ol>
            <li>Generate one installer for a dedicated test client or pilot group.</li>
            <li>Validate package signature, trust, token expiry, embedded public URL, and agent version.</li>
            <li>Run the API self-test and then perform a normal installation.</li>
            <li>Confirm organization/client attribution, inventory, heartbeat, version, and command-capability state in Fleet.</li>
            <li>Test the local command-disable switch and one low-risk remote action.</li>
            <li>Confirm a revoked token blocks new enrollment and a revoked device cannot self-reinstate.</li>
            <li>Review administrator scope, tenant isolation, logs, monitoring, backup, and incident-response ownership.</li>
            <li>Expand in controlled batches and revoke rollout tokens that are no longer needed.</li>
          </ol>
        </>,
      },
    ],
  },

  devices: {
    group: 'Platform',
    title: 'Devices',
    summary: 'Use Fleet to inspect endpoint identity, inventory, health, software, security context, presence, and remote support activity.',
    sections: [
      {
        id: 'fleet-overview',
        title: 'Fleet overview',
        content: <>
          <p>
            Fleet is the operational view of enrolled endpoints inside the signed-in organization. Device rows are created or refreshed by authenticated agent heartbeats and inventory uploads. Administrators can filter and inspect the estate without accepting an organization identifier from the browser.
          </p>
          <p>
            A device is identified by its registered organization and canonical hostname, with an optional display name chosen when its installer was generated. Re-enrolling the same hostname rotates the credential attached to that device rather than creating a duplicate identity.
          </p>
        </>,
      },
      {
        id: 'reported-context',
        title: 'Reported device context',
        content: <>
          <DataTable
            columns={['Category', 'Examples']}
            rows={[
              { cells: ['Identity', 'Hostname, FQDN, current user, domain, client, device ID, and display name'] },
              { cells: ['Operating system', 'Windows edition, version, build, architecture, boot and uptime context'] },
              { cells: ['Hardware', 'Manufacturer, model, serial, chassis, CPU, memory modules, GPU, mainboard, and BIOS'] },
              { cells: ['Storage and network', 'Disks, volumes, capacity, adapters, addresses, and interface details'] },
              { cells: ['Security posture', 'Secure Boot, TPM, selected Windows security/system events, and local command capability'] },
              { cells: ['Software and power', 'Installed software, battery information where available, and agent version'] },
              { cells: ['Live metrics', 'Recent CPU and memory values reported with the heartbeat'] },
            ]}
          />
          <p>Availability depends on Windows edition, hardware support, permissions, and collector configuration. Treat missing data as unknown until collector health is confirmed.</p>
        </>,
      },
      {
        id: 'freshness-and-presence',
        title: 'Freshness, presence, and reachability',
        content: <>
          <p>
            Nevian uses several related signals rather than one universal online flag. A recent inventory timestamp means a snapshot was received; a recent heartbeat means the agent authenticated and reported; the presence channel supports responsive command delivery; and command eligibility also considers reported capabilities and local policy.
          </p>
          <Callout title="Do not equate a Fleet row with an immediately reachable device">
            <p>An offline endpoint remains useful historical context. Before sending immediate work, check the latest heartbeat/presence indicator and whether remote commands are enabled. Scheduled work may remain queued for a known endpoint that is currently offline.</p>
          </Callout>
        </>,
      },
      {
        id: 'device-detail',
        title: 'Work from device detail',
        content: <>
          <p>Device detail brings the endpoint’s context and support history together. Depending on available data and permissions, administrators can:</p>
          <ul>
            <li>Review hardware, operating system, storage, network, software, and security context.</li>
            <li>Inspect current and previous command activity, output, status, actor, and timestamps.</li>
            <li>Apply tags and compare device attributes across the fleet.</li>
            <li>Review process, service, update, drive, file, screenshot, and software-installation results.</li>
            <li>Use the AI copilot when the optional model integration is configured.</li>
          </ul>
        </>,
      },
      {
        id: 'remote-support',
        title: 'Remote support actions',
        content: <>
          <DataTable
            columns={['Action family', 'Available work', 'Important boundary']}
            rows={[
              { cells: ['Shell', 'PowerShell or cmd scripts, saved templates, and future scheduling', 'Administrative and endpoint policy controls apply'] },
              { cells: ['Processes', 'List processes and terminate a selected process', 'Process identity can change between listing and action'] },
              { cells: ['Services', 'List and control Windows services', 'Some service operations require elevation'] },
              { cells: ['Windows Update', 'Scan, history, and update installation', 'Completion may require restart and extended time'] },
              { cells: ['Files', 'Browse drives/folders and retrieve files up to 1 MB', 'Avoid collecting unnecessary sensitive data'] },
              { cells: ['Visual context', 'Capture a native screenshot', 'Use only under your support and privacy policy'] },
              { cells: ['Software', 'Install a package from an HTTP(S) location', 'Validate source, checksum, publisher, and unattended behavior'] },
            ]}
          />
          <Callout tone="warning" title="Remote scripts are powerful">
            <p>Current administrators can submit arbitrary PowerShell or cmd work. Restrict the admin role, review device activity, protect the control plane, and use the local command switch where remote execution is not appropriate.</p>
          </Callout>
        </>,
      },
      {
        id: 'command-lifecycle',
        title: 'Command lifecycle',
        content: <>
          <ol>
            <li>An authorized administrator creates work for a device in their organization.</li>
            <li>Nevian stores it as pending with the target hostname, actor, timing, shell, and bounded timeout.</li>
            <li>The authenticated device polls and atomically claims the oldest eligible command addressed to itself.</li>
            <li>The agent reports running and terminal results against that same hostname and organization.</li>
            <li>Standard output and error are retained with server-side size bounds for activity review.</li>
          </ol>
          <p>A device cannot claim another endpoint’s queue or submit a result for a command assigned elsewhere. Immediate actions also depend on recent trusted device activity and the <code>device_commands</code> capability reported by the heartbeat.</p>
        </>,
      },
      {
        id: 'device-administration',
        title: 'Device administration',
        content: <>
          <p>
            Revoke a device credential when a computer is retired, reassigned outside the organization, or suspected of compromise. Revocation blocks signed requests for that device identity. Revoking an installer token prevents new enrollments with that package but does not revoke machines that already exchanged it for their own credentials.
          </p>
          <p>
            When reinstalling a legitimate endpoint, keep the same canonical hostname if you want Nevian to rotate and continue the existing device identity. A previously revoked device requires an administrator decision before it can enroll again.
          </p>
          <PageCards items={[
            { slug: 'agent-architecture', title: 'Understand the data path', description: 'See how identity, telemetry, presence, and command delivery fit together.', icon: 'device' },
            { slug: 'security', title: 'Review device security', description: 'Understand the controls and deployment responsibilities around endpoint management.', icon: 'shield' },
          ]} />
        </>,
      },
    ],
  },

  'agent-architecture': {
    group: 'Platform',
    title: 'Agent architecture',
    summary: 'Follow enrollment, per-device identity, signed telemetry, local storage, presence, and remote command delivery through the Windows Desk Agent.',
    sections: [
      {
        id: 'components',
        title: 'Architecture at a glance',
        content: <>
          <p>The Desk Agent is a Windows tray application and collector that communicates with the Nevian control plane. Its main paths are deliberately separate:</p>
          <ul>
            <li><strong>Bootstrap:</strong> a client-scoped enrollment token becomes a machine-scoped credential.</li>
            <li><strong>Telemetry:</strong> inventory, heartbeat metrics, and selected events are uploaded through signed HTTP requests.</li>
            <li><strong>Presence and polling:</strong> the agent maintains responsiveness while retaining command polling as the addressed work-delivery mechanism.</li>
            <li><strong>Local tools:</strong> the tray experience includes help-desk access and a TreeSize-style disk inspection tool.</li>
            <li><strong>Offline tolerance:</strong> event data is buffered locally in SQLite until it can be delivered.</li>
          </ul>
        </>,
      },
      {
        id: 'enrollment-identity',
        title: 'Enrollment and device identity',
        content: <>
          <ol>
            <li>A workspace-generated installer carries organization, client, token, and public control-plane URL configuration.</li>
            <li>The agent submits its token and hostname to the versioned enrollment endpoint.</li>
            <li>The server resolves the token’s organization and client and checks expiry, revocation, optional use limits, and client existence.</li>
            <li>The server creates or rotates a random device ID and 256-bit secret for that hostname.</li>
            <li>The agent persists the response locally and stops using the rollout token for normal traffic.</li>
          </ol>
          <p>The rollout token can join a machine to one client but cannot read Fleet or impersonate a human operator. The device secret is unique to the endpoint and must remain readable by the control plane so it can verify HMAC signatures.</p>
        </>,
      },
      {
        id: 'request-signing',
        title: 'Signed request protocol',
        content: <>
          <p>Every post-enrollment agent request carries four headers:</p>
          <CodeBlock code={hmacHeaders} language="http" label="Agent authentication headers" />
          <p>The HMAC input joins the registered identity, time, nonce, HTTP method, route path, and SHA-256 of the exact transmitted body bytes:</p>
          <CodeBlock code={signatureShape} language="text" label="Canonical signing string" />
          <p>
            The server allows five minutes of clock skew, compares signatures in constant time, and rejects a reused nonce. Method and path binding prevent a signature captured for one operation from being replayed against another. Raw-body hashing avoids cross-language differences such as serializing <code>12.0</code> as <code>12</code>.
          </p>
          <Callout tone="neutral" title="Replay state is process-local">
            <p>Nonce memory is held by the running dashboard process. Multi-instance deployments should preserve sticky behavior or add shared replay storage before treating nonce rejection as a distributed guarantee.</p>
          </Callout>
        </>,
      },
      {
        id: 'telemetry-pipeline',
        title: 'Telemetry pipeline',
        content: <>
          <DataTable
            columns={['Flow', 'Server behavior', 'Scope']}
            rows={[
              { cells: ['Inventory', 'Upserts the latest endpoint snapshot', 'Authenticated organization + canonical hostname'] },
              { cells: ['Heartbeat', 'Refreshes last seen, version, capabilities, CPU, and memory', 'Authenticated device identity'] },
              { cells: ['Events', 'Inserts up to 500 supplied events per request', 'Server-stamped device, hostname, and organization'] },
              { cells: ['Presence', 'Supports responsive online state and command availability', 'Configured control-plane channel'] },
            ]}
          />
          <p>
            Payload claims do not choose a tenant. Once the signature is verified, the server takes organization, client, hostname, and device ID from the registered device record and stamps or routes the write accordingly.
          </p>
        </>,
      },
      {
        id: 'command-delivery',
        title: 'Command delivery',
        content: <>
          <p>
            Remote work is queued in the target organization and hostname. During a signed poll, the server atomically claims one pending command that is due for that endpoint and returns its shell, script, timeout, and optional action kind. Result writes are constrained to the same organization and hostname.
          </p>
          <p>
            Current command trust is the protected control plane, organization-scoped queue, authenticated device poll, administrator authorization, and local <code>commands_enabled</code> switch. Legacy browser-displayed device codes and per-command signatures are not part of the current agent protocol.
          </p>
          <Callout tone="warning" title="Protect the command plane as privileged infrastructure">
            <p>A compromise of administrative access or the command-producing control plane can produce endpoint work. Use least privilege, strong operational controls, endpoint policy, activity review, and network protection accordingly.</p>
          </Callout>
        </>,
      },
      {
        id: 'local-files',
        title: 'Local installation and state',
        content: <>
          <DataTable
            columns={['Location', 'Contents', 'Protection guidance']}
            rows={[
              { cells: [<code>C:\ProgramData\Nevian</code>, 'Installed executable and staged application files', 'Administrators/SYSTEM-managed location'] },
              { cells: [<code>%ProgramData%\Agent\config\agent.toml</code>, 'API URL, collectors, help-desk URL, command policy, and bootstrap metadata', 'Treat enrollment data as temporary secret material'] },
              { cells: [<code>%ProgramData%\Agent\config\device.json</code>, 'Unique device ID and HMAC secret', 'Restricted to SYSTEM and Administrators'] },
              { cells: ['Executable-relative config fallback', 'Development/portable configuration fallback', 'Avoid for centrally managed production installs'] },
              { cells: ['Local SQLite buffer', 'Events awaiting delivery', 'Include in endpoint data-handling policy'] },
            ]}
          />
          <p>The generated installer registers the application to run at logon with highest privileges. Review that operational model against endpoint hardening and support requirements.</p>
        </>,
      },
      {
        id: 'failure-recovery',
        title: 'Failure and recovery behavior',
        content: <>
          <ul>
            <li>Events can wait in the local buffer while the control plane is unavailable.</li>
            <li>A 401 or 403 on a signed request triggers one attempt to re-enroll and rotate the machine credential.</li>
            <li>Administrative revocation remains fail-closed and cannot be undone by that automatic re-enrollment attempt.</li>
            <li>Clock drift outside the five-minute signing window produces authentication failure.</li>
            <li>Reinstallation with the same hostname rotates its secret and increments re-enrollment visibility on the server.</li>
          </ul>
          <PageCards items={[
            { slug: 'authentication', title: 'Implement authentication correctly', description: 'Separate human, endpoint, and Microsoft integration credentials.', icon: 'shield' },
            { slug: 'troubleshooting', title: 'Diagnose agent failures', description: 'Work through network, enrollment, signature, heartbeat, and command checks.', icon: 'bolt' },
          ]} />
        </>,
      },
    ],
  },

  automations: {
    group: 'Platform',
    title: 'Automations',
    summary: 'Capture support knowledge as versioned runbooks, match ticket rules, simulate outcomes, and surface suggestions in shadow mode.',
    sections: [
      {
        id: 'current-mode',
        title: 'Current automation model',
        content: <>
          <Callout title="Automations currently operate in shadow mode">
            <p>Rules evaluate tickets and published runbooks can be suggested, but Nevian does not autonomously mutate tickets or execute endpoint remediation from these rules. Operators remain in control of the resulting work.</p>
          </Callout>
          <p>
            The automation workspace turns repeated support knowledge into reviewable runbooks and rules. Administrators can capture resolution steps from real ticket activity, publish immutable versions, evaluate ticket conditions, simulate historical matches, and inspect suggestions for a ticket.
          </p>
        </>,
      },
      {
        id: 'runbooks',
        title: 'Runbooks',
        content: <>
          <p>A runbook is the named, categorized container for a support procedure. Its actual instructions live in versions so teams can separate draft work from published guidance.</p>
          <DataTable
            columns={['Property', 'Behavior']}
            rows={[
              { cells: ['Name and description', 'Describe the procedure and intended outcome.'] },
              { cells: ['Category and keywords', 'Help matching and operator discovery.'] },
              { cells: ['Steps', 'Up to 50 sanitized instruction or approved action-definition steps.'] },
              { cells: ['Mode', 'Always shadow in the current implementation.'] },
              { cells: ['Source ticket', 'Optional link back to the incident from which steps were captured.'] },
              { cells: ['Current version', 'A draft under edit or the latest published version.'] },
            ]}
          />
        </>,
      },
      {
        id: 'capture-knowledge',
        title: 'Capture a resolution from a ticket',
        content: <>
          <ol>
            <li>Open a resolved or well-understood ticket.</li>
            <li>Select relevant activity entries or messages that explain the diagnostic and resolution sequence.</li>
            <li>Create a draft runbook and review the generated instruction steps.</li>
            <li>Remove customer-specific details, credentials, temporary values, or steps that should not be generalized.</li>
            <li>Add category and matching keywords, then test the procedure with another operator.</li>
          </ol>
          <p>
            Selection is bounded to 50 source entries. Nevian refuses message content that resembles a temporary password or explicit password disclosure, reducing the chance that secret-bearing ticket text becomes durable runbook material.
          </p>
        </>,
      },
      {
        id: 'version-lifecycle',
        title: 'Draft and published versions',
        content: <>
          <ol>
            <li>A newly created runbook begins with draft version 1.</li>
            <li>Administrators can update steps and the change note while that version remains a draft.</li>
            <li>Publishing freezes the version and makes it eligible for shadow-rule suggestions.</li>
            <li>A later change starts a new draft copied from the latest version.</li>
            <li>Previously published versions remain immutable records of what guidance existed at that point.</li>
          </ol>
          <Callout tone="neutral" title="Published-version immutability is feature-scoped">
            <p>The API refuses edits to a published runbook version. This is not a claim that every Nevian database record is globally immutable or tamper-evident.</p>
          </Callout>
        </>,
      },
      {
        id: 'rules',
        title: 'Automation rules',
        content: <>
          <p>
            A rule references a published runbook, starts on <code>ticket_created</code> or <code>ticket_updated</code>, and contains up to 12 normalized conditions. Rules can be enabled or disabled, but their execution mode remains shadow.
          </p>
          <p>
            Conditions can match supported ticket fields and operators exposed by the automation catalog. Use narrow, explainable criteria first—for example category plus a known phrase—then broaden only after simulation demonstrates acceptable precision.
          </p>
        </>,
      },
      {
        id: 'simulation',
        title: 'Simulation and suggestions',
        content: <>
          <p>
            Simulation evaluates a bounded ticket sample and reports how many tickets were examined and matched, with representative match details. The result and actor are recorded on the rule and in automation audit activity. Simulation does not modify the sampled tickets.
          </p>
          <p>
            Ticket suggestions evaluate enabled shadow rules against one ticket and return matching published runbooks. The support operator can use that guidance while retaining responsibility for verification and execution.
          </p>
          <Checklist items={[
            'Test rules against varied historical tickets, not only the ticket that inspired the runbook.',
            'Look for ambiguous category names, broad keywords, and conditions that become true on routine updates.',
            'Treat a match as a recommendation, not evidence that the runbook is safe for every environment.',
            'Review automation audit events after rule, version, or condition changes.',
          ]} />
        </>,
      },
      {
        id: 'action-catalog',
        title: 'Action definitions and boundaries',
        content: <>
          <p>
            The current catalog can describe approved step types for adding a ticket note, setting priority, changing category, adding a tag, or assigning work. These definitions make procedures structured and reviewable; shadow rules do not execute those mutations automatically.
          </p>
          <DataTable
            columns={['Capability', 'Current status']}
            rows={[
              { cells: ['Versioned runbooks', <Status>Available</Status>] },
              { cells: ['Ticket-created / ticket-updated matching', <Status>Available</Status>] },
              { cells: ['Historical simulation', <Status>Available</Status>] },
              { cells: ['Ticket suggestions', <Status>Available</Status>] },
              { cells: ['Automatic ticket mutation from rules', <Status tone="planned">Not enabled</Status>] },
              { cells: ['Automatic endpoint remediation from rules', <Status tone="planned">Not implemented</Status>] },
            ]}
          />
          <PageCards items={[
            { slug: 'audit-trail', title: 'Review automation activity', description: 'Understand which runbook and rule administration events are recorded.', icon: 'document' },
            { slug: 'security', title: 'Operate safely', description: 'Apply least privilege and human review to powerful support workflows.', icon: 'shield' },
          ]} />
        </>,
      },
    ],
  },

  'identity-and-access': {
    group: 'Platform',
    title: 'Identity & access',
    summary: 'Understand human sign-in, organization membership, admin and user roles, invitations, device assignment, and integration identities.',
    sections: [
      {
        id: 'human-sign-in',
        title: 'Human sign-in',
        content: <>
          <p>
            Nevian’s browser workspace currently uses Google sign-in through Firebase. The browser obtains a Firebase ID token and sends it as a Bearer token to application APIs. The server verifies the token with Google Identity Toolkit and resolves the Nevian profile stored for that user.
          </p>
          <p>
            Firebase web configuration is public client configuration; it is not a Nevian API secret. Authorization comes from verified token identity plus the server-side profile, onboarding state, role, and organization boundary.
          </p>
        </>,
      },
      {
        id: 'organization-boundary',
        title: 'Organization boundary',
        content: <>
          <p>
            Each account belongs to one organization. A brand-new account initially founds an organization keyed to its own user identity. After invitation or administrative movement, its organization determines which tenant-scoped clients, devices, tickets, departments, runbooks, and integration data it can reach.
          </p>
          <p>
            Routes that need tenant data require an organization and select the organization’s database from the verified profile. A caller cannot widen access by sending an arbitrary project or organization identifier from the browser.
          </p>
          <Callout title="The project selector is server-authoritative">
            <p>The current selector returns the signed-in account’s one permitted organization scope. Local browser state does not create additional customer scopes.</p>
          </Callout>
        </>,
      },
      {
        id: 'roles',
        title: 'Roles and onboarding state',
        content: <>
          <DataTable
            columns={['Role/state', 'Purpose', 'Typical access']}
            rows={[
              { cells: [<strong>Administrator</strong>, 'Operates the organization', 'Fleet administration, members, onboarding, runbooks/rules, commands, and integrations'] },
              { cells: [<strong>User</strong>, 'Uses the service-desk experience', 'User-facing ticket workflows and assigned-device context'] },
              { cells: [<strong>Not onboarded</strong>, 'Authenticated but setup incomplete', 'Only the first-run setup path and limited profile operations'] },
              { cells: [<strong>External member</strong>, 'Joined another organization through invitation', 'The role granted by that accepted invitation'] },
            ]}
          />
          <p>Role checks are enforced by server middleware on administrative routes. UI visibility is useful guidance but is not the authorization boundary.</p>
        </>,
      },
      {
        id: 'first-run',
        title: 'First-run onboarding',
        content: <>
          <p>
            First-run setup happens once per account. A founder can choose the administrator role for the new organization. A normal user must select a known device hostname in that same organization. After onboarding, role changes belong to an administrator rather than the user repeating setup.
          </p>
          <p>
            Device assignment is validated against the organization’s inventory. Administrators are not bound to one device; when a member is promoted to administrator, any user-device assignment is cleared.
          </p>
        </>,
      },
      {
        id: 'invitations',
        title: 'Invitations',
        content: <>
          <ol>
            <li>An administrator creates an invitation for an exact email address and chooses the eventual admin or user role.</li>
            <li>The invitation remains pending for up to 14 days and is visible in the Nevian inbox flow.</li>
            <li>An existing user can accept it; a new user first signs in with the invited verified email.</li>
            <li>Acceptance takes the role from the invitation, not from caller-supplied role data.</li>
            <li>The resulting profile is marked when it represents an external member of the organization.</li>
          </ol>
          <Callout tone="neutral" title="Invitations are in-product">
            <p>The current implementation does not send invitation email itself. Share the onboarding instruction through your approved communication channel.</p>
          </Callout>
        </>,
      },
      {
        id: 'member-administration',
        title: 'Member administration',
        content: <>
          <Checklist items={[
            'Review organization members regularly, especially accounts marked external.',
            'Grant administrator only to people who need Fleet, command, automation, or integration administration.',
            'Assign users only to devices found inside the same organization.',
            'Promote another administrator before demoting or moving the last administrator; Nevian refuses a change that would leave no admin.',
            'Use exact email lookup rather than broad user discovery when adding an existing account.',
            'Remove or change access promptly when employment, supplier, or customer relationships change.',
          ]} />
        </>,
      },
      {
        id: 'non-human-identities',
        title: 'Device and integration identities',
        content: <>
          <p>
            A Desk Agent does not use a human session. It enrolls once and signs requests with a unique device credential. A connected Microsoft tenant uses a separate multitenant OAuth/admin-consent relationship. Password-recovery operations add fresh-login or MFA evidence specific to that workflow.
          </p>
          <DataTable
            columns={['Capability', 'Current status']}
            rows={[
              { cells: ['Google/Firebase human sign-in', <Status>Available</Status>] },
              { cells: ['Admin and user roles', <Status>Available</Status>] },
              { cells: ['Organization invitations', <Status>Available</Status>] },
              { cells: ['Per-device machine identity', <Status>Available</Status>] },
              { cells: ['SAML enterprise SSO', <Status tone="planned">Not implemented</Status>] },
              { cells: ['SCIM provisioning', <Status tone="planned">Not implemented</Status>] },
              { cells: ['Public service accounts / API keys', <Status tone="planned">Not implemented</Status>] },
            ]}
          />
          <PageCards items={[
            { slug: 'authentication', title: 'Authentication details', description: 'See how browser, device, and Microsoft credentials are validated.', icon: 'shield' },
            { slug: 'audit-trail', title: 'Access-related records', description: 'Review invitation, membership, command, and recovery activity coverage.', icon: 'document' },
          ]} />
        </>,
      },
    ],
  },

  'audit-trail': {
    group: 'Platform',
    title: 'Audit trail',
    summary: 'Understand which ticket, automation, device, identity, and recovery actions Nevian records—and the limits of current audit coverage.',
    sections: [
      {
        id: 'coverage',
        title: 'Current audit coverage',
        content: <>
          <p>
            Nevian records operational history where work occurs instead of exposing one universal audit ledger. Ticket changes remain with the ticket; runbook and rule administration has a dedicated automation event collection; device actions and results appear in device activity; and identity-recovery attempts have their own records.
          </p>
          <Callout title="Feature records, not a global immutable ledger">
            <p>Current audit data is useful for operations and review, but Nevian does not yet provide one append-only, hash-chained, tamper-evident event stream covering every read and write.</p>
          </Callout>
        </>,
      },
      {
        id: 'ticket-activity',
        title: 'Ticket activity',
        content: <>
          <p>
            Ticket changes append structured activity entries to the ticket timeline. Relevant automation-related ticket events are also copied into automation audit records. Activity can include actor, event type, source, text, metadata, importance, and occurrence time depending on the workflow.
          </p>
          <p>
            Ticket messages and activity selected for runbook capture retain source references. Secret-looking password content is blocked from capture into a reusable runbook.
          </p>
        </>,
      },
      {
        id: 'automation-events',
        title: 'Automation administration',
        content: <>
          <DataTable
            columns={['Recorded action', 'Typical metadata']}
            rows={[
              { cells: ['Runbook created or updated', 'Actor, runbook ID, name, timestamp'] },
              { cells: ['Draft version updated', 'Runbook ID, version ID, version number'] },
              { cells: ['Runbook published', 'Runbook/version IDs and published version'] },
              { cells: ['Rule created, changed, or deleted', 'Rule ID, linked runbook, actor'] },
              { cells: ['Rule simulated', 'Rule ID, evaluated and matched counts'] },
              { cells: ['Resolution captured', 'Source ticket and number of generated steps'] },
            ]}
          />
          <p>Published runbook versions reject later edits. Administrative records remain ordinary protected database documents rather than a cryptographically sealed ledger.</p>
        </>,
      },
      {
        id: 'device-activity',
        title: 'Device activity',
        content: <>
          <p>
            Device command and structured-action views retain the initiating actor, target, action or script preview, creation/claim/completion timing, status, exit code, and bounded output where applicable. This allows an administrator to trace what Nevian queued and what the endpoint reported.
          </p>
          <Checklist items={[
            'Confirm the target hostname and client before starting work.',
            'Provide a meaningful reason or ticket reference where the workflow supports it.',
            'Review failed, timed-out, and unusually long-running actions.',
            'Treat output as potentially sensitive endpoint data and limit who can access it.',
            'Correlate high-impact work with your change-management or incident record.',
          ]} />
        </>,
      },
      {
        id: 'identity-recovery',
        title: 'Identity and recovery records',
        content: <>
          <p>
            Microsoft Entra and on-premises password-recovery attempts have dedicated records that can include requester, target account, proof or override method, result, block reason, operator reason, and timestamp. The administrative UI exposes a recent bounded view for operational review.
          </p>
          <p>
            Invitation and membership documents also retain actors and timestamps relevant to their lifecycle. These records do not currently form a consolidated “all access changes” report.
          </p>
        </>,
      },
      {
        id: 'limitations',
        title: 'Known limitations',
        content: <>
          <DataTable
            columns={['Capability', 'Current state']}
            rows={[
              { cells: ['One global audit search', <Status tone="planned">Not available</Status>] },
              { cells: ['Every data read recorded', <Status tone="planned">Not implemented</Status>] },
              { cells: ['Append-only database enforcement', <Status tone="planned">Not implemented</Status>] },
              { cells: ['Integrity hash or hash chain', <Status tone="planned">Not implemented</Status>] },
              { cells: ['SIEM streaming', <Status tone="planned">Not implemented</Status>] },
              { cells: ['CSV audit export', <Status tone="planned">Not implemented</Status>] },
              { cells: ['Feature-specific activity', <Status>Available</Status>] },
            ]}
          />
          <p>Define infrastructure-level database protection, access logging, backup retention, and SIEM collection separately when regulatory or forensic requirements exceed the application’s current records.</p>
        </>,
      },
      {
        id: 'review-routine',
        title: 'Recommended review routine',
        content: <>
          <ol>
            <li>Review administrators and external organization members.</li>
            <li>Review new or changed runbooks and rules, including recent simulations.</li>
            <li>Inspect failed, timed-out, or high-impact device actions.</li>
            <li>Review password-recovery attempts and blocked privileged-account operations.</li>
            <li>Correlate suspicious activity with identity-provider, reverse-proxy, database, and endpoint logs.</li>
            <li>Export or retain records at the infrastructure layer according to your policy until a consolidated product export exists.</li>
          </ol>
          <PageCards items={[
            { slug: 'security', title: 'Security model', description: 'Review platform controls, responsibilities, and claims Nevian does not make.', icon: 'shield' },
            { slug: 'identity-and-access', title: 'Access administration', description: 'Understand organizations, roles, invitations, and identities.', icon: 'document' },
          ]} />
        </>,
      },
    ],
  },

  'api-overview': {
    group: 'API & integrations',
    title: 'API overview',
    summary: 'Understand Nevian’s current internal application APIs and the versioned endpoint-agent contract before building an integration.',
    sections: [
      {
        id: 'api-status',
        title: 'Current API status',
        content: <>
          <Callout title="Nevian does not currently expose a supported public customer API">
            <p>The browser application uses internal <code>/api/*</code> routes, and the Desk Agent uses a versioned <code>/api/agent/v1/*</code> contract. There is no public API-key issuance, OAuth client-credentials flow, OpenAPI document, SDK, or compatibility promise for external browser-route integrations.</p>
          </Callout>
          <p>
            Treat internal workspace routes as implementation details that can evolve with the web application. The agent routes are explicitly versioned because released endpoint binaries need a stable protocol, but they are authenticated machine operations rather than a general customer automation API.
          </p>
        </>,
      },
      {
        id: 'api-families',
        title: 'API families',
        content: <>
          <DataTable
            columns={['Family', 'Consumers', 'Authentication', 'Support level']}
            rows={[
              { cells: [<code>/api/auth/*</code>, 'Nevian browser', 'Firebase ID token', 'Internal application API'] },
              { cells: [<code>/api/onboarding/*</code>, 'Administrator UI and generated installer', 'Firebase admin session or enrollment token by route', 'Internal deployment API'] },
              { cells: [<code>/api/agent/v1/*</code>, 'Released Desk Agent', 'Enrollment token, then per-device HMAC', 'Versioned machine contract'] },
              { cells: ['Runbook and automation routes', 'Administrator UI', 'Firebase admin session', 'Internal application API'] },
              { cells: ['Fleet, ticket, user, Entra, and command routes', 'Nevian browser', 'Firebase token plus route guards', 'Internal application API'] },
            ]}
          />
        </>,
      },
      {
        id: 'agent-endpoints',
        title: 'Versioned agent endpoints',
        content: <>
          <DataTable
            columns={['Method and path', 'Purpose', 'Credential']}
            rows={[
              { cells: [<code>POST /api/agent/v1/enroll</code>, 'Exchange rollout token for device identity', 'Enrollment token in JSON body'] },
              { cells: [<code>POST /api/agent/v1/inventory</code>, 'Upload latest inventory snapshot', 'Signed device request'] },
              { cells: [<code>POST /api/agent/v1/heartbeat</code>, 'Refresh presence, version, capability, and metrics', 'Signed device request'] },
              { cells: [<code>POST /api/agent/v1/events</code>, 'Upload a batch of selected endpoint events', 'Signed device request'] },
              { cells: [<code>GET /api/agent/v1/commands</code>, 'Claim one due command for this endpoint', 'Signed device request'] },
              { cells: [<code>POST /api/agent/v1/commands/:id/result</code>, 'Report running or terminal command result', 'Signed device request'] },
            ]}
          />
          <p>These routes derive tenant and hostname from the registered device. A client-supplied organization or hostname does not redirect an authenticated write.</p>
        </>,
      },
      {
        id: 'request-response',
        title: 'Request and response conventions',
        content: <>
          <ul>
            <li>Application and agent payloads are JSON unless a route explicitly downloads an installer or artifact.</li>
            <li>Successful writes generally return an object containing <code>ok: true</code> or the created resource.</li>
            <li>Errors return JSON with an <code>error</code> message and sometimes a machine-readable <code>code</code>.</li>
            <li>Agent body signatures cover the exact transmitted bytes; do not parse and reserialize before calculating the digest.</li>
            <li>List shapes, pagination, filters, and lifecycle guarantees vary across internal browser routes and are not yet a public contract.</li>
          </ul>
          <Callout tone="warning" title="Do not copy the old template examples">
            <p>Routes such as <code>/v1/enrollment-tokens</code> and <code>/v1/devices</code>, and an environment variable named <code>NEVIAN_API_KEY</code>, are not implemented by the current service.</p>
          </Callout>
        </>,
      },
      {
        id: 'integration-options',
        title: 'Supported integration paths',
        content: <>
          <p>Before calling an internal route, prefer a supported product integration:</p>
          <ul>
            <li><strong>Microsoft Entra / Graph</strong> for directory context and approved recovery workflows.</li>
            <li><strong>ServiceNow</strong> for configured service-management interoperability.</li>
            <li><strong>OpenAI</strong> for optional AI-assisted workspace capabilities.</li>
            <li><strong>GitHub release artifacts</strong> for controlled agent binary provisioning.</li>
            <li><strong>Server Agent</strong> for the narrowly scoped on-premises AD recovery queue.</li>
          </ul>
          <p>If a new integration requires stable customer automation, define authentication, authorization scopes, resource schemas, pagination, idempotency, rate limits, versioning, and audit behavior before treating internal endpoints as public.</p>
        </>,
      },
      {
        id: 'api-safety',
        title: 'API safety checklist',
        content: <>
          <Checklist items={[
            'Use the correct identity type: human Firebase token, enrollment token, device HMAC, or Microsoft OAuth proof.',
            'Keep server credentials and device secrets out of browser code, logs, screenshots, and support tickets.',
            'Require HTTPS at the deployment edge and validate endpoint clocks.',
            'Respect organization, role, onboarding, and device boundaries rather than adding client-provided scope.',
            'Handle 401, 403, 409, 429, and 5xx responses without unsafe automatic retries.',
            'Do not depend on undocumented internal response fields for an external production integration.',
          ]} />
          <PageCards items={[
            { slug: 'authentication', title: 'Authentication', description: 'Learn the browser, device, and Microsoft identity protocols.', icon: 'shield' },
            { slug: 'rate-limits', title: 'Limits and backoff', description: 'Review enforced bounds and safe client retry behavior.', icon: 'bolt' },
          ]} />
        </>,
      },
    ],
  },

  authentication: {
    group: 'API & integrations',
    title: 'Authentication',
    summary: 'Use the correct authentication protocol for human sessions, endpoint agents, enrollment, and Microsoft integration workflows.',
    sections: [
      {
        id: 'identity-types',
        title: 'Authentication types',
        content: <>
          <DataTable
            columns={['Caller', 'Credential', 'Use']}
            rows={[
              { cells: ['Human browser session', 'Firebase ID token as Bearer token', 'Workspace and administrative APIs'] },
              { cells: ['Unenrolled Windows agent', 'Client-scoped enrollment token', 'One-time device credential exchange'] },
              { cells: ['Enrolled Windows agent', 'Device ID + HMAC secret', 'Inventory, heartbeat, events, and command traffic'] },
              { cells: ['Connected Microsoft tenant', 'OAuth consent/tokens', 'Graph-backed identity context and operations'] },
              { cells: ['Password reset requester', 'Fresh-login/MFA proof or governed override', 'Additional authorization for recovery'] },
            ]}
          />
          <p>No current flow issues a general-purpose Nevian customer API key. A token valid for one row in this table must not be reused as another identity type.</p>
        </>,
      },
      {
        id: 'browser-auth',
        title: 'Browser authentication',
        content: <>
          <p>
            After Google sign-in, the browser sends the Firebase ID token in the standard authorization header. The server verifies it, resolves or refreshes the user profile, and applies onboarding, organization, and role guards for the requested route.
          </p>
          <CodeBlock code={'Authorization: Bearer <firebase-id-token>'} language="http" label="Browser API header" />
          <p>
            Tokens identify the Google/Firebase account; server-side profile data decides Nevian organization and role. Administrative routes require an onboarded profile whose role is <code>admin</code>.
          </p>
          <Callout tone="neutral" title="Server-Sent Events are a special browser case">
            <p>Native EventSource cannot set an authorization header, so the Fleet stream may receive the Firebase token in its URL query. Require HTTPS, avoid referrer leakage, and redact query strings in proxy and observability logs.</p>
          </Callout>
        </>,
      },
      {
        id: 'enrollment-auth',
        title: 'Enrollment authentication',
        content: <>
          <p>
            The installer’s token is a bootstrap credential scoped to one organization and client. The enrollment endpoint checks that the token exists, has not been revoked, has not expired, has not reached an optional use cap, and still points to a live client.
          </p>
          <p>
            A successful response returns the device ID and secret once. Workspace-generated rollout tokens currently expire after 30 days. Revoking one stops future exchanges but does not invalidate unique credentials already issued to enrolled machines.
          </p>
          <Callout tone="warning" title="A shared rollout token can rotate a known hostname while valid">
            <p>Reinstallation is a normal use case, so enrolling the same hostname rotates its device secret and records the re-enrollment. Protect rollout packages and revoke them when a batch is complete.</p>
          </Callout>
        </>,
      },
      {
        id: 'device-hmac',
        title: 'Device HMAC authentication',
        content: <>
          <CodeBlock code={hmacHeaders} language="http" label="Required signed-request headers" />
          <p>The signature is lowercase hexadecimal HMAC-SHA256 over this newline-delimited input:</p>
          <CodeBlock code={signatureShape} language="text" label="Signing input" />
          <Checklist items={[
            'Use the exact HTTP method in uppercase and the exact route path.',
            'Hash the transmitted body bytes; for a bodyless request, hash the literal JSON value null.',
            'Use a fresh unpredictable nonce for every request.',
            'Send Unix time in milliseconds and keep endpoint time synchronized.',
            'Never send or log the device secret itself.',
          ]} />
        </>,
      },
      {
        id: 'verification-failures',
        title: 'Verification and failure behavior',
        content: <>
          <DataTable
            columns={['Failure', 'Typical response', 'Action']}
            rows={[
              { cells: ['Missing signed headers', '401 unsigned request', 'Confirm the device credential loaded and headers were attached.'] },
              { cells: ['Clock outside ±5 minutes', '401 stale or skewed timestamp', 'Synchronize Windows time and retry once.'] },
              { cells: ['Unknown or revoked identity', '401 unknown or revoked device', 'Check Fleet revocation; do not bypass an administrative revoke.'] },
              { cells: ['Wrong secret/body/method/path', '401 bad signature', 'Compare canonical bytes and signing string construction.'] },
              { cells: ['Repeated nonce', '401 nonce already used', 'Generate a new nonce per attempt.'] },
              { cells: ['Expired/revoked rollout token', '403 enrollment failure', 'Generate a new authorized installer package.'] },
            ]}
          />
          <p>The Desk Agent makes one re-enrollment attempt after a signed 401/403. That can recover a rotated or missing credential but cannot reinstate a device the server marks revoked.</p>
        </>,
      },
      {
        id: 'microsoft-auth',
        title: 'Microsoft integration authentication',
        content: <>
          <p>
            Microsoft Entra connection uses a separate multitenant OAuth and admin-consent path for Graph. Connecting a tenant does not sign users into the Nevian workspace and does not turn a Graph token into an endpoint credential.
          </p>
          <p>
            Cloud password reset adds a PKCE/fresh-login flow and evaluates MFA evidence where required. Governed administrative override and on-premises recovery have their own checks and audit records. Keep Microsoft client secrets and any credential-envelope private key on the control plane only.
          </p>
        </>,
      },
      {
        id: 'credential-handling',
        title: 'Credential handling',
        content: <>
          <Checklist items={[
            'Store Firebase/Microsoft/server integration secrets only in protected server configuration.',
            'Restrict the device credential file to SYSTEM and Administrators.',
            'Never put a MongoDB URI or shared control-plane secret in an endpoint installer.',
            'Rotate an endpoint identity by controlled re-enrollment; revoke it when the machine is retired or compromised.',
            'Remove rollout packages from shared locations and revoke unused tokens after deployment.',
            'Redact authorization headers, enrollment tokens, device secrets, reset credentials, and query-string tokens from logs.',
          ]} />
          <PageCards items={[
            { slug: 'agent-architecture', title: 'Agent protocol', description: 'Trace how signed identity scopes every endpoint operation.', icon: 'device' },
            { slug: 'security', title: 'Security responsibilities', description: 'Review transport, control-plane, endpoint, and administrator controls.', icon: 'shield' },
          ]} />
        </>,
      },
    ],
  },

  webhooks: {
    group: 'API & integrations',
    title: 'Webhooks',
    summary: 'Learn the current integration and real-time options while Nevian does not yet provide customer-configurable outbound webhooks.',
    sections: [
      {
        id: 'availability',
        title: 'Availability',
        content: <>
          <Callout tone="warning" title="Customer-configurable webhooks are not currently supported">
            <p>Nevian does not yet expose webhook endpoint registration, signing secrets, an event catalog, delivery retries, delivery logs, or a webhook settings screen. Do not design a production dependency around a placeholder webhook contract.</p>
          </Callout>
          <p>This page exists so every documentation topic has an explicit status and so Server-Sent Events, agent polling, and direct third-party calls are not mistakenly described as webhooks.</p>
        </>,
      },
      {
        id: 'current-realtime',
        title: 'Current real-time mechanisms',
        content: <>
          <DataTable
            columns={['Mechanism', 'Direction', 'Purpose', 'Webhook?']}
            rows={[
              { cells: ['Fleet Server-Sent Events', 'Nevian → signed-in browser', 'Live browser updates', 'No'] },
              { cells: ['Agent heartbeat/presence', 'Endpoint ↔ control plane', 'Health, presence, and responsiveness', 'No'] },
              { cells: ['Agent command polling', 'Endpoint → control plane', 'Claim work addressed to the endpoint', 'No'] },
              { cells: ['Microsoft Graph calls', 'Nevian → Microsoft', 'Configured identity operations', 'No'] },
              { cells: ['ServiceNow calls', 'Nevian → ServiceNow', 'Configured service-management integration', 'No'] },
              { cells: ['GitHub release fetch', 'Nevian → artifact host', 'Provision a released Desk Agent binary', 'No'] },
            ]}
          />
        </>,
      },
      {
        id: 'integration-alternatives',
        title: 'Integration alternatives',
        content: <>
          <ul>
            <li>Use the built-in Microsoft, ServiceNow, OpenAI, and release-artifact integrations for their intended workflows.</li>
            <li>Use Fleet’s authenticated event stream for live browser presentation rather than server-to-server delivery.</li>
            <li>Use shadow automation suggestions inside Nevian for ticket guidance rather than assuming an external event callback.</li>
            <li>For a required server-to-server integration, define a narrow purpose with the Nevian team rather than coupling to internal browser routes.</li>
          </ul>
        </>,
      },
      {
        id: 'future-contract',
        title: 'What a future webhook contract must define',
        content: <>
          <p>A production webhook feature should not ship as only an endpoint URL. It should define:</p>
          <Checklist items={[
            'A stable, versioned event catalog and payload schema.',
            'Organization-scoped endpoint registration and least-privilege event subscriptions.',
            'HMAC or asymmetric delivery signatures with timestamp and replay protection.',
            'Secret rotation without an interruption in delivery verification.',
            'Bounded retries, exponential backoff, timeout, dead-letter behavior, and manual replay.',
            'Delivery history that redacts secrets and records status, latency, and response classification.',
            'SSRF protection, HTTPS requirements, destination validation, and egress controls.',
          ]} />
          <p>No date or compatibility promise is implied until such a contract is implemented and published.</p>
        </>,
      },
      {
        id: 'do-not-use',
        title: 'Avoid unsupported workarounds',
        content: <>
          <Callout tone="neutral" title="Internal routes are not a webhook substitute">
            <p>Do not scrape Fleet, poll undocumented browser endpoints, expose Firebase tokens to a relay, or write directly to Nevian’s database to synthesize event delivery. Those approaches bypass support, versioning, and authorization boundaries.</p>
          </Callout>
          <PageCards items={[
            { slug: 'api-overview', title: 'API status', description: 'Understand which HTTP surfaces are internal and which are agent-versioned.', icon: 'document' },
            { slug: 'automations', title: 'Shadow automations', description: 'Use runbooks, rule simulation, and ticket suggestions within Nevian.', icon: 'bolt' },
          ]} />
        </>,
      },
    ],
  },

  'rate-limits': {
    group: 'API & integrations',
    title: 'Rate limits',
    summary: 'Review Nevian’s current feature-specific limits, payload bounds, authentication windows, and safe retry behavior.',
    sections: [
      {
        id: 'current-contract',
        title: 'Current rate-limit contract',
        content: <>
          <Callout title="There is no universal requests-per-minute limit today">
            <p>Nevian does not currently publish a general API quota or standard <code>X-RateLimit-*</code> headers. Some sensitive workflows and collection endpoints enforce their own bounds. Internal APIs may gain additional protection as the service evolves.</p>
          </Callout>
          <p>Do not infer an unlimited service from the absence of a global quota. Batch responsibly, cache read-only context, avoid tight polling loops, and treat 429 and transient 5xx responses as signals to slow down.</p>
        </>,
      },
      {
        id: 'enforced-limits',
        title: 'Enforced feature limits',
        content: <>
          <DataTable
            columns={['Area', 'Current bound', 'Behavior']}
            rows={[
              { cells: ['Agent event ingest', '500 events per request', 'Additional entries in the supplied batch are not inserted by that request.'] },
              { cells: ['Signed request time', '±5 minutes', 'Requests outside the clock-skew window return 401.'] },
              { cells: ['Nonce reuse', 'One use during validity memory', 'A repeated nonce is rejected as authentication failure.'] },
              { cells: ['Pending invitations', '100 per organization', 'A new invitation can return 429 when the pending cap is reached.'] },
              { cells: ['Password resets per target', '3 successful resets per rolling 24 hours', 'Further reset attempts are blocked by the recovery policy.'] },
              { cells: ['Password reset requester', '10 attempts per hour', 'Additional attempts are blocked.'] },
              { cells: ['Command stdout/stderr', '200,000 characters each', 'Server truncates stored output beyond the bound.'] },
              { cells: ['File retrieval', 'Up to 1 MB', 'Use another approved channel for larger files.'] },
            ]}
          />
        </>,
      },
      {
        id: 'enrollment-and-automation',
        title: 'Lifecycle and content bounds',
        content: <>
          <ul>
            <li>Workspace-generated enrollment tokens expire after 30 days. This is a credential lifetime, not a request-rate quota.</li>
            <li>The agent enrollment API honors <code>maxUses</code> when a token producer sets one; normal workspace generation currently does not assign a use cap.</li>
            <li>Runbooks are limited to 50 steps.</li>
            <li>Automation rules are limited to 12 normalized conditions.</li>
            <li>Ticket-to-runbook capture considers at most 50 selected activity/message entries.</li>
            <li>List and simulation routes use their own bounded result windows; they do not constitute a public pagination contract.</li>
          </ul>
        </>,
      },
      {
        id: 'retry-guidance',
        title: 'Retry and backoff guidance',
        content: <>
          <ol>
            <li>Retry only idempotent reads or operations whose idempotency you can establish.</li>
            <li>For 429, honor <code>Retry-After</code> if a route supplies it; otherwise use exponential backoff with jitter.</li>
            <li>For transient 5xx or network errors, start with a short delay and cap both attempts and maximum delay.</li>
            <li>Do not retry 400, 401, 403, or 404 in a loop. Correct input, identity, authorization, scope, or resource state first.</li>
            <li>After a nonce-bearing signed request, generate a fresh timestamp, nonce, body digest, and signature for every retry.</li>
            <li>Queue endpoint telemetry locally instead of creating synchronized retry storms after an outage.</li>
          </ol>
          <Callout tone="warning" title="Be careful retrying password and command actions">
            <p>Privileged actions can have side effects even if the response is lost. Check recorded state before repeating an operation.</p>
          </Callout>
        </>,
      },
      {
        id: 'capacity-planning',
        title: 'Capacity planning',
        content: <>
          <Checklist items={[
            'Pilot with realistic inventory size, event volume, device count, and reconnect behavior.',
            'Monitor application latency, MongoDB storage and indexes, reverse-proxy saturation, and authentication failures.',
            'Stagger large endpoint rollouts so enrollment and first full inventory do not arrive simultaneously.',
            'Keep event channel and event ID collection scoped to operational need.',
            'Coordinate with the Nevian team before building sustained server-to-server traffic against internal APIs.',
          ]} />
          <PageCards items={[
            { slug: 'api-overview', title: 'API boundaries', description: 'Review current internal and agent HTTP contracts.', icon: 'document' },
            { slug: 'troubleshooting', title: 'Failure diagnosis', description: 'Distinguish throttling, authentication, network, and service errors.', icon: 'bolt' },
          ]} />
        </>,
      },
    ],
  },

  troubleshooting: {
    group: 'Resources',
    title: 'Troubleshooting',
    summary: 'Diagnose control-plane startup, installer generation, enrollment, signed requests, Fleet freshness, commands, and identity integrations.',
    sections: [
      {
        id: 'triage',
        title: 'Start with the failing boundary',
        content: <>
          <ol>
            <li><strong>Define the scope.</strong> One endpoint, one client, one organization, or every user?</li>
            <li><strong>Identify the last successful stage.</strong> Sign-in, installer generation, installation, enrollment, heartbeat, inventory, presence, command claim, or result?</li>
            <li><strong>Record time and identity.</strong> Capture UTC time, organization/client, hostname, agent version, route/status, and actor without recording secrets.</li>
            <li><strong>Compare a known-good path.</strong> Use the same network and release where possible.</li>
            <li><strong>Change one variable.</strong> Avoid reinstalling, rotating credentials, and changing proxy policy simultaneously.</li>
          </ol>
        </>,
      },
      {
        id: 'server-startup',
        title: 'Dashboard does not start',
        content: <>
          <DataTable
            columns={['Symptom', 'Check', 'Resolution']}
            rows={[
              { cells: ['Missing database configuration', <code>MONGO_URI</code>, 'Provide a valid protected MongoDB URI; startup intentionally fails without it.'] },
              { cells: ['Connection timeout/refused', 'DNS, firewall, TLS, credentials, replica topology', 'Restore database reachability from the dashboard host.'] },
              { cells: ['Port already in use', 'PORT and the current listening process', 'Choose the intended port or stop the conflicting service.'] },
              { cells: ['Sign-in fails after startup', 'Firebase key, authorized domain, browser origin', 'Correct production Firebase configuration and redirect origins.'] },
              { cells: ['Organization-scoped routes return 403', 'Profile onboarding and org assignment', 'Complete onboarding or repair the server-side profile boundary.'] },
            ]}
          />
        </>,
      },
      {
        id: 'installer-generation',
        title: 'Installer generation fails',
        content: <>
          <ul>
            <li>Open onboarding information and confirm Windows is available and an agent binary exists.</li>
            <li>If no binary is present, verify <code>AGENT_BINARY_REPO</code>, private read token, exact URL, checksum, and outbound access to the artifact host.</li>
            <li>On a development workstation only, confirm the source tree and Rust toolchain before using local build fallback.</li>
            <li>For EXE generation, confirm the dashboard host is Windows and <code>iexpress.exe</code> is available.</li>
            <li>If a build/fetch is already running, wait for it rather than issuing concurrent provisioning requests.</li>
            <li>If signing is configured, verify certificate location, PFX password or thumbprint, private-key access, timestamp URL, and certificate validity.</li>
          </ul>
          <p>A signing failure is fatal when signing was explicitly configured. Remove broken signing configuration only if your deployment policy deliberately permits an unsigned pilot package.</p>
        </>,
      },
      {
        id: 'enrollment-fails',
        title: 'Enrollment fails',
        content: <>
          <Checklist items={[
            'Confirm the endpoint can resolve and reach the exact base URL embedded in agent.toml.',
            'Check that the enrollment token exists, has not expired, has not been revoked, and has not reached an optional use cap.',
            'Confirm the client referenced by the package still exists in the same organization.',
            'Verify the endpoint hostname is present and the device was not administratively revoked.',
            'Synchronize Windows time before testing subsequent signed requests.',
            'Generate a new package instead of hand-editing tokens or customer identifiers in an old installer.',
          ]} />
          <p>
            The installer’s simple registration call is best effort. If that record is missing but the agent credential exchange succeeds, normal heartbeat and inventory can still populate Fleet. Diagnose the agent API separately from the installer activity list.
          </p>
        </>,
      },
      {
        id: 'self-test',
        title: 'Run the endpoint API self-test',
        content: <>
          <CodeBlock code={selfTestCommand} language="powershell" label="Run as an administrator" />
          <p>
            The self-test exercises a scratch enrollment, persisted credential loading, inventory, heartbeat—including floating-point body signing—event ingestion, and command polling. Optional <code>--base</code> and <code>--token</code> arguments can target a test control plane and rollout token without replacing the installed device identity.
          </p>
          <Callout tone="warning" title="Use a test token">
            <p>Do not paste production enrollment or device secrets into a ticket or shared terminal transcript. Redact command output before sharing diagnostics.</p>
          </Callout>
        </>,
      },
      {
        id: 'fleet-stale',
        title: 'Device missing or stale in Fleet',
        content: <>
          <ul>
            <li>Confirm the logon task exists and the tray agent is running in the expected user session.</li>
            <li>Check base URL, proxy, certificate trust, DNS, and outbound filtering from the endpoint.</li>
            <li>Inspect Fleet for the correct organization/client and canonical hostname rather than only a custom display name.</li>
            <li>Compare last heartbeat, last inventory, and agent version. One fresh signal does not guarantee every collector succeeded.</li>
            <li>Check collector configuration and whether Windows APIs returned the expected hardware/security data.</li>
            <li>For event gaps, verify configured channels/event IDs and remember that one upload inserts at most 500 supplied events.</li>
          </ul>
          <p>The current application is a tray process started by an elevated logon task, not a documented Windows service. Do not search for a nonexistent Nevian service log path; collect the actual process output and control-plane response details available in your deployment.</p>
        </>,
      },
      {
        id: 'commands-fail',
        title: 'Commands do not run',
        content: <>
          <DataTable
            columns={['Check', 'Why it matters']}
            rows={[
              { cells: ['Recent heartbeat/presence', 'Immediate work requires a recently trusted endpoint signal.'] },
              { cells: [<code>capabilities.device_commands</code>, 'Fleet learns command capability from the authenticated heartbeat.'] },
              { cells: ['commands_enabled in local config', 'False is a deliberate endpoint-local veto.'] },
              { cells: ['Correct organization and hostname', 'The queue and result update are scoped to the addressed device.'] },
              { cells: ['Run time', 'A future-scheduled command is not eligible yet.'] },
              { cells: ['Elevation and Windows policy', 'PowerShell, service, update, or install actions may need rights or policy exceptions.'] },
              { cells: ['Status/output', 'Claimed, failed, timed-out, stdout, and stderr identify the failing stage.'] },
            ]}
          />
          <p>Do not enable commands merely to clear an alert. Confirm that endpoint owner policy permits remote support on that device.</p>
        </>,
      },
      {
        id: 'signature-errors',
        title: 'Signed requests return 401',
        content: <>
          <ul>
            <li><strong>Unsigned request:</strong> credential load or header construction failed.</li>
            <li><strong>Stale or skewed timestamp:</strong> synchronize system time; the allowed window is five minutes.</li>
            <li><strong>Unknown or revoked device:</strong> inspect administrative revocation and device identity.</li>
            <li><strong>Bad signature:</strong> compare secret, method, exact path, raw body bytes, bodyless <code>null</code> hash, and hexadecimal encoding.</li>
            <li><strong>Nonce already used:</strong> generate a unique nonce for each original request and retry.</li>
          </ul>
          <p>If the agent automatically re-enrolls once and still fails, stop the loop and identify whether the device is revoked or the rollout token is no longer valid.</p>
        </>,
      },
      {
        id: 'identity-integrations',
        title: 'Microsoft and hybrid recovery issues',
        content: <>
          <Checklist items={[
            'Run the Entra connection self-test and verify tenant consent, redirect URI, and required Graph permissions.',
            'Distinguish a normal workspace login from the fresh-login or MFA proof required for cloud password recovery.',
            'Confirm the target is not a protected privileged account and review the recorded block reason.',
            'For on-premises work, confirm a matching worker is alive, correctly allowlisted, and no longer in dry-run when production execution is intended.',
            'Place only the control plane public credential-delivery key on the worker; keep the private key on the control plane.',
            'Use a MongoDB replica set where transactional credential delivery requires it.',
          ]} />
        </>,
      },
      {
        id: 'support-bundle',
        title: 'Collect useful diagnostics',
        content: <>
          <p>Capture the smallest evidence set that explains the boundary without exposing secrets:</p>
          <ul>
            <li>UTC timestamp and timezone, organization/client name, hostname, Windows build, and agent version.</li>
            <li>Action attempted, expected result, actual result, HTTP status, and non-secret error body.</li>
            <li>Whether the issue affects one device, one client/network, or the full organization.</li>
            <li>Recent heartbeat/inventory times, command status, exit code, and redacted output.</li>
            <li>Installer signature state and artifact version/checksum—not the enrollment token.</li>
            <li>Relevant proxy, identity-provider, endpoint-security, and server logs with authorization data redacted.</li>
          </ul>
          <PageCards items={[
            { slug: 'authentication', title: 'Authentication errors', description: 'Map 401/403 responses to the identity protocol in use.', icon: 'shield' },
            { slug: 'agent-releases', title: 'Release verification', description: 'Confirm artifact, checksum, installed version, and upgrade behavior.', icon: 'document' },
          ]} />
        </>,
      },
    ],
  },

  security: {
    group: 'Resources',
    title: 'Security',
    summary: 'Understand Nevian’s implemented tenant, identity, endpoint, command, installer, and recovery controls—and your deployment responsibilities.',
    sections: [
      {
        id: 'security-model',
        title: 'Security model',
        content: <>
          <p>
            Nevian’s security model combines organization-scoped application access, server-verified human identity, per-device credentials, signed endpoint traffic, a protected administrative command plane, and endpoint-local policy. No single control replaces secure deployment of the whole system.
          </p>
          <Callout title="Claims on this page describe implemented application controls">
            <p>Transport termination, database encryption, backup, host hardening, identity-provider policy, network segmentation, and compliance certification depend on the environment in which Nevian is operated.</p>
          </Callout>
        </>,
      },
      {
        id: 'tenant-isolation',
        title: 'Tenant and human access controls',
        content: <>
          <ul>
            <li>Browser requests use verified Firebase identity rather than caller-supplied user details.</li>
            <li>Organization scope comes from the server-side profile and selects tenant-scoped data access.</li>
            <li>Administrative routes require onboarded, organization-bound administrators.</li>
            <li>Exact-email membership workflows avoid broad cross-organization account discovery.</li>
            <li>Department and device assignment are validated inside the same organization.</li>
            <li>The last administrator cannot be demoted or moved in a way that leaves the organization unmanaged.</li>
          </ul>
        </>,
      },
      {
        id: 'device-security',
        title: 'Device identity and request integrity',
        content: <>
          <p>
            Each enrolled endpoint receives a random device ID and 256-bit secret. HMAC-SHA256 covers device ID, timestamp, nonce, HTTP method, path, and exact body hash. The server enforces a five-minute clock window, verifies signatures using constant-time comparison, and rejects nonce reuse in the running process.
          </p>
          <p>
            Tenant and hostname are resolved from the authenticated registration. Inventory, events, command claims, and command results cannot redirect themselves by asserting a different organization or machine in the payload.
          </p>
          <Callout tone="neutral" title="Server-held HMAC secrets are sensitive">
            <p>The control plane must retain the raw device secret to verify HMAC. Protect the device registry, database access, backups, diagnostics, and administrative hosts accordingly.</p>
          </Callout>
        </>,
      },
      {
        id: 'command-security',
        title: 'Remote command security',
        content: <>
          <Checklist items={[
            'Only organization administrators should reach command-producing routes and views.',
            'Commands are queued and claimed for one organization and canonical hostname.',
            'Results can update only commands belonging to that authenticated endpoint.',
            'The endpoint reports whether remote commands are locally enabled.',
            'Setting commands_enabled = false leaves telemetry active while refusing remote work.',
            'Actors, targets, timing, status, and bounded output are retained in device activity.',
          ]} />
          <Callout tone="warning" title="Nevian administrators can run powerful endpoint work">
            <p>The current platform supports arbitrary PowerShell/cmd and structured actions; it does not require a per-command local approval code or cryptographic script allowlist. Protect admin accounts and the control plane as privileged infrastructure.</p>
          </Callout>
        </>,
      },
      {
        id: 'installer-supply-chain',
        title: 'Installer and release integrity',
        content: <>
          <ul>
            <li>Production can fetch <code>desk-agent.exe</code> from a configured release repository over HTTPS.</li>
            <li>The artifact is verified with its adjacent SHA-256 or a configured exact digest before use.</li>
            <li>Installer assembly is separate from artifact retrieval and can add Authenticode signing.</li>
            <li>If configured signing fails, the server refuses the package instead of silently downgrading.</li>
            <li>The download response reports trusted, untrusted, or unsigned signature outcome for the UI.</li>
            <li>Enrollment tokens expire and can be revoked after distribution.</li>
          </ul>
          <p>Validate the source tag, digest, Authenticode signature, timestamp, and publisher trust before a broad deployment.</p>
        </>,
      },
      {
        id: 'recovery-security',
        title: 'Identity-recovery controls',
        content: <>
          <p>
            Microsoft cloud password recovery evaluates a fresh-login/PKCE flow and MFA evidence where required, applies per-target and per-requester limits, blocks protected privileged accounts, and records the requester, target, proof or override, reason, and outcome.
          </p>
          <p>
            For on-premises Active Directory recovery, the optional worker receives a short-lived encrypted credential envelope. The public encryption key belongs on the worker side of delivery setup; the private key remains on the control plane. Begin in dry-run mode and restrict worker scope to approved tenant/domain or controller settings.
          </p>
        </>,
      },
      {
        id: 'deployment-responsibilities',
        title: 'Deployment responsibilities',
        content: <>
          <DataTable
            columns={['Area', 'Required operator control']}
            rows={[
              { cells: ['Transport', 'Serve agent and browser traffic through correctly configured HTTPS and protect query-string tokens in logs.'] },
              { cells: ['Database', 'Least privilege, network isolation, encryption, backup, restore tests, monitoring, and replica topology where required.'] },
              { cells: ['Hosts', 'Patch and harden the control plane, build/signing host, and optional Server Agent host.'] },
              { cells: ['Identity', 'Protect Google/Microsoft accounts, review admins/external members, and enforce provider-side MFA policy.'] },
              { cells: ['Endpoints', 'Control local admins, application execution, PowerShell, remote-action policy, and device retirement.'] },
              { cells: ['Secrets', 'Use protected environment/secret storage and redact logs, tickets, source, and screenshots.'] },
              { cells: ['Operations', 'Review activity, revoke stale identities/tokens, test recovery, and maintain incident response.'] },
            ]}
          />
        </>,
      },
      {
        id: 'scope-of-claims',
        title: 'Scope of security claims',
        content: <>
          <p>The current implementation does not by itself establish or provide:</p>
          <ul>
            <li>SOC 2, ISO 27001, GDPR, CCPA, or other certification/compliance status.</li>
            <li>Universal TLS 1.3 enforcement or application-managed encryption of every database field at rest.</li>
            <li>SAML SSO, SCIM provisioning, customer-managed encryption keys, or a global SIEM export.</li>
            <li>Immutable auditing of every read and action.</li>
            <li>Per-command endpoint approval, code-signature verification of every script, or protection from a compromised command-producing server.</li>
            <li>A guarantee of no standing endpoint privilege; the generated logon task runs at highest privileges to support administrative actions.</li>
          </ul>
          <p>Assess the deployed system, infrastructure, processes, and contracts against your own risk and compliance requirements.</p>
          <PageCards items={[
            { slug: 'audit-trail', title: 'Audit coverage', description: 'See what is recorded today and where coverage remains feature-specific.', icon: 'document' },
            { slug: 'deployment-checklist', title: 'Deploy securely', description: 'Validate TLS, signing, endpoint policy, integrations, and pilot gates.', icon: 'shield' },
          ]} />
        </>,
      },
    ],
  },

  'agent-releases': {
    group: 'Resources',
    title: 'Agent releases',
    summary: 'Build, publish, verify, provision, deploy, and track Windows Desk Agent versions safely.',
    sections: [
      {
        id: 'release-model',
        title: 'Release model',
        content: <>
          <p>
            The Desk Agent is versioned in the Rust source and built for Windows by CI. Relevant pushes and pull requests validate a release build; version tags publish <code>desk-agent.exe</code> together with its SHA-256 file. The workflow also retains build artifacts for inspection.
          </p>
          <p>
            The source version in the audited repository is <strong>0.3.0</strong>. Treat the source constant and the published release artifact as authoritative rather than demo health-check text elsewhere in the UI.
          </p>
        </>,
      },
      {
        id: 'published-artifacts',
        title: 'Published artifacts',
        content: <>
          <DataTable
            columns={['Artifact', 'Purpose', 'Validation']}
            rows={[
              { cells: [<code>desk-agent.exe</code>, 'Windows Desk Agent binary', 'Source tag/version, PE inspection, and optional publisher signature'] },
              { cells: ['SHA-256 sidecar', 'Detect artifact corruption or substitution', 'Digest must match the downloaded executable'] },
              { cells: ['Workflow artifact', 'CI build retained for review/testing', 'Confirm workflow, commit, and retention source'] },
              { cells: ['Generated Nevian installer', 'Binary plus client config and install script', 'Artifact digest plus installer Authenticode outcome'] },
            ]}
          />
          <p>The generated installer is a deployment package built from the agent artifact; it is not the same file as the published raw Desk Agent binary.</p>
        </>,
      },
      {
        id: 'provision-control-plane',
        title: 'Provision the control plane',
        content: <>
          <p>
            Configure <code>AGENT_BINARY_REPO</code> for normal release discovery. A private repository also requires a server-held read token. For a frozen or mirrored release, configure an exact binary URL and expected SHA-256. The dashboard downloads to a temporary location, verifies the digest, and atomically places the artifact for installer generation.
          </p>
          <p>
            The onboarding action labeled “build agent” uses release provisioning in production. It invokes Cargo only when local build fallback is explicitly allowed on a development source checkout.
          </p>
          <Callout tone="warning" title="Do not compile on demand in production">
            <p>A customer-facing dashboard should not require the source tree, Rust toolchain, or compiler execution in response to an HTTP request. Publish and verify release artifacts ahead of deployment.</p>
          </Callout>
        </>,
      },
      {
        id: 'rollout',
        title: 'Roll out a new version',
        content: <>
          <ol>
            <li>Review the source change, version bump, CI result, and intended release notes.</li>
            <li>Publish a version tag and verify the executable and SHA-256 sidecar are present.</li>
            <li>Have the control plane fetch and verify the new artifact.</li>
            <li>Generate a package for a dedicated pilot client or small rollout group.</li>
            <li>Verify installer signature/trust, normal enrollment, inventory, heartbeat, command capability, and the reported agent version.</li>
            <li>Observe reconnect and logon behavior before generating packages for broader rollout.</li>
            <li>Retain the previous verified artifact and documented rollback procedure until the rollout is accepted.</li>
          </ol>
        </>,
      },
      {
        id: 'existing-devices',
        title: 'Existing devices and upgrades',
        content: <>
          <Callout title="There is no automatic endpoint self-update today">
            <p>Fetching a newer release changes the binary included in installers generated afterward. It does not automatically stage, ring-deploy, or roll back the agent already installed on endpoints.</p>
          </Callout>
          <p>
            Upgrade existing devices through an operator-controlled redeployment process. Test whether re-running the generated installer aligns with your endpoint-management policy; it overwrites the installed binary/configuration and refreshes the logon task. Re-enrollment of the same hostname rotates the machine credential.
          </p>
          <p>
            Fleet reports <code>agent_version</code>, allowing administrators to identify devices that have or have not moved to the intended release. Do not label every older version insecure without release-specific analysis.
          </p>
        </>,
      },
      {
        id: 'rollback-and-retirement',
        title: 'Rollback and retirement',
        content: <>
          <Checklist items={[
            'Keep the last accepted executable and checksum in an access-controlled artifact store.',
            'Document which generated package and agent version was deployed to each rollout group.',
            'If rollback is required, redeploy the verified previous package through the same controlled process.',
            'Confirm version, heartbeat, collectors, command policy, and device identity after rollback.',
            'Revoke compromised rollout tokens or device identities independently of binary rollback.',
            'Remove unsupported artifacts from the control plane only after affected devices and recovery plans are understood.',
          ]} />
        </>,
      },
      {
        id: 'release-checklist',
        title: 'Release acceptance checklist',
        content: <>
          <DataTable
            columns={['Gate', 'Evidence']}
            rows={[
              { cells: ['Build', 'CI release build completed for the intended commit and version.'] },
              { cells: ['Integrity', 'Downloaded SHA-256 matches the published sidecar or pinned digest.'] },
              { cells: ['Publisher', 'Installer signature and trust meet endpoint policy.'] },
              { cells: ['Compatibility', 'Pilot Windows versions and security tooling allow install/startup.'] },
              { cells: ['Protocol', 'Enrollment, signed telemetry, events, command polling, and result upload pass.'] },
              { cells: ['Operations', 'Fleet reports the intended version and rollback artifact remains available.'] },
              { cells: ['Documentation', 'Known changes, limitations, operator impact, and recovery steps are recorded.'] },
            ]}
          />
          <PageCards items={[
            { slug: 'deployment-checklist', title: 'Production deployment', description: 'Review the full control-plane and endpoint rollout checklist.', icon: 'shield' },
            { slug: 'troubleshooting', title: 'Diagnose release issues', description: 'Investigate binary fetch, signing, enrollment, and version mismatches.', icon: 'bolt' },
          ]} />
        </>,
      },
    ],
  },
};
