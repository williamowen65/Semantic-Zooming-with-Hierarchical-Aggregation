# 11 — Infrastructure and Deployment

## Table of Contents
- [Purpose](#purpose)
- [Existing Infrastructure](#existing-infrastructure)
- [Azure vs AWS](#azure-vs-aws)
- [Deployment Concerns](#deployment-concerns)
- [Open Questions](#open-questions)

## Purpose
Separate cloud/deployment decisions from the Atlas domain model while taking advantage of the rewrite to reconsider operational choices deliberately.

## Existing Infrastructure
The previous application used Azure and may have Terraform infrastructure-as-code. Treat that configuration as documentation of operational requirements as well as potentially reusable code.

## Azure vs AWS
- [ ] Inventory what Azure currently provides.
- [ ] Identify concrete reasons for or against moving to AWS.
- [ ] If evaluating AWS, map requirements to AWS services before translating Terraform.
- [ ] Do not assume Terraform makes cloud migration a provider-name substitution; resource semantics differ.

## Deployment Concerns
- [ ] Database hosting.
- [ ] Secrets management.
- [ ] DNS/TLS.
- [ ] Logging/observability.
- [ ] C# application deployment.
- [ ] Python service deployment.
- [ ] Independent scaling.
- [ ] Queue/background infrastructure if needed.
- [ ] CI/CD.

## Open Questions
- [ ] Stay on Azure or move to AWS?
- [ ] What concrete benefit justifies a cloud migration?
- [ ] What is required for the first milestone versus later production hardening?