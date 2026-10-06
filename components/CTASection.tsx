import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export default function CTASection({ title, text, primary, secondary }: Props) {
  const isExternal = secondary.href.startsWith("http");

  return (
    <section data-scroll-reveal className="relative overflow-hidden bg-gradient-to-r from-brand-dark via-brand to-brand py-16 sm:py-20 text-white">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-deal/10 blur-3xl pointer-events-none" />

      <div className="container-x relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3">
            Fast B2B Turnaround
          </span>
          <h2 className="!text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
            {text}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row shrink-0 w-full sm:w-auto">
          <Link
            href={primary.href}
            className="btn bg-white text-brand hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <span>{primary.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {isExternal ? (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/50 text-white hover:bg-white/10 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-emerald-300" />
              <span>{secondary.label}</span>
            </a>
          ) : (
            <Link
              href={secondary.href}
              className="btn border border-white/50 text-white hover:bg-white/10 text-xs sm:text-sm font-bold transition-all"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
