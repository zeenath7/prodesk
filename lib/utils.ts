import { company } from "@/data/company";
export const waLink = (msg = "Hello ProDesk, I would like to make an enquiry.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(msg)}`;
export const formatPrice = (p: number | null) => (p === null ? "Request Quote" : `$${p.toFixed(2)}`);
