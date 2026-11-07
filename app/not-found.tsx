import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[80dvh] flex-col justify-center pb-20 pt-32">
      <h1 className="t-display max-w-[16ch]">This page didn&rsquo;t pick up.</h1>
      <p className="t-lede mt-5">The link may be old or mistyped. Here&rsquo;s where most people are headed.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/demo" variant="secondary">See a conversation</ButtonLink>
        <ButtonLink href="/pricing" variant="secondary">Pricing</ButtonLink>
      </div>
      <p className="t-small mt-10 text-muted">Error 404</p>
    </section>
  );
}
