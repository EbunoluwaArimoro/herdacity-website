import ComingSoon from "@/components/sections/ComingSoon";
import Footer from "@/components/layout/Footer";

// Every unknown URL on the site lands here instead of the default Next.js 404.
export default function NotFound() {
  return (
    <main className="w-full selection:bg-brand-pink selection:text-white">
      <ComingSoon
        label="Nothing here"
        title="We could not find that page."
        message="It may have moved, or it may be something we have not built yet. Either way, here is what is open right now."
      />
      <Footer />
    </main>
  );
}
