## ADDED Requirements

### Requirement: Review code command shall exist
The system SHALL provide a `/phsx:review-code` command for code specification compliance review.

#### Scenario: Review code command is available
- **WHEN** user invokes `/phsx:review-code` command
- **THEN** system executes review code skill
- **AND** system provides review results

### Requirement: Review code command shall verify functional correctness
The system SHALL check that implemented code correctly fulfills specification requirements.

#### Scenario: Correct code passes functional check
- **WHEN** code implementation correctly matches specification
- **THEN** review reports functional correctness as satisfactory
- **AND** no functional issues are listed

#### Scenario: Incorrect code fails functional check
- **WHEN** code implementation deviates from specification
- **THEN** review identifies incorrect implementations
- **AND** review references specific specification requirements

### Requirement: Review code command shall verify error handling
The system SHALL evaluate error handling completeness and correctness.

#### Scenario: Proper error handling passes check
- **WHEN** code handles all expected error cases
- **THEN** review reports error handling as satisfactory
- **AND** no error handling issues are listed

#### Scenario: Missing error handling fails check
- **WHEN** code lacks proper error handling
- **THEN** review identifies missing error cases
- **AND** review suggests error handling improvements

### Requirement: Review code command shall verify edge case handling
The system SHALL check handling of boundary conditions and edge cases.

#### Scenario: Edge cases handled properly passes check
- **WHEN** code properly handles edge cases
- **THEN** review reports edge case handling as satisfactory
- **AND** no edge case issues are listed

#### Scenario: Edge cases case unhandled fails check
- **WHEN** code does not handle edge cases
- **THEN** review identifies unhandled edge cases
- **AND** review suggests edge case handling

### Requirement: Review code command shall verify non-functional requirements
The system SHALL evaluate code against non-functional requirements (performance, security, maintainability).

#### Scenario: Non-functional requirements met passes check
- **WHEN** code meets non-functional requirements
- **THEN** review reports non-functional compliance as satisfactory
- **AND** no non-functional issues are listed

#### Scenario: Non-functional requirements violated fails check
- **WHEN** code violates non-functional requirements
- **THEN** review identifies non-functional violations
- **AND** review suggests improvements

### Requirement: Review code command shall detect specification drift
The system SHALL identify discrepancies between current implementation and specification.

#### Scenario: No drift detected
- **WHEN** code matches specification exactly
- **THEN** review reports no specification drift
- **AND** review status indicates alignment

#### Scenario: Drift detected
- **WHEN** code diverges from specification
- **THEN** review identifies drift instances
- **AND** review categorizes drift (feature creep, missing implementation, incorrect implementation)

### Requirement: Review code command shall generate structured report
The system SHALL generate a structured review report with clear sections and actionable feedback.

#### Scenario: Review report follows standard format
- **WHEN** review code command completes
- **THEN** report includes Overall Assessment section
- **AND** report includes Dimensions section with scores
- **AND** report includes Code Quality section
- **AND** report includes Recommendations section (Critical, Important, Optional)
- **AND** report includes Conclusion section with next steps

### Requirement: Review code command shall support change context
The system SHALL accept optional change name parameter to target specific changes.

#### Scenario: Review code with change name
- **WHEN** user invokes `/phsx:review-code <change-name>`
- **THEN** system reviews code for specified change
- **AND** report includes change name in header

#### Scenario: Review code without change name
- **WHEN** user invokes `/phsx:review-code` without parameters
- **THEN** system infers change from context
- **OR** system prompts for change name

### Requirement: Review code command shall be available across AI tools
The system SHALL generate review code command files for all supported AI tools.

#### Scenario: Review code available in Claude
- **WHEN** review code command is generated
- **THEN** Claude command file exists at `.claude/commands/phsx/review-code.md`
- **AND** skill file exists at `.claude/skills/phspec-review-code/SKILL.md`
