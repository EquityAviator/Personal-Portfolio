import { CaseStudyProvider } from "@/components/case-study/case-study-overlay";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { ProofStrip } from "@/components/site/proof-strip";
import { SelectedWork } from "@/components/site/selected-work";
import { HowIBuild } from "@/components/site/how-i-build";
import { Capabilities } from "@/components/site/capabilities";
import { Research } from "@/components/site/research";
import { Education } from "@/components/site/education";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";
import { BackToTop } from "@/components/site/back-to-top";
import { ResumePrint } from "@/components/site/resume-print";

export default function Home() {
  return (
    <CaseStudyProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <Hero />
          <ProofStrip />
          <SelectedWork />
          <HowIBuild />
          <Capabilities />
          <Research />
          <Education />
          <About />
          <Contact />
        </main>
        <SiteFooter />
        <BackToTop />
      </div>
      {/* Print-only résumé document (revealed by body.resume-print, see
          resume-print.tsx) — a body-level sibling so the print layout can
          hide the whole page wrapper around it. */}
      <ResumePrint />
    </CaseStudyProvider>
  );
}
