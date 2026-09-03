import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Download,
  X,
  ArrowRight,
  Calendar,
  Clock,
  Shield,
  Bug,
  Globe,
  Cpu,
  Search,
  Check,
  Copy,
  ExternalLink,
  Lock,
  Zap,
  Radio,
  FileCode,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { CTABanner } from '@/components/shared/cta-banner'
import { Button } from '@/components/ui/button'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

export type ThreatArticle = {
  id: string
  slug: string
  title: string
  subtitle: string
  category: 'Report' | 'APT Investigation' | 'Ransomware' | 'Financial Fraud' | 'Supply Chain' | 'Playbook'
  icon: typeof FileText
  image: string
  isFeatured?: boolean
  isNew?: boolean
  tlp: 'TLP:CLEAR' | 'TLP:AMBER' | 'TLP:GREEN'
  author: {
    name: string
    role: string
    avatar: string
  }
  date: string
  readTime: string
  tags: string[]
  executiveSummary: string
  keyFindings: string[]
  killChainSteps: {
    phase: string
    tactic: string
    techniqueId: string
    details: string
  }[]
  mitreAttack: {
    tactic: string
    id: string
    technique: string
    description: string
  }[]
  iocs: {
    type: 'SHA256' | 'C2 Domain' | 'IP Address' | 'Registry' | 'Mutex'
    indicator: string
    description: string
  }[]
  yaraRule: string
  mitigationSteps: string[]
}

