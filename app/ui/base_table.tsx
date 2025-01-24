import React, { useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";

export interface Column {
  key: string;
  header: string;
  type?: "text" | "badge" | "image" | "actions";
  badgeConfig?: {
    colors: {
      [key: string]: string;
    };
  };
  imageConfig?: {
    fallbackSrc: string;
    width: string;
    height: string;
    rounded?: boolean;
  };
}

export interface BaseTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  error?: string;
  identifierKey: string;
}

const BaseTable: React.FC<BaseTableProps> = ({
  columns,
  data,
  title,
  onEdit,
  onDelete,
  loading,
  error,
  identifierKey,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const renderCell = (item: any, column: Column) => {
    const value = item[column.key];

    switch (column.type) {
      case "badge":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${column.badgeConfig?.colors[value] || "bg-gray-500"}`}
          >
            {value}
          </span>
        );

      case "image":
        return (
          <img
            src={value}
            alt={`${column.key}`}
            className={`${column.imageConfig?.width || "w-10"} ${column.imageConfig?.height || "h-10"} 
              ${column.imageConfig?.rounded ? "rounded-full" : ""}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                column.imageConfig?.fallbackSrc || "/placeholder-avatar.png";
            }}
          />
        );

      case "actions":
        return (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item[identifierKey])}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <FiEdit className="h-4 w-4 text-white" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => handleDeleteClick(item[identifierKey])}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <FiTrash2 className="h-4 w-4 text-red-500" />
              </button>
            )}
          </div>
        );

      default:
        return value || "-";
    }
  };

  if (loading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg bg-gray-900">
        {title && (
          <h2 className="px-6 py-4 text-lg font-semibold text-white">
            {title}
          </h2>
        )}
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs uppercase bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-6 py-3">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item[identifierKey]}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                } border-gray-700`}
              >
                {columns.map((column) => (
                  <td
                    key={`${item[identifierKey]}-${column.key}`}
                    className="px-6 py-4"
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BaseTable;
