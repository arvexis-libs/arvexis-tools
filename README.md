# 🛠️ Arvexis Tools  
*CLI & Automation Toolkit for Ops, Compliance, and Engineering Teams*

Arvexis Tools is a collection of secure, auditable command-line utilities and automation scripts designed for daily operational rigor — from custody setup and mandate validation to audit prep and emergency response.

## 🧰 Key Utilities  

- **`arvexis-custody-setup`**  
  Bootstrap compliant MPC custody: generate air-gapped key shards, configure approvers (with hardware key binding), and deploy segregated vaults — all via interactive CLI or IaC-compatible YAML.

- **`arvexis-mandate-check`**  
  Validate live on-chain activity against your investment mandate: asset eligibility, chain permissions, leverage limits, and counterparty whitelists — with PDF-ready compliance reports.

- **`arvexis-audit-export`**  
  Export cryptographically signed, timestamped snapshots of wallet states, transaction histories, and balance proofs — formatted for Big Four auditors (PDF + CSV + Merkle root).

- **`arvexis-emergency-rotate`**  
  Securely rotate signing keys or revoke compromised approvers *without downtime*, using pre-signed offline transactions and hardware confirmation flows.

- **`arvexis-oms-sync`**  
  Bidirectional sync connector for major OMS platforms (e.g., Geneva, Eagle, SS&C) — mapping on-chain positions to fund accounting IDs, with reconciliation diff reporting.

## ✅ Operational Guarantees  
- All tools run locally or in your VPC — never phone home  
- Signed binaries + reproducible builds (verified via Cosign)  
- Role-scoped binaries (e.g., `arvexis-compliance-report` vs `arvexis-ops-rotate`) with built-in permission checks  
- Integrated with HashiCorp Vault & AWS KMS for credential injection  

📁 [Download Binaries](https://releases.arvexis.online/tools) | 📘 [User Guide](https://docs.arvexis.online/tools) | 🐙 [Source](https://github.com/arvexis-labs/tools)