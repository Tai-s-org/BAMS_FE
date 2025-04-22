import { Button } from "./Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./Dialog";

export default function RemoveConfirmDialog({ onClose, onConfirm, deleteConfirmOpen, context, deletedId }) {
    return (
      <Dialog open={deleteConfirmOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md rounded-xl shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#BD2427]">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm mt-1">
              Bạn có chắc chắn muốn xóa{" "}
              <span className="font-medium text-[#BD2427]">
                {context.toString() || ""}
              </span>{" "}
              không?
            </DialogDescription>
          </DialogHeader>
  
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:text-black hover:border-black transition-all"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => onConfirm(deletedId)}
              className="bg-[#BD2427] hover:bg-[#9a1e21] text-white font-semibold px-4 py-2 transition-all"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  