import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <header className="wrap pt-6">
        <Link href="/" aria-label="BetterDesk home" className="inline-flex min-h-11 items-center text-ink"><Logo className="text-[1.125rem]" /></Link>
      </header>
      <main id="main" className="wrap flex min-h-[70dvh] flex-col justify-center pb-20 pt-16">
        <h1 className="t-display max-w-[16ch]">This page didn&rsquo;t pick up.</h1>
        <p className="mt-5 max-w-[44ch] text-[1.125rem] leading-relaxed text-ink-2">The link may be old or mistyped. Here is where most people are headed.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/app" variant="secondary">Sample workspace</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">Pricing</ButtonLink>
        </div>
        <p className="t-small mt-10 text-muted">Error 404</p>
      </main>
    </>
  );
}
