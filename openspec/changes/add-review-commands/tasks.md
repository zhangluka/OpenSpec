## 1. Core Command Infrastructure

- [x] 1.1 Add CORE_COMMANDS constant to src/core/shared/tool-detection.ts
- [x] 1.2 Implement isCoreCommand() function in tool-detection.ts
- [x] 1.3 Modify generateCommands() in src/core/command-generation/gator.ts to handle core commands
- [x] 1.4 Add unit tests for isCoreCommand() function
- [x] 1.5 Add unit tests for core command generation logic

## 2. Review Spec Command Implementation

- [x] 2.1 Add getReviewSpecSkillTemplate() to src/core/templates/skill-templates.ts
- [x] 2.2 Add getReviewSpecSkillInstructions() helper function with spec completeness checks
- [x] 2.3 Add getReviewSpecCommandContent() helper for command file generation
- [x] 2.4 Register review-spec command in getCommandTemplates() function
- [x] 2.5 Add adapter for Claude in src/core/command-generation/adapters/claude.ts
- [x] 2.6 Add adapter for DevAgent in src/core/command-generation/adapters/devagent.ts
- [x] 2.7 Add adapter for Continue in src/core/command-generation/adapters/continue.ts
- [x] 2.8 Add unit tests for review-spec template generation
- [x] 2.9 Add unit tests for review-spec adapter functions

## 3. Review Code Command Implementation

- [x] 3.1 Add getReviewCodeSkillTemplate() to src/core/templates/skill-templates.ts
- [x] 3.2 Add getReviewCodeSkillInstructions() helper with functional correctness checks
- [x] 3.3 Add getReviewCodeSkillInstructions() helper with error handling checks
- [x] 3.4 Add getReviewCodeSkillInstructions() helper with edge case checks
- [x] 3.5 Add getReviewCodeSkillInstructions() helper with non-functional requirements checks
- [x] 3.6 Add getReviewCodeSkillInstructions() helper with specification drift detection
- [x] 3.7 Add getReviewCodeCommandContent() helper for command file generation
- [x] 3.8 Register review-code command in getCommandTemplates() function
- [x] 3.9 Add adapter for Claude in src/core/command-generation/adapters/claude.ts
- [x] 3.10 Add adapter for DevAgent in src/core/command-generation/adapters/devagent.ts
- [x] 3.11 Add adapter for Continue in src/core/command-generation/adapters/continue.ts
- [x] 3.12 Add unit tests for review-code template generation
- [x] 3.13 Add unit tests for review-code adapter functions

## 4. Review Design Command Command Implementation

- [x] 4.1 Add getReviewDesignSkillTemplate() to src/core/templates/skill-templates.ts
- [x] 4.2 Add getReviewDesignSkillInstructions() helper with design adherence checks
- [x] 4.3 Add getReviewDesignSkillInstructions() helper with design coherence checks
- [x] 4.4 Add getReviewDesignSkillInstructions() helper with architecture alignment checks
- [x] 4.5 Add getReviewDesignSkillInstructions() helper with traceability checks
- [x] 4.6 Add getReviewDesignSkillInstructions() helper with design completeness checks
- [x] 4.7 Add getReviewDesignCommandContent() helper for command file generation
- [x] 4.8 Register review-design command in getCommandTemplates() function
- [x] 4.9 Add adapter for Claude in src/core/command-generation/adapters/claude.ts
- [x] 4.10 Add adapter for DevAgent in src/core/command-generation/adapters/devagent.ts
- [x] 4.11 Add adapter for Continue in src/core/command-generation/adapters/continue.ts
- [x] 4.12 Add unit tests for review-design template generation
- [x] 4.13 Add unit tests for review-design adapter functions

## 5. Enhanced Verify Command Implementation

- [x] 5.1 Modify existing verify skill template to include multi-dimensional checks
- [x] 5.2 Add code hygiene check logic to verify skill instructions
- [x] 5.3 Add specification compliance matrix check to verify skill instructions
- [x] 5.4 Enhance verify report format with structured sections
- [x] 5.5 Ensure verify maintains suggestion-based approach (no blocking)
- [x] 5.6 Add unit tests for enhanced verify functionality
- [x] 5.7 Add unit tests for code hygiene checks
- [x] 5.8 Add unit tests for compliance matrix checks

## 6. Report Format Standardization

- [ ] 6.1 Create unified report template function in src/core/templates/
- [ ] 6.2 Define standard report sections (Overall Assessment, Dimensions, Recommendations, Conclusion)
- [ ] 6.3 Ensure all review commands use standard report format
- [ ] 6.4 Add unit tests for report format standardization

## 7. Cross-Platform Compatibility

- [ ] 7.1 Verify all file paths use path.join() or path.resolve()
- [ ] 7.2 Add Windows CI test for command generation
- [ ] 7.3 Add cross-platform unit tests for path handling
- [ ] 7.4 Verify case-insensitive file system handling where applicable

## 8. Documentation Updates

- [ ] 8.1 Update docs/workflows.md with review commands usage guide
- [ ] 8.2 Add review command examples to workflows.md
- [ ] 8.3 Document review command reference in docs/review-guide.md
- [ ] 8.4 Document enhanced verify command features
- [ ] 8.5 Update CLI help text to include review commands

## 9. Integration Testing

- [ ] 9.1 Add integration test for review-spec command generation
- [ ] 9.2 Add integration test for review-code command generation
- [ ] 9.3 Add integration test for review-design command generation
- [ ] 9.4 Add integration test for enhanced verify command
- [ ] 9.5 Test core command generation across all AI tools
- [ ] 9.6 Verify generated skill files are valid and loadable

## 10. Manual Verification

- [ ] 10.1 Manually test review-spec command in Claude
- [ ] 10.2 Manually test review-code command in Claude
- [ ] 10.3 Manually test review-design command in Claude
- [ ] 10.4 Manually test enhanced verify command
- [ ] 10.5 Verify review reports follow standard format
- [ ] 10.6 Test review commands with change name parameter
- [ ] 10.7 Test review commands without change name parameter (context inference)
