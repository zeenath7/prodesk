import ContactSection from "@/components/ContactSection";
export const metadata = { title: "Contact | ProDesk" };
export default function ContactPage() {
  return (
    <main className="container-x py-12">
      <h1 data-scroll-reveal className="mb-10 text-4xl font-semibold tracking-tight">Let&apos;s Talk</h1>
      <div data-scroll-reveal>
        <ContactSection />
      </div>
    </main>
  );
}
