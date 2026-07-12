// src/components/reports/ReportExport.jsx
import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportExport = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log("Exporting to CSV...", data);
    setIsOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("TransitOps Report", 20, 20);
    // Add more content
    doc.save("report.pdf");
    setIsOpen(false);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    // Add sheets
    XLSX.writeFile(wb, "report.xlsx");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Export as CSV</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export as Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Export as PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportExport;