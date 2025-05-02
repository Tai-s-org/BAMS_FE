import { useState } from "react";
import { DatePicker } from "../ui/DatePicker";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/Dialog";

export default function RemoveMemberConfirmDialog({ onClose, onConfirm, deleteConfirmOpen, context, deletedId }) {
    const [date, setDate] = useState(new Date());

    return (
        <Dialog open={deleteConfirmOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl shadow-lg border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-[#BD2427]">
                        Xác nhận xóa
                    </DialogTitle>
                    <DialogDescription className="text-gray-700 text-sm mt-1">
                        Bạn có chắc chắn muốn xóa{" "}
                        <span className="font-medium text-[#BD2427]">
                            {context.toString() || ""}
                        </span>{" "}
                        không?
                        <br />
                        <Label className="text-gray-700 text-sm mt-2">Vui lòng xác nhận ngày rời đội</Label>
                        <DatePicker
                            value={date}
                            onChange={(date) => setDate(date)}
                        />
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
                        onClick={() => onConfirm(deletedId, date)}
                        className="bg-[#BD2427] hover:bg-[#9a1e21] text-white font-semibold px-4 py-2 transition-all"
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
