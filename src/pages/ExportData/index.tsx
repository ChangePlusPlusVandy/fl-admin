import React, { useState, useEffect } from "react";
import { generateHmacSignature } from "../../utils/hmac";
import "./index.css";

const ExportData: React.FC = () => {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const [selectedYear, selectedMonth] = value.split("-").map(Number);
    setYear(selectedYear);
    setMonth(selectedMonth - 1);
  };

  const requestExportData = async () => {
    try {
      let api_url = process.env.REACT_APP_API_URL;
      const key = process.env.REACT_APP_API_KEY || "";
      let signature = generateHmacSignature("GET", key);
      let url = `${api_url}/friend/exportData/`;

      if (month != null && year != null && year != 0) {
        signature = generateHmacSignature(
          JSON.stringify({ month: month.toString(), year: year.toString() }),
          key
        );
        url += `?month=${month}&year=${year}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Friends-Life-Signature": signature,
        },
      });
      if (response != null && response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attendance.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert("Failed to download CSV");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error: " + error.message);
      } else {
        console.error("Unexpected error");
      }
    }
  };

  return (
    <div className="export-data-container">
      <div className="export-data-header">
        <h1>Export Data</h1>
        <div className="export-data-subheader">
          <p>Click the button to download this month's attendances</p>
        </div>
        <div className="export-data-selector">
          <label>Or, select a specific month and year: </label>
          <input type="month" onChange={handleDateChange}></input>
        </div>
        <div className="export-data-button-container">
          <button
            className="export-data-button"
            onClick={() => {
              requestExportData();
            }}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExportData;
