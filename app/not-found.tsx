import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="container-bd flex min-h-[70dvh] flex-col justify-center py-20">
      <p className="eyebrow"><span className="text-signal">404</span> · Missed connection</p>
      <h1 className="display mt-5 max-w-[16ch] text-[clamp(2.6rem,1.6rem+4vw,4.6rem)] text-ink">This page didn&rsquo;t pick up.</h1>
      <p className="lede mt-5">The link may be old or mistyped. Here&rsquo;s where most people are headed:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/demo" variant="secondary">Sample walkthrough</ButtonLink>
        <ButtonLink href="/pricing" variant="secondary">Pricing</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">Book a demo</ButtonLink>
      </div>
    </section>
  );
}
