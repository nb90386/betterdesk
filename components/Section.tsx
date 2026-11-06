import type { ReactNode } from "react";

export function Eyebrow({ n, children, className = "" }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {n ? <span className="text-signal">{n}</span> : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  n,
  title,
  children,
  className = "",
  id,
}: {
  eyebrow?: string;
  n?: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`reveal max-w-3xl ${className}`}>
      {eyebrow ? <Eyebrow n={n}>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="display mt-4 text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)] text-ink">
        {title}
      </h2>
      {children ? <div className="lede mt-5">{children}</div> : null}
    </div>
  );
}
