import { useState } from "react";

interface PdfViewerProps {
  pdfUrl?: string;
}

const PdfViewer = ({ pdfUrl }: PdfViewerProps) => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="mt-4">
      {pdfUrl ? (
        <div className="relative">
          <iframe
            src={pdfUrl}
            className="h-[600px] w-full border border-gray-300"
            style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-500">
          No PDF file provided
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
