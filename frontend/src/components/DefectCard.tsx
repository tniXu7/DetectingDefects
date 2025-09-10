import React from "react";

export default function DefectCard({ defect }: { defect: any }) {
  return (
    <div className="border rounded p-3 mb-2">
      <h3 className="font-bold">{defect.title}</h3>
      <p>{defect.description}</p>
      <div className="text-sm text-gray-600">Статус: {defect.status}</div>
    </div>
  );
}
