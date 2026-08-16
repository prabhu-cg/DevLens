import {
  Hero,
  HeroPreview,
  CoreProblem,
  ThreeCapabilities,
  WorkflowSteps,
  DeveloperQuestionsSection,
  DocumentationPreview,
  ReadinessSection,
  PrivacySection,
  SampleCta,
  Faq,
  FinalCta,
} from '../../components/marketing';

export function LandingPage() {
  return (
    <>
      <Hero />
      <HeroPreview />
      <CoreProblem />
      <ThreeCapabilities />
      <WorkflowSteps />
      <DeveloperQuestionsSection />
      <DocumentationPreview />
      <ReadinessSection />
      <PrivacySection />
      <SampleCta />
      <Faq />
      <FinalCta />
    </>
  );
}
