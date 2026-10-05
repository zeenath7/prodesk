import Link from "next/link";
interface Props { title: string; text: string; primary: { label: string; href: string }; secondary: { label: string; href: string } }
export default function CTASection({ title, text, primary, secondary }: Props) {
  return (
    <section data-scroll-reveal className="bg-brand">
      <div className="container-x flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="!text-white text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-blue-100">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primary.href} className="btn bg-white text-brand hover:bg-blue-50">{primary.label}</Link>
          <Link href={secondary.href} className="btn border border-white/60 text-white hover:bg-white/10">{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}
