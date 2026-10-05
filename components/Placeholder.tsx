import { icons } from "lucide-react";
// Stand-in for product photography. Swap for <Image> once real photos exist.
export default function Placeholder({ icon = "Package", className = "" }: { icon?: string; className?: string }) {
  const Icon = icons[icon as keyof typeof icons] ?? icons.Package;
  return (
    <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`} role="img" aria-label="Image placeholder">
      <Icon className="h-10 w-10" strokeWidth={1.25} />
    </div>
  );
}
