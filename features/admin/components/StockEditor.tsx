"use client";

import { useState } from "react";
import { updateStockAction } from "../actions/inventory.actions";
import { toast } from "react-hot-toast";
import { FaPlus, FaMinus, FaSync } from "react-icons/fa";

interface StockEditorProps {
  productId: string;
  initialQuantity: number;
}

export default function StockEditor({ productId, initialQuantity }: StockEditorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newVal: number) => {
    if (newVal < 0) return;
    setIsLoading(true);
    const result = await updateStockAction(productId, newVal);
    if (result.success) {
      setQuantity(newVal);
      toast.success("Stock updated", { duration: 1000 });
    } else {
      toast.error("Failed to update");
    }
    setIsLoading(false);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="input-group input-group-sm" style={{ width: '130px' }}>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => handleUpdate(quantity - 1)}
          disabled={isLoading || quantity <= 0}
        >
          <FaMinus size={10} />
        </button>
        <input 
          type="number" 
          className="form-control text-center fw-bold" 
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          onBlur={(e) => handleUpdate(parseInt(e.target.value) || 0)}
          disabled={isLoading}
        />
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => handleUpdate(quantity + 1)}
          disabled={isLoading}
        >
          <FaPlus size={10} />
        </button>
      </div>
      {isLoading && <FaSync className="animate-spin text-muted" size={12} />}
    </div>
  );
}
