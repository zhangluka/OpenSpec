## ADDED Requirements

### Requirement: Review design command shall exist
The system SHALL provide a `/phsx:review-design` command for design consistency review.

#### Scenario: Review design command is available
- **WHEN** user invokes `/phsx:review-design` command
- **THEN** system executes review design skill
- **AND** system provides review results

### Requirement: Review design command shall verify design adherence
The system SHALL check that implementation adheres to design decisions.

#### Scenario: Design adhered passes check
- **WHEN** implementation follows design decisions
- **THEN** review reports design adherence as satisfactory
- **AND** no design adherence issues are listed

#### Scenario: Design not adhered fails check
- **WHEN** implementation deviates from design decisions
- **THEN** review identifies design deviations
- **AND** review references specific design decisions

### Requirement: Review design command shall verify design coherence
The system SHALL evaluate internal consistency of design decisions.

#### Scenario: Coherent design passes check
- **WHEN** design decisions are internally consistent
- **THEN** review reports design coherence as satisfactory
- **AND** no coherence issues are listed

#### Scenario: Incoherent design fails check
- **WHEN** design decisions conflict with each other
- **THEN** review identifies conflicting decisions
- **AND** review suggests resolution approaches

### Requirement: Review design command shall verify architecture alignment
The system SHALL check that design aligns with system architecture.

#### Scenario: Architecture aligned passes check
- **WHEN** design aligns with system architecture
- **THEN** review reports architecture alignment as satisfactory
- **AND** no architecture alignment issues are listed

#### Scenario: Architecture misaligned fails check
- **WHEN** design conflicts with system architecture
- **THEN** review identifies architecture conflicts
- **AND** review suggests alignment improvements

### Requirement: Review design command shall verify design-specification traceability
The system SHALL ensure design decisions can be traced back to specification requirements.

#### Scenario: Traceable design passes check
- **WHEN** each design decision references specification requirements
- **THEN** review reports traceability as satisfactory
- **AND** no traceability issues are listed

#### Scenario: Untreatable design fails check
- **WHEN** design decisions lack specification references
- **THEN** review identifies untreatable decisions
- **AND** review suggests specification references

### Requirement: Review design command shall evaluate design completeness
The system SHALL check that design addresses all specification requirements.

#### Scenario: Complete design passes check
- **WHEN** design addresses all specification requirements
- **THEN** review reports design completeness as satisfactory
- **AND** no completeness issues are listed

#### Scenario: Incomplete design fails check
- **WHEN** design misses specification requirements
- **THEN** review identifies missing design elements
- **AND** review suggests design additions

### Requirement: Review design command shall evaluate operational readiness
The system SHALL check that design includes sufficient operational considerations for deployment, monitoring, and debugging.

#### Scenario: Operationally ready design passes check
- **WHEN** design documents logging and monitoring strategy
- **AND** design addresses error handling and recovery paths
- **AND** design includes rollback and deployment considerations
- **THEN** review reports operational readiness as satisfactory
- **AND** no operational gaps are listed

#### Scenario: Operationally incomplete design fails check
- **WHEN** design lacks logging and observability strategy
- **OR** design omits error recovery and fallback paths
- **OR** design does not address deployment and rollback approach
- **THEN** review identifies operational gaps
- **AND** review suggests specific operational additions

### Requirement: Review design command shall assess technical debt
The system SHALL evaluate whether the design introduces or accumulates technical debt, and whether debt is appropriately acknowledged.

#### Scenario: Low debt design passes check
- **WHEN** design avoids unnecessary complexity
- **AND** known trade-offs are explicitly documented
- **AND** technical debt is minimal and justified
- **THEN** review reports technical debt as manageable

#### Scenario: High debt design flags concerns
- **WHEN** design introduces significant complexity without justification
- **OR** design defers important refactoring without acknowledgment
- **OR** design copies existing patterns that are known to cause issues
- **THEN** review identifies technical debt concerns
- **AND** review recommends debt reduction strategies or explicit debt documentation

### Requirement: Review design command shall generate structured report
The system SHALL generate a structured review report with clear sections and actionable feedback.

#### Scenario: Review report follows standard format
- **WHEN** review design command completes
- **THEN** report includes Overall Assessment section
- **AND** report includes Dimensions section with scores
- **AND** report includes Design Quality section
- **AND** report includes Recommendations section (Critical, Important, Optional)
- **AND** report includes Conclusion section with next steps

### Requirement: Review design command shall support change context
The system SHALL accept optional change name parameter to target specific changes.

#### Scenario: Review design with change name
- **WHEN** user invokes `/phsx:review-design <change-name>`
- **THEN** system reviews design for specified change
- **AND** report includes change name in header

#### Scenario: Review design without change name
- **WHEN** user invokes `/phsx:review-design` without parameters
- **THEN** system infers change from context
- **OR** system prompts for change name

### Requirement: Review design command shall be available across AI tools
The system SHALL generate review design command files for all supported AI tools.

#### Scenario: Review design available in Claude
- **WHEN** review design command is generated
- **THEN** Claude command file exists at `.claude/commands/phsx/review-design.md`
- **AND** skill file exists at `.claude/skills/phspec-review-design/SKILL.md`
