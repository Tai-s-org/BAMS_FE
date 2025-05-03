"use client";

import { useEffect, useState } from "react";

export const ParentListModal = ({ parents, onSelectParent, onClose }) => {
  const [selectedParentId, setSelectedParentId] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="bg-[#BD2427] text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Chọn phụ huynh</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {parents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Không có phụ huynh nào</p>
          ) : (
            <ul className="">
              {parents.map((parent) => (
                <li
                  key={parent.userId}
                  className={`py-3 px-2 cursor-pointer rounded transition-all duration-200 ${
                    selectedParentId === parent.userId
                      ? 'bg-[#BD2427]/10 border-l-4 border-[#BD2427]'
                      : ''
                  }`}
                  onClick={() => {
                    console.log(parent);
                    
                    setSelectedParentId(parent.userId);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{parent.fullname}</h4>
                      <p className="text-sm text-gray-600">{parent.phone}</p>
                      <p className="text-sm text-gray-600">{parent.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(parent.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{parent.address}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (selectedParentId) {
                const parent = parents.find(p => p.userId === selectedParentId);
                if (parent) onSelectParent(parent);
              }
            }}
            disabled={!selectedParentId}
            className={`px-4 py-2 rounded ${selectedParentId
                ? 'bg-[#BD2427] text-white hover:bg-[#BD2427]/90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};