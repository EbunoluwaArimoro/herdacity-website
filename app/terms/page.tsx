import Footer from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <>
    <section className="pt-40 pb-20 bg-brand-off-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-display font-bold text-brand-charcoal mb-8">Terms of Service</h1>
        <p className="text-sm text-brand-charcoal/50 mb-12">Last Updated: December 2025</p>
        
        <div className="prose prose-lg text-brand-charcoal/80">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing the HERdacity website and community, you agree to be bound by these terms.</p>
          
          <h3>2. Community Guidelines</h3>
          <p>We require all members to treat each other with respect. Harassment or hate speech will result in immediate removal.</p>
          
          <h3>3. Intellectual Property</h3>
          <p>Content provided in our masterclasses and workshops is for personal use only and may not be redistributed.</p>
          
          <h3>4. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time.</p>
        </div>
      </div>
    </section>

    <Footer />
  </>
  );
}