"use client";

import { createContext, useContext } from "react";
import { company, type CompanyInfo } from "@/data/company";

const CompanyContext = createContext<CompanyInfo>(company);

/** Server layout provides the Neon-shared profile; defaults to static data. */
export function CompanyProvider({ value, children }: { value: CompanyInfo; children: React.ReactNode }) {
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyInfo {
  return useContext(CompanyContext);
}
