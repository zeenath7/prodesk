import type { CSSProperties } from "react";

// Per-product photo routing for clean framing and size-specific variants.
const framedPaperPhotos = new Set([
  "ruled-register-f-s-size", "ruled-register-a4-size", "ruled-register-10x8-size",
  "ruled-register-9x7-size", "ruled-register-a5-size", "ruled-register-6x4-size", "ruled-register",
  "tax-invoice", "note-books", "note-books-2", "note-books-3", "note-books-4", "drawing-books",
  "exercise-book", "exercise-book-2", "exercise-book-3", "exercise-book-4", "exercise-book-5",
  "exercise-book-6", "exercise-book-7", "exercise-book-8", "exercise-book-9", "exercise-book-10",
  "computer-paper", "spiral-shorthand-pad", "plotter-paper", "paper-blocks", "legal-pad",
]);

const filesFoldersPhotoSlugs = new Set([
  "a4-box-file", "f-c-box-file", "a5-box-file", "a4-box-file-2", "rigid-box-file", "ring-binder", "ring-binder-2", "ring-binder-3", "glossy-papers-deluxe", "expanding-file", "expanding-file-2", "file-index", "sheet-protector", "a4-card-board-dividers", "monthly-dividers", "a4-pvc-colour-divider", "a4-pvc-colour-divider-2", "a4-pvc-grey-numerical-dividers", "a5-alphabetical-dividers", "a4-alphabetical-dividers", "a4-clip-board", "clip-board", "clip-board-2", "clip-board-3", "suspension-file", "spring-clip-file", "project-file-a4", "portfolio", "colour-paper", "a4-bristol-card", "envelopes", "zipper-bag", "monthly-dividers-2"
]);

const cleanPhotoAssets: Record<string, string> = {
  "metal-desk-set": "metal-desk-set-clean",
  "pen-stand-organisers": "mesh-desk-organizer-matched",
  "pen-stand-organisers-2": "mesh-desk-organizer-matched",
  "metal-desk-set-2": "metal-desk-set-2-clean",
  "magazine-holder": "magazine-holder-clean",
  "border-rolls": "border-rolls-clean",
  "clear-packing-tape-2": "brown-packing-tape-clean",
  "drawer-cabinet": "drawer-cabinet-matched",
  "drawer-cabinet-2": "drawer-cabinet-2-matched",
  "drawer-cabinet-4": "drawer-cabinet-4-matched",
  "metal-tray-2": "metal-tray-2-matched",
  "metal-tray-3": "metal-tray-3-matched",
};

const photoAliases: Record<string, string> = {
  "box-file": "a4-box-file",
  "expanding-file-2": "expanding-file",
  "cheque-book": "expanding-file",
};

export function getProductPhotoStyle(slug: string): CSSProperties {
  const photoSlug = photoAliases[slug] ?? slug;
  const assetSlug = cleanPhotoAssets[photoSlug] ?? (filesFoldersPhotoSlugs.has(photoSlug) ? photoSlug + "-clean" : framedPaperPhotos.has(photoSlug) ? photoSlug + "-framed" : photoSlug);
  const asset = "/product-photography/" + assetSlug + ".webp";

  return {
    backgroundColor: "#fff",
    backgroundImage: 'url("' + asset + '")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  };
}

export default function ProductPhoto({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={"Representative product photo: " + name}
      className={className}
      style={getProductPhotoStyle(slug)}
    />
  );
}
