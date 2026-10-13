import { company } from "@/data/company";

export const waLink = (
  msg = "Hello ProDesk, I would like to make an enquiry regarding office & school stationery supplies.",
  whatsapp: string = company.whatsapp,
) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

export const formatPrice = (p: number | null) =>
  p === null ? "Request Quote" : `SAR ${p.toFixed(2)}`;
