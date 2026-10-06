export default function SectionHeading({ title, subtitle, className = "" }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-lg text-slate-600">{subtitle}</p>}
    </div>
  );
}
