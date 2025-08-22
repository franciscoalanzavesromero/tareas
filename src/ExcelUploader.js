import React from "react";
import * as XLSX from "xlsx";

const ExcelUploader = ({ onData }) => {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    onData(jsonData);
  };

  return (
    <div className="mb-3">
      <input
        type="file"
        accept=".xlsx, .xls"
        className="form-control"
        onChange={handleFile}
      />
    </div>
  );
};

export default ExcelUploader;
