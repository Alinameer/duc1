// RenameModal.tsx
"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RenameModalProps {
  open: boolean;
  initialValue: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
  open,
  initialValue,
  onSave,
  onCancel,
  onOpenChange,
}) => {
  const [value, setValue] = useState(initialValue);

  // Reset the input value whenever the modal is opened or the initial value changes.
  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-4"
          autoFocus
          placeholder="Enter new name"
        />
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => { onCancel(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={() => { onSave(value); onOpenChange(false); }}>
            Save
          </Button>
        </DialogFooter> 
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
