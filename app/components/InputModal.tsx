"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InputModalProps {
  open: boolean;
  title: string;
  placeholder?: string;
  initialValue: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  open,
  title,
  placeholder = "Enter value",
  initialValue,
  onSave,
  onCancel,
  onOpenChange,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  const handleSave = useCallback(() => {
    onSave(value);
    onOpenChange(false); // Close the modal after saving
  }, [value, onSave, onOpenChange]);

  const handleCancel = useCallback(() => {
    onCancel();
    onOpenChange(false); // Close the modal after canceling
  }, [onCancel, onOpenChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-4"
          autoFocus
          placeholder={placeholder}
          onKeyDown={handleKeyDown} // Listen for Enter and Escape
        />
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InputModal;