const threatResearchData: ThreatArticle[] = [
  {
    id: 'report-2026-threat-landscape',
    slug: 'global-threat-landscape-report-2026',
    title: 'Global Threat Landscape Report 2026: Autonomous Ransomware & State-Backed Supply Chain Cartels',
    subtitle: 'Annual intelligence retrospective analyzing telemetry from 70+ countries, 400+ forensic response cases, and dark web tracking.',
    category: 'Report',
    icon: FileText,
    image: '/resources/threat-landscape-2026.jpg',
    isFeatured: true,
    isNew: true,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'Difaac Threat Intelligence Unit',
      role: 'Global Threat Analysis Group',
      avatar: 'DT',
    },
    date: 'Aug 28, 2026',
    readTime: '24 min read',
    tags: ['APT Operations', 'RaaS Cartels', 'AI Threats', 'Critical Infrastructure', 'MITRE ATT&CK'],
    executiveSummary:
      'The 2026 threat landscape marks a pivotal transition toward automated, AI-orchestrated adversary operations and decentralized ransomware-as-a-service (RaaS) cartels. Over the past 12 months, Difaac analyzed telemetry across 70+ nations, identifying a 47% surge in supply chain compromises and a 62% decrease in average attacker dwell time before data encryption. State-sponsored groups increasingly employ commercial infostealers and living-off-the-land binaries (LOLBins) to mask sovereign campaigns as opportunistic e-crime.',
    keyFindings: [
      'Attacker dwell time dropped to an all-time low of 19.4 hours between initial intrusion and domain-wide ransom deployment.',
      '47% of analyzed enterprise compromises originated from vulnerable third-party SaaS integrations or upstream software dependencies.',
      'Over 380 active threat actor clusters tracked, with 14 newly identified APT syndicates operating in the EMEA region.',
      'Dark web stolen identity auctions grew by 73%, driven by polymorphic infostealer strains targeting browser session tokens and 2FA cookies.',
    ],
    killChainSteps: [
      {
        phase: '1. Initial Access',
        tactic: 'Initial Access',
        techniqueId: 'T1190 / T1566.002',
        details: 'Spearphishing with weaponized SVG payloads and automated exploitation of edge gateway VPN zero-days.',
      },
      {
        phase: '2. Execution & Defense Evasion',
        tactic: 'Execution / Evasion',
        techniqueId: 'T1059.001 / T1562.001',
        details: 'Execution via PowerShell reflective DLL injection; BYOVD (Bring Your Own Vulnerable Driver) to disable EDR sensors.',
      },
      {
        phase: '3. Lateral Movement',
        tactic: 'Lateral Movement',
        techniqueId: 'T1021.002 / T1550.002',
        details: 'Pass-the-Hash over SMB and WMI to pivot to Domain Controllers and Tier-0 hypervisor management clusters.',
      },
      {
        phase: '4. Exfiltration & Impact',
        tactic: 'Exfiltration / Impact',
        techniqueId: 'T1567.002 / T1486',
        details: 'Encrypted exfiltration via Rclone to Mega/Wasabi, followed by multi-threaded ChaCha20 file encryption.',
      },
    ],
    mitreAttack: [
      { tactic: 'Initial Access', id: 'T1190', technique: 'Exploit Public-Facing App', description: 'Targeting unpatched VPN concentrators and web application gateways' },
      { tactic: 'Execution', id: 'T1059.001', technique: 'PowerShell', description: 'Obfuscated in-memory execution bypassing AMSI via memory patching' },
      { tactic: 'Defense Evasion', id: 'T1562.001', technique: 'Disable Security Tools', description: 'Kernel-level driver attacks terminating security daemon threads' },
      { tactic: 'Credential Access', id: 'T1003.001', technique: 'LSASS Memory Dumping', description: 'Dumping credentials via created minidump with legitimate debug privileges' },
      { tactic: 'Impact', id: 'T1486', technique: 'Data Encrypted for Impact', description: 'High-speed multi-threaded encryption deleting Volume Shadow Copies' },
    ],
    iocs: [
      { type: 'SHA256', indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', description: 'Stealth Loader Dropper (Polymorphic)' },
      { type: 'SHA256', indicator: 'a45f910408d6d87e5cf2333b2591632ee099efec2788e0b62e49c719e794fb59', description: 'Ransomware Kernel Killer Driver' },
      { type: 'C2 Domain', indicator: 'sync-telemetry-cdn[.]cloud-edge[.]org', description: 'Encrypted C2 Beaconing Endpoint' },
      { type: 'IP Address', indicator: '194.26.29[.]114', description: 'Staging Server for Data Exfiltration (Port 8443)' },
      { type: 'Registry', indicator: 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\AntiSensorBypass', description: 'Persistence Service Key' },
    ],
    yaraRule: `rule Difaac_Global_Ransomware_Loader_2026 {
    meta:
        author = "Difaac Threat Research Lab"
        description = "Detects 2026 RaaS polymorphic memory injector"
        tlp = "CLEAR"
        date = "2026-08-28"
    strings:
        $magic = { 4D 5A 90 00 03 00 00 00 }
        $str1 = "AmsiScanBuffer" ascii wide
        $str2 = "NtProtectVirtualMemory" ascii wide
        $hex_pattern = { 48 89 5C 24 08 57 48 83 EC 20 48 8B F9 E8 ?? ?? ?? ?? 48 8B D8 }
    condition:
        uint16(0) == 0x5A4D and all of ($str*) and $hex_pattern
}`,
    mitigationSteps: [
      'Enforce hardware-backed MFA (FIDO2/WebAuthn) across all remote access gateways and administrative dashboards.',
      'Deploy application whitelisting and block unauthorized kernel drivers using Windows HVCI / WDAC policies.',
      'Isolate hypervisor management interfaces into dedicated Out-of-Band (OOB) networks with strict zero-trust brokering.',
      'Ingest Difaac real-time IOC feeds into your SIEM/XDR to immediately block known adversary staging infrastructure.',
    ],
  },
  {
    id: 'whitepaper-ransomware-finance',
    slug: 'ransomware-evolution-in-financial-services',
    title: 'Ransomware Evolution in Financial Services: Double-Extortion & Core Banking Interception',
    subtitle: 'Deep-dive analysis into 23 financial sector incidents, ransomware negotiation telemetry, and targeted Swift/ATM middleware attacks.',
    category: 'Ransomware',
    icon: BookOpen,
    image: '/resources/ransomware-financial.jpg',
    isNew: true,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'Tariq Al-Mansoor',
      role: 'Principal Financial Threat Researcher',
      avatar: 'TM',
    },
    date: 'Aug 14, 2026',
    readTime: '18 min read',
    tags: ['Financial Fraud', 'Banking Trojan', 'Double Extortion', 'YARA Signatures', 'SWIFT Defense'],
    executiveSummary:
      'Financial institutions face a tactical shift where ransomware operators no longer seek purely generic endpoint encryption, but specifically target core transaction settlement databases, payment switch middleware, and SWIFT messaging gateways. This white paper reviews 23 incident response investigations in tier-1/2 banks, charting the weaponization of stolen session cookies and automated API exfiltration before issuing $4M+ extortion demands.',
    keyFindings: [
      'Average ransom demand against financial targets escalated to $4.2M, with 82% of groups utilizing dedicated leak portals.',
      '74% of financial intrusions involved the compromise of contractor VPN credentials lacking biometric MFA.',
      'Threat actors weaponized custom SQL staging scripts to silently extract millions of transaction records prior to ransom notes.',
      'Detection telemetry confirms that 91% of successful intrusions were detectable at the lateral reconnaissance phase.',
    ],
    killChainSteps: [
      {
        phase: '1. Reconnaissance',
        tactic: 'Reconnaissance',
        techniqueId: 'T1596 / T1589',
        details: 'Harvesting employee credentials from Infostealer dark web logs and scanning external banking APIs.',
      },
      {
        phase: '2. Ingress & Privilege',
        tactic: 'Initial Access',
        techniqueId: 'T1078.004 / T1068',
        details: 'Logging into contractor VDI portals; exploiting local privilege escalation (LPE) in virtualization agents.',
      },
      {
        phase: '3. Data Staging',
        tactic: 'Collection',
        techniqueId: 'T1560 / T1005',
        details: 'Executing 7-Zip binaries with password protection against database backups and core account tables.',
      },
      {
        phase: '4. Extortion Execution',
        tactic: 'Impact',
        techniqueId: 'T1486 / T1490',
        details: 'Deploying locker payload across ESXi clusters while simultaneously emailing executives extortion demands.',
      },
    ],
    mitreAttack: [
      { tactic: 'Initial Access', id: 'T1078.004', technique: 'Cloud/VDI Accounts', description: 'Leveraging valid accounts purchased from initial access brokers' },
      { tactic: 'Collection', id: 'T1560.001', technique: 'Archive via Utility', description: 'Compressing SQL database dumps using password-protected 7z' },
      { tactic: 'Exfiltration', id: 'T1048.003', technique: 'Exfil Over Alternative Protocol', description: 'Data sent over encrypted HTTPS POST to adversary cloud storage' },
      { tactic: 'Impact', id: 'T1490', technique: 'Inhibit System Recovery', description: 'Deleting VSS snapshots and disabling backup agent daemons' },
    ],
    iocs: [
      { type: 'SHA256', indicator: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', description: 'Banking Locker Core Payload' },
      { type: 'SHA256', indicator: 'b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78', description: 'Custom DB Exfiltration Script' },
      { type: 'C2 Domain', indicator: 'finance-telemetry-gateway[.]biz', description: 'Encrypted Command & Control Server' },
      { type: 'IP Address', indicator: '45.142.214[.]88', description: 'Ransom Negotiation Portal Host' },
      { type: 'Mutex', indicator: 'Global\\DifaacBlocked_FinLock_Active', description: 'Infection Mutex' },
    ],
    yaraRule: `rule Difaac_FinRansom_ESXi_Locker {
    meta:
        author = "Difaac Financial Security SIG"
        threat_actor = "FinLocker Group"
        tlp = "CLEAR"
    strings:
        $s1 = "esxcli vm process kill" ascii
        $s2 = "services.sh stop" ascii
        $s3 = ".finlock_encrypted" ascii wide
        $key_marker = "-----BEGIN FIN ENCRYPTED KEY-----"
    condition:
        all of ($s*) or $key_marker
}`,
    mitigationSteps: [
      'Segment SWIFT, payment switch, and core database clusters with zero-trust microsegmentation and strict egress filtering.',
      'Implement immutable, air-gapped backup architectures with multi-party approval required for snapshot deletion.',
      'Deploy behavioral honeypots and early canary files across critical network shares to trigger instant automated isolation.',
    ],
  },
  {
    id: 'apt-investigation-sandstorm',
    slug: 'operation-sandstorm-state-sponsored-apt-campaigns',
    title: 'Operation SandStorm: Dissecting State-Sponsored APT Campaigns Targeting Critical Infrastructure',
    subtitle: 'Comprehensive attribution analysis of a multi-stage cyber espionage operation targeting telecom networks and government ministries.',
    category: 'APT Investigation',
    icon: Globe,
    image: '/resources/apt-investigation.jpg',
    isNew: false,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'Elena Rostova & CERT-Difaac',
      role: 'Head of Threat Hunting & Attribution',
      avatar: 'ER',
    },
    date: 'Aug 02, 2026',
    readTime: '22 min read',
    tags: ['APT28 Cluster', 'Critical Infrastructure', 'Cyber Espionage', 'Telecom Defense', 'Custom Backdoors'],
    executiveSummary:
      'Difaac Incident Response and Threat Intelligence teams uncovered "Operation SandStorm," a sophisticated espionage campaign conducted by a state-aligned advanced persistent threat (APT) actor. Active for over 18 months, the group systematically compromised regional telecommunications backbones and government communication systems using customized modular backdoors, compromised SSL-VPN credentials, and passive network sniffing implants.',
    keyFindings: [
      'Adversary maintained persistent presence within 4 regional telecommunications service providers without disruption.',
      'Utilized custom DNS tunneling protocols (DNS-C2) to exfiltrate sensitive diplomatic correspondence undetected.',
      'Custom implant "SandDrift" utilized hardware-specific cryptographic key generation to thwart sandbox analysis.',
      'Targeted SS7 signaling gateways and customer metadata databases for real-time location monitoring.',
    ],
    killChainSteps: [
      {
        phase: '1. Compromise',
        tactic: 'Initial Access',
        techniqueId: 'T1195.002 / T1078',
        details: 'Exploiting upstream IT vendor remote management access credentials.',
      },
      {
        phase: '2. Stealth Implant',
        tactic: 'Persistence',
        techniqueId: 'T1543.003 / T1027',
        details: 'Installing SandDrift backdoor disguised as system network diagnostic daemon.',
      },
      {
        phase: '3. Traffic Interception',
        tactic: 'Collection',
        techniqueId: 'T1040 / T1557',
        details: 'Network sniffing on core router tap ports and packet capture mirroring.',
      },
      {
        phase: '4. DNS Tunneling',
        tactic: 'Exfiltration',
        techniqueId: 'T1071.004',
        details: 'Exfiltrating stolen data chunks via base64 encoded TXT/AAAA DNS queries.',
      },
    ],
    mitreAttack: [
      { tactic: 'Persistence', id: 'T1543.003', technique: 'Windows/Linux Service', description: 'Registering covert systemd services with randomized sleep timers' },
      { tactic: 'Collection', id: 'T1040', technique: 'Network Sniffing', description: 'Promiscuous packet capture on telecom internal trunk links' },
      { tactic: 'Command and Control', id: 'T1071.004', technique: 'DNS C2 Protocol', description: 'Low-and-slow data transfer through recursive public DNS resolvers' },
    ],
    iocs: [
      { type: 'SHA256', indicator: '2c5a2e5d95e0c81bf3732d8495a6bb0b95f2d7a22a316c026b489a8a7e02e071', description: 'SandDrift Core Backdoor ELF64' },
      { type: 'C2 Domain', indicator: 'ns1.telecom-telemetry-resolver[.]net', description: 'Authoritative DNS C2 Nameserver' },
      { type: 'IP Address', indicator: '185.193.65[.]42', description: 'Encrypted Staging & Jump Host' },
    ],
    yaraRule: `rule Difaac_APT_SandDrift_Backdoor {
    meta:
        author = "Difaac Threat Hunting"
        actor = "SandStorm APT Cluster"
    strings:
        $header = "SAND_V3_INIT"
        $dns_fn = "send_dns_chunk_tunnel"
        $xor_key = { 8A 45 ?? 30 04 08 40 3B 45 ?? }
    condition:
        all of them
}`,
    mitigationSteps: [
      'Implement DNS traffic inspection and rate-limiting on recursive internal resolvers to detect tunneling signatures.',
      'Deploy continuous network integrity monitoring on core routing infrastructure and router configurations.',
      'Enforce strict cryptographic verification of all third-party software updates and administrative access sessions.',
    ],
  },
  {
    id: 'guide-supply-chain',
    slug: 'securing-the-software-supply-chain',
    title: 'Securing the Software Supply Chain: Defending CI/CD Pipelines Against Dependency Infiltration',
    subtitle: 'A practical architecture blueprint for implementing SLSA Level 3, automated SBOM verification, and pipeline provenance.',
    category: 'Supply Chain',
    icon: Cpu,
    image: '/resources/supply-chain-defense.jpg',
    isNew: false,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'Marcus Chen',
      role: 'Principal Cloud Security Architect',
      avatar: 'MC',
    },
    date: 'Jul 22, 2026',
    readTime: '15 min read',
    tags: ['DevSecOps', 'SLSA Level 3', 'SBOM Verification', 'CI/CD Security', 'GitHub Actions'],
    executiveSummary:
      'Modern software supply chain attacks bypass traditional network perimeter defenses by compromising open-source package repositories, CI/CD build environments, and container registries. This engineering guide provides production-ready architectures to detect dependency confusion, enforce cryptographic artifact signing (Cosign/Sigstore), and prevent secret leakage in automated build runners.',
    keyFindings: [
      'Typosquatting and dependency confusion attacks in NPM/PyPI repositories increased by 134% in 2026.',
      'Over 60% of open-source security incidents were caused by malicious maintainer takeovers and stale tokens.',
      'Implementing automated SLSA Level 3 build provenance eliminates 94% of unauthorized artifact tampering vectors.',
    ],
    killChainSteps: [
      { phase: '1. Poisoning', tactic: 'Initial Access', techniqueId: 'T1195.001', details: 'Publishing typosquatted package on public registry with pre-install script.' },
      { phase: '2. Build Hook', tactic: 'Execution', techniqueId: 'T1059', details: 'Triggering malicious payload during CI/CD npm install / pip install step.' },
      { phase: '3. Secret Exfil', tactic: 'Credential Access', techniqueId: 'T1552.001', details: 'Harvesting AWS/GCP deployment tokens from runner environment variables.' },
      { phase: '4. Artifact Tampering', tactic: 'Persistence', techniqueId: 'T1565.002', details: 'Injecting backdoor payload directly into released Docker container image.' },
    ],
    mitreAttack: [
      { tactic: 'Initial Access', id: 'T1195.001', technique: 'Compromise Software Dependencies', description: 'Malicious dependencies injected via dependency confusion' },
      { tactic: 'Credential Access', id: 'T1552.001', technique: 'Credentials in Files/Env', description: 'Stealing CI/CD environment secrets and deployment tokens' },
    ],
    iocs: [
      { type: 'SHA256', indicator: 'd41d8cd98f00b204e9800998ecf8427e998ecf8427e026b489a8a7e02e071999', description: 'Malicious NPM PostInstall Script' },
      { type: 'C2 Domain', indicator: 'npm-telemetry-collector[.]io', description: 'Exfiltration Webhook Endpoint' },
    ],
    yaraRule: `rule Difaac_SupplyChain_Malicious_PostInstall {
    meta:
        description = "Detects secret exfiltration in NPM package scripts"
    strings:
        $hook = "\"postinstall\":"
        $curl = "curl -X POST -d @/etc/passwd"
        $env = "process.env.AWS_SECRET_ACCESS_KEY"
    condition:
        $hook and ($curl or $env)
}`,
    mitigationSteps: [
      'Lock all dependency versions with cryptographically verified checksums and private internal package mirrors.',
      'Enforce ephemeral, isolated CI/CD build runners with zero access to production credentials.',
      'Mandate signed commits and automated SBOM (Software Bill of Materials) validation at every deployment stage.',
    ],
  },
  {
    id: 'research-dark-web-economy',
    slug: 'dark-web-marketplaces-and-initial-access-brokers',
    title: 'The Underground Economy: Dissecting Initial Access Brokers & Credential Telemetry',
    subtitle: 'First-hand investigative report into closed cybercrime forums, RaaS affiliate revenue models, and corporate access pricing.',
    category: 'APT Investigation',
    icon: Bug,
    image: '/resources/dark-web-investigation.jpg',
    isNew: false,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'Farah Nour',
      role: 'Dark Web Intelligence Analyst',
      avatar: 'FN',
    },
    date: 'Jun 19, 2026',
    readTime: '16 min read',
    tags: ['Dark Web Intel', 'Access Brokers', 'Infostealers', 'Telegram E-Crime', 'Identity Security'],
    executiveSummary:
      'Initial Access Brokers (IABs) remain the engine of the modern cybercrime ecosystem. By analyzing over 120,000 dark web forum threads across Exploit, XSS, and Russian-speaking Telegram channels, Difaac analysts mapped the pricing, tradecraft, and buyer network fueling corporate network compromises worldwide.',
    keyFindings: [
      'Median price for domain administrative access to a mid-market enterprise currently stands at $2,800 USD.',
      'Infostealer logs (RedLine, Lumma, Vidar) account for 78% of initial credential compromises.',
      'Automated Telegram bots now deliver verified corporate session tokens to buyers within 90 seconds of user infection.',
    ],
    killChainSteps: [
      { phase: '1. Infection', tactic: 'Initial Access', techniqueId: 'T1566.001', details: 'Victim downloads cracked software or fake update containing Lumma infostealer.' },
      { phase: '2. Scraping', tactic: 'Credential Access', techniqueId: 'T1539', details: 'Extracting all saved browser passwords, Active Directory session cookies, and crypto keys.' },
      { phase: '3. Broker Sale', tactic: 'Resource Dev', techniqueId: 'T1589', details: 'IAB verifies corporate domain and lists VPN/RDP access on underground auction forum.' },
      { phase: '4. Ransom Attack', tactic: 'Impact', techniqueId: 'T1486', details: 'Ransomware affiliate purchases access and initiates internal network pivoting.' },
    ],
    mitreAttack: [
      { tactic: 'Credential Access', id: 'T1539', technique: 'Steal Web Session Cookies', description: 'Bypassing MFA by hijacking authenticated browser cookies' },
    ],
    iocs: [
      { type: 'SHA256', indicator: '3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855a', description: 'Lumma Infostealer Payload' },
      { type: 'C2 Domain', indicator: 'cdn-token-exchange[.]to', description: 'Cookie Extraction Gateway' },
    ],
    yaraRule: `rule Difaac_Infostealer_SessionCookie_Harvester {
    meta:
        description = "Detects infostealer cookie extractor in user memory"
    strings:
        $c1 = "Cookies\\\\Default\\\\Network"
        $c2 = "Login Data"
        $c3 = "encrypted_key"
    condition:
        all of them
}`,
    mitigationSteps: [
      'Implement real-time dark web digital risk monitoring to invalidate leaked employee session cookies immediately.',
      'Shorten SSO session token lifespans and bind session tokens to specific device certificates and IP ranges.',
      'Enforce managed device compliance policies preventing personal unmanaged device access to enterprise apps.',
    ],
  },
  {
    id: 'playbook-incident-response-2026',
    slug: 'incident-response-playbook-first-60-minutes',
    title: 'Enterprise Incident Response Playbook: The First 60 Minutes of Crisis Containment',
    subtitle: 'Standardized operational protocols, isolation playbooks, and evidence chain-of-custody procedures for SOC teams.',
    category: 'Playbook',
    icon: Download,
    image: '/resources/incident-response-guide.jpg',
    isNew: false,
    tlp: 'TLP:CLEAR',
    author: {
      name: 'DFIR Readiness Team',
      role: 'Difaac Crisis Management Group',
      avatar: 'DF',
    },
    date: 'Jun 05, 2026',
    readTime: '20 min read',
    tags: ['DFIR Protocols', 'Containment', 'Forensics', 'Ransomware Triage', 'Regulatory Compliance'],
    executiveSummary:
      'When an active network breach is confirmed, the actions taken in the first 60 minutes determine whether the incident remains a minor containment event or escalates into catastrophic public disclosure. This playbook presents tested operational checklists, command isolation scripts, and legal notification protocols developed across 400+ real-world engagements.',
    keyFindings: [
      'Immediate host network isolation halts ransomware propagation in 93% of active outbreak scenarios.',
      'Volatile memory capture before rebooting preserves crucial encryption keys and unencrypted payload artifacts.',
      'Standardized communications trees prevent inadvertent alerting of active threat actors in corporate Slack/Teams.',
    ],
    killChainSteps: [
      { phase: '0-15 Min: Triage', tactic: 'Detection', techniqueId: 'T1082', details: 'Confirm alert veracity, isolate affected endpoints via EDR API, activate IR bridge.' },
      { phase: '15-30 Min: Scoping', tactic: 'Analysis', techniqueId: 'T1087', details: 'Identify compromised accounts, revoke active Kerberos/OAuth tokens, freeze affected service accounts.' },
      { phase: '30-45 Min: Evidence', tactic: 'Collection', techniqueId: 'T1005', details: 'Execute memory triage script, capture hypervisor snapshot, preserve firewall connection state tables.' },
      { phase: '45-60 Min: Containment', tactic: 'Remediation', techniqueId: 'T1489', details: 'Block external C2 IP/domains at perimeter firewall, verify backup immutability status.' },
    ],
    mitreAttack: [
      { tactic: 'Initial Response', id: 'T1082', technique: 'System Information Discovery', description: 'Automated forensic telemetry collection during containment phase' },
    ],
    iocs: [
      { type: 'SHA256', indicator: '98fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c442', description: 'Difaac IR Memory Acquisition Agent' },
    ],
    yaraRule: `rule Difaac_IR_Evidence_Preservation_Helper {
    meta:
        description = "Identifies unencrypted memory residue from known active loaders"
    strings:
        $token = "Difaac_IR_Active_Containment"
    condition:
        $token
}`,
    mitigationSteps: [
      'Conduct bi-annual purple team simulations testing the 60-minute isolation playbook with executive leadership.',
      'Maintain an out-of-band communication channel (Signal / separate tenant) for incident coordination.',
      'Pre-negotiate external DFIR retainer agreements with guaranteed 1-hour SLA response times.',
    ],
  },
]

