import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { company } from "@/data/company";
import { waLink } from "@/lib/utils";

export default function ContactSection() {
  const rows = [[MapPin, "Address", company.address], [Phone, "Phone", company.phone], [Mail, "Email", company.email], [MessageCircle, "WhatsApp", company.phone], [Clock, "Business hours", company.hours]] as const;
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <ul className="space-y-5">
          {rows.map(([Icon, label, value]) => (
            <li key={label} className="flex gap-4">
              <Icon className="mt-0.5 h-5 w-5 text-brand" />
              <div><p className="text-sm text-slate-500">{label}</p><p className="font-medium text-ink">{value}</p></div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={company.phoneHref} className="btn-primary"><Phone className="h-4 w-4" />Call Us</a>
          <a href={waLink()} className="btn-outline"><MessageCircle className="h-4 w-4" />WhatsApp Us</a>
        </div>
      </div>
      {/* Replace with a Google Maps <iframe> embed once the address is known. */}
      <div className="flex min-h-72 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-500">Google Maps placeholder</div>
    </div>
  );
}
