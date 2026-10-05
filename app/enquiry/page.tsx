import EnquiryForm from "@/components/EnquiryForm";
export const metadata = { title: "Request a Quote | ProDesk" };
export default function EnquiryPage({ searchParams }: { searchParams: { product?: string } }) {
  return (
    <main data-scroll-reveal className="container-x max-w-3xl py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Request a Quote</h1>
      <p className="mb-8 mt-3 text-slate-600">Tell us what you need and the ProDesk team will get back to you.</p>
      <EnquiryForm defaultProduct={searchParams.product} />
    </main>
  );
}