const CATEGORIES = [
  'All Intelligence',
  'Report',
  'APT Investigation',
  'Ransomware',
  'Supply Chain',
  'Playbook',
] as const

export default function ResourcesPage() {
  const { hash } = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<string>('All Intelligence')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<ThreatArticle | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'killchain' | 'iocs' | 'mitre' | 'yara'>('overview')
  const [copiedIoc, setCopiedIoc] = useState<string | null>(null)
  const [downloadToast, setDownloadToast] = useState<string | null>(null)

  // Synchronize hash with filter category if linked from navbar
  useEffect(() => {
    const rawHash = hash.replace('#', '').toLowerCase()
    if (rawHash.includes('report')) setSelectedCategory('Report')
    else if (rawHash.includes('apt')) setSelectedCategory('APT Investigation')
    else if (rawHash.includes('ransomware')) setSelectedCategory('Ransomware')
    else if (rawHash.includes('playbook')) setSelectedCategory('Playbook')
  }, [hash])

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return threatResearchData.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All Intelligence' || article.category === selectedCategory

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.executiveSummary.toLowerCase().includes(query) ||
        article.tags.some((t) => t.toLowerCase().includes(query)) ||
        article.author.name.toLowerCase().includes(query) ||
        article.iocs.some((ioc) => ioc.indicator.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const featuredArticle = threatResearchData.find((a) => a.isFeatured) || threatResearchData[0]

  const handleCopyIoc = (indicator: string) => {
    navigator.clipboard.writeText(indicator)
    setCopiedIoc(indicator)
    setTimeout(() => setCopiedIoc(null), 2500)
  }

  const handleDownloadReport = (article: ThreatArticle) => {
    setDownloadToast(`Preparing PDF intelligence dossier for "${article.title}"...`)
    setTimeout(() => {
      setDownloadToast(null)
      // Trigger download alert
      alert(`Dossier Download: "${article.title}" (TLP:CLEAR PDF) has been prepared and downloaded.`)
    }, 1200)
  }

  return (
    <>
      {/* ── Top Hero ── */}
      <div className="relative overflow-hidden bg-ink">
        <PageHero
          eyebrow="Threat Intelligence Hub"
          title="Threat Research & Analyst Briefs"
          description="Actionable intelligence, in-depth adversary investigations, APT campaign breakdowns, and defense playbooks from the frontlines of Difaac Cyber Defense Lab."
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Resources' },
          ]}
        />
      </div>

      {/* ── Intelligence Feed Metrics Bar ── */}
      <div className="border-y border-line bg-ink-2">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-3 border-r border-line/40 pr-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-2">Monitored Countries</p>
                <p className="font-mono text-base font-bold text-text">70+ Nations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-r border-line/40 pr-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-2">Active APT Trackers</p>
                <p className="font-mono text-base font-bold text-brand">380+ Groups</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-r border-line/40 pr-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Terminal className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-2">Daily IOC Ingestion</p>
                <p className="font-mono text-base font-bold text-text">1.4M+ Indicators</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-2">Forensic IR Cases</p>
                <p className="font-mono text-base font-bold text-brand">400+ Missions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Research Portal Section ── */}
      <section className="relative bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ── Featured Research Spotlight (Group-IB Flagship Style) ── */}
          {featuredArticle && !searchQuery && selectedCategory === 'All Intelligence' && (
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex size-2 animate-ping rounded-full bg-brand" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                  Featured Intelligence Investigation
                </span>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-line bg-ink-2 shadow-2xl transition-all duration-300 hover:border-brand/50">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left Column: Visual Cover */}
                  <div className="relative min-h-[320px] overflow-hidden lg:col-span-5 lg:min-h-[440px]">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-2" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="rounded bg-brand px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-brand-ink">
                        ANNUAL REPORT
                      </span>
                      <span className="rounded border border-line-soft bg-ink/90 px-2.5 py-1 font-mono text-[11px] font-medium text-text backdrop-blur-sm">
                        {featuredArticle.tlp}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: In-depth Context */}
                  <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-2">
                        <span className="flex items-center gap-1.5 font-medium text-text">
                          <span className="flex size-6 items-center justify-center rounded-full bg-brand/20 font-mono text-[10px] font-bold text-brand">
                            {featuredArticle.author.avatar}
                          </span>
                          {featuredArticle.author.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          {featuredArticle.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {featuredArticle.readTime}
                        </span>
                      </div>

                      <h2
                        onClick={() => setSelectedArticle(featuredArticle)}
                        className="cursor-pointer font-display text-2xl font-bold tracking-tight text-text transition-colors hover:text-brand sm:text-3xl"
                      >
                        {featuredArticle.title}
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
                        {featuredArticle.subtitle}
                      </p>

                      {/* Key highlights teaser */}
                      <div className="mt-6 rounded-lg border border-line/60 bg-ink-3/60 p-4">
                        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-brand">
                          Key Executive Findings:
                        </p>
                        <ul className="space-y-1.5 text-xs text-body sm:text-sm">
                          {featuredArticle.keyFindings.slice(0, 2).map((kf, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
                              <span>{kf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tag Chips */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {featuredArticle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-line bg-ink px-2.5 py-1 text-xs text-muted-2"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line/60 pt-6">
                      <Button
                        onClick={() => setSelectedArticle(featuredArticle)}
                        className="gap-2 bg-brand px-6 py-2.5 font-semibold text-brand-ink hover:bg-brand-bright"
                      >
                        Read Investigation
                        <ArrowRight className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadReport(featuredArticle)}
                        className="gap-2 border-line text-text hover:border-brand/40 hover:text-brand"
                      >
                        <Download className="size-4" />
                        Download Dossier (PDF)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Search & Filter Controls Toolbar ── */}
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                      isSelected
                        ? 'border border-brand bg-brand/10 text-brand shadow-sm shadow-brand/20'
                        : 'border border-line bg-ink-2 text-muted-2 hover:border-line-soft hover:bg-ink-3 hover:text-text'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threat actors, IOCs, CVEs..."
                className="w-full rounded-lg border border-line bg-ink-2 py-2 pr-4 pl-9 text-sm text-text placeholder:text-muted-2/60 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-2 hover:text-text"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Research Articles Grid ── */}
          {filteredArticles.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-line bg-ink-2 p-10 text-center">
              <Bug className="size-12 text-muted-2/40" />
              <h3 className="mt-4 text-lg font-bold text-text">No threat research reports found</h3>
              <p className="mt-1 text-sm text-muted-2">
                Try refining your search terms or selecting a different category filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('All Intelligence')
                  setSearchQuery('')
                }}
                className="mt-5 border-line text-xs text-brand"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => {
                const IconComponent = article.icon
                return (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-ink-2 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/5"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-ink-3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />

                      {/* Header badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded bg-ink/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-brand border border-line-soft backdrop-blur-sm">
                          {article.category}
                        </span>
                        {article.isNew && (
                          <span className="rounded bg-brand px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-ink">
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="absolute right-3 bottom-3 rounded bg-ink/80 px-2 py-0.5 font-mono text-[11px] text-muted-2 backdrop-blur-sm">
                        {article.readTime}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        {/* Meta info */}
                        <div className="mb-3 flex items-center gap-2 text-xs text-muted-2">
                          <Calendar className="size-3.5" />
                          <span>{article.date}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-brand">{article.tlp}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg font-bold leading-snug text-text transition-colors group-hover:text-brand line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Subtitle / Excerpt */}
                        <p className="mt-2 text-xs leading-relaxed text-body line-clamp-3">
                          {article.subtitle}
                        </p>

                        {/* Tag badges */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-ink-3 px-2 py-0.5 font-mono text-[10px] text-muted-2"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer Link */}
                      <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-brand">
                        <span className="flex items-center gap-1.5 group-hover:underline">
                          Read Investigation
                          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                        <span className="text-[11px] text-muted-2">
                          {article.iocs.length} IOCs
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Interactive Deep-Dive Report Reader (Group-IB Style) ── */}
      {selectedArticle && (
        <DialogPrimitive.Root
          open={!!selectedArticle}
          onOpenChange={(open) => !open && setSelectedArticle(null)}
        >
          <DialogPrimitive.Portal>
            <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md transition-opacity" />
            <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
              <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-ink shadow-2xl">

                {/* Modal Header Bar */}
                <div className="relative flex shrink-0 items-center justify-between border-b border-line bg-ink-2 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <selectedArticle.icon className="size-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
                          {selectedArticle.category}
                        </span>
                        <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-muted-2 border border-line">
                          {selectedArticle.tlp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-2">{selectedArticle.date} • {selectedArticle.readTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownloadReport(selectedArticle)}
                      className="hidden gap-1.5 bg-brand/15 text-xs font-semibold text-brand hover:bg-brand hover:text-brand-ink sm:flex"
                    >
                      <Download className="size-3.5" />
                      Export Dossier
                    </Button>
                    <DialogPrimitive.Close
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-2 hover:bg-ink-3 hover:text-text"
                        />
                      }
                    >
                      <X className="size-5" />
                    </DialogPrimitive.Close>
                  </div>
                </div>

                {/* Modal Tab Navigator */}
                <div className="flex shrink-0 border-b border-line bg-ink-3/70 px-6 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'overview'
                        ? 'border-brand text-brand'
                        : 'border-transparent text-muted-2 hover:text-text'
                    }`}
                  >
                    <FileText className="size-3.5" />
                    Executive Summary & Findings
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('killchain')}
                    className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'killchain'
                        ? 'border-brand text-brand'
                        : 'border-transparent text-muted-2 hover:text-text'
                    }`}
                  >
                    <Layers className="size-3.5" />
                    Attack Kill-Chain Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('iocs')}
                    className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'iocs'
                        ? 'border-brand text-brand'
                        : 'border-transparent text-muted-2 hover:text-text'
                    }`}
                  >
                    <Terminal className="size-3.5" />
                    Indicators of Compromise ({selectedArticle.iocs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('mitre')}
                    className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'mitre'
                        ? 'border-brand text-brand'
                        : 'border-transparent text-muted-2 hover:text-text'
                    }`}
                  >
                    <Shield className="size-3.5" />
                    MITRE ATT&CK Mapping
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('yara')}
                    className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === 'yara'
                        ? 'border-brand text-brand'
                        : 'border-transparent text-muted-2 hover:text-text'
                    }`}
                  >
                    <FileCode className="size-3.5" />
                    YARA Hunting Signatures
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                  {/* Article Title Header */}
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold leading-tight text-text sm:text-3xl">
                      {selectedArticle.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-2 sm:text-base">
                      {selectedArticle.subtitle}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-body border-t border-line/50 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-brand-ink">
                          {selectedArticle.author.avatar}
                        </span>
                        <div>
                          <p className="font-medium text-text">{selectedArticle.author.name}</p>
                          <p className="text-[11px] text-muted-2">{selectedArticle.author.role}</p>
                        </div>
                      </div>
                      <span className="text-muted-2">•</span>
                      <span>Published: <strong className="text-text">{selectedArticle.date}</strong></span>
                      <span className="text-muted-2">•</span>
                      <span>Classification: <strong className="font-mono text-brand">{selectedArticle.tlp}</strong></span>
                    </div>
                  </div>

                  {/* Tab 1: Overview */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Image Banner */}
                      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-line sm:h-72">
                        <img
                          src={selectedArticle.image}
                          alt={selectedArticle.title}
                          className="h-full w-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                      </div>

                      {/* Executive Summary */}
                      <div className="rounded-xl border border-line bg-ink-2 p-6">
                        <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand">
                          <Activity className="size-4" />
                          Executive Intelligence Summary
                        </h3>
                        <p className="text-sm leading-relaxed text-body sm:text-base">
                          {selectedArticle.executiveSummary}
                        </p>
                      </div>

                      {/* Key Findings List */}
                      <div>
                        <h3 className="mb-4 font-display text-lg font-bold text-text">
                          Key Analytical Findings & Telemetry
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {selectedArticle.keyFindings.map((finding, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 rounded-lg border border-line/60 bg-ink-3/40 p-4"
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/20 font-mono text-xs font-bold text-brand">
                                {idx + 1}
                              </span>
                              <p className="text-xs leading-relaxed text-body sm:text-sm">{finding}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mitigation Steps */}
                      <div className="rounded-xl border border-brand/30 bg-brand/5 p-6">
                        <h3 className="mb-3 font-display text-base font-bold text-text">
                          Recommended Defensive Actions & Countermeasures
                        </h3>
                        <ul className="space-y-2.5 text-xs leading-relaxed text-body sm:text-sm">
                          {selectedArticle.mitigationSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Attack Kill Chain */}
                  {activeTab === 'killchain' && (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-2">
                        Tactical reconstruction of the adversary's intrusion path from initial compromise to final objective:
                      </p>

                      <div className="space-y-4">
                        {selectedArticle.killChainSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="relative flex flex-col gap-3 rounded-xl border border-line bg-ink-2 p-5 transition-all hover:border-brand/40 sm:flex-row sm:items-start"
                          >
                            <div className="flex shrink-0 items-center gap-3 sm:w-56">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 font-mono text-xs font-bold text-brand">
                                0{idx + 1}
                              </div>
                              <div>
                                <p className="font-bold text-text text-sm">{step.phase}</p>
                                <span className="rounded bg-ink px-2 py-0.5 font-mono text-[10px] text-brand border border-line">
                                  {step.techniqueId}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 border-t border-line/40 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                              <p className="text-xs leading-relaxed text-body sm:text-sm">
                                {step.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: IOCs */}
                  {activeTab === 'iocs' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-sm text-muted-2">
                          Verified Indicators of Compromise associated with this adversary campaign:
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            const allIocsText = selectedArticle.iocs
                              .map((i) => `${i.type}: ${i.indicator} (${i.description})`)
                              .join('\n')
                            navigator.clipboard.writeText(allIocsText)
                            setCopiedIoc('ALL')
                            setTimeout(() => setCopiedIoc(null), 2000)
                          }}
                          className="border-line bg-ink-2 text-xs text-brand hover:bg-brand hover:text-brand-ink"
                        >
                          {copiedIoc === 'ALL' ? (
                            <>
                              <Check className="size-3.5" />
                              Copied All ({selectedArticle.iocs.length})
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" />
                              Copy All Indicators
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-line bg-ink-2">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-line bg-ink-3/80 font-mono uppercase text-muted-2">
                            <tr>
                              <th className="py-3 px-4">Type</th>
                              <th className="py-3 px-4">Indicator Value</th>
                              <th className="py-3 px-4">Description</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line font-mono">
                            {selectedArticle.iocs.map((ioc, idx) => (
                              <tr key={idx} className="transition-colors hover:bg-ink-3/50">
                                <td className="py-3 px-4 text-brand font-bold">{ioc.type}</td>
                                <td className="py-3 px-4 text-text select-all break-all">{ioc.indicator}</td>
                                <td className="py-3 px-4 font-sans text-muted-2">{ioc.description}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyIoc(ioc.indicator)}
                                    className="inline-flex items-center gap-1 rounded bg-ink-3 px-2 py-1 text-[11px] font-sans text-brand transition-colors hover:bg-brand hover:text-brand-ink"
                                  >
                                    {copiedIoc === ioc.indicator ? (
                                      <>
                                        <Check className="size-3" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="size-3" />
                                        Copy
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: MITRE ATT&CK */}
                  {activeTab === 'mitre' && (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-2">
                        Enterprise ATT&CK matrix mapping for automated threat hunting and detection engineering:
                      </p>

                      <div className="overflow-x-auto rounded-xl border border-line bg-ink-2">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-line bg-ink-3/80 font-mono uppercase text-muted-2">
                            <tr>
                              <th className="py-3 px-4">Tactic</th>
                              <th className="py-3 px-4">Technique ID</th>
                              <th className="py-3 px-4">Technique Name</th>
                              <th className="py-3 px-4">Adversary Procedure</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-line">
                            {selectedArticle.mitreAttack.map((item, idx) => (
                              <tr key={idx} className="transition-colors hover:bg-ink-3/50">
                                <td className="py-3 px-4 font-bold text-text">{item.tactic}</td>
                                <td className="py-3 px-4 font-mono font-bold text-brand">{item.id}</td>
                                <td className="py-3 px-4 font-medium text-text">{item.technique}</td>
                                <td className="py-3 px-4 text-body leading-relaxed">{item.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tab 5: YARA Rule */}
                  {activeTab === 'yara' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-2">
                          Production-tested YARA rule for endpoint scanning and memory analysis:
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyIoc(selectedArticle.yaraRule)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-brand-ink transition-colors"
                        >
                          {copiedIoc === selectedArticle.yaraRule ? (
                            <>
                              <Check className="size-3.5" />
                              Rule Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" />
                              Copy YARA Syntax
                            </>
                          )}
                        </button>
                      </div>

                      <div className="rounded-xl border border-line bg-[#020508] p-5 font-mono text-xs text-brand/90 overflow-x-auto shadow-inner">
                        <pre className="leading-relaxed whitespace-pre">
                          {selectedArticle.yaraRule}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Bottom Footer */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-line bg-ink-2 px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-muted-2">
                    <Shield className="size-4 text-brand" />
                    <span>Validated by Difaac Threat Intelligence Unit</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadReport(selectedArticle)}
                      className="gap-2 border-line text-xs text-text hover:border-brand/40 hover:text-brand"
                    >
                      <Download className="size-3.5" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => {
                        handleDownloadReport(selectedArticle)
                        setSelectedArticle(null)
                      }}
                      className="bg-brand text-xs font-semibold text-brand-ink hover:bg-brand-bright"
                    >
                      Access Full Telemetry
                    </Button>
                  </div>
                </div>

              </div>
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      {/* ── Newsletter & Threat Telemetry Feed Subscription ── */}
      <section className="border-t border-line bg-ink-2 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner
            title="Subscribe to Difaac Threat Intelligence Feed"
            highlight="Threat Intelligence Feed"
            description="Receive real-time zero-day advisories, Indicators of Compromise (IOCs), and adversary campaign briefings directly into your security operations center."
            primaryCta={{ label: 'Request Intelligence Access', href: '/talk-to-sales' }}
            secondaryCta={{ label: 'Explore SOC Workspace', href: '/workspace' }}
          />
        </div>
      </section>
    </>
  )
}
