import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommentTruckDialogProps {
	open: boolean;
	comment: string;
	isSubmitting: boolean;
	onCommentChange: (comment: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	onOpenChange: (open: boolean) => void;
}

function CommentTruckDialog({
	open,
	comment,
	isSubmitting,
	onCommentChange,
	onSubmit,
	onOpenChange,
}: CommentTruckDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-lg bg-(--bg-color) border-0"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-(--primary-text) text-right">
						إرسال تعليق للشاحنة
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit} className="space-y-4">
					<label className="text-sm font-medium text-(--primary-text) block text-right">
						نص التعليق
					</label>
					<textarea
						value={comment}
						onChange={(event) =>
							onCommentChange(event.target.value)
						}
						placeholder="اكتب تعليقًا للشاحنة..."
						required
						disabled={isSubmitting}
						className="w-full min-h-28 rounded-md border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
					/>
					<div className="flex gap-3 pt-2">
						<Button
							size="lg"
							type="submit"
							disabled={
								isSubmitting || !comment.trim()
							}
							className="flex-1 bg-(--primary-color) text-white hover:bg-(--primary-color)/80"
						>
							{isSubmitting
								? "جاري الإرسال..."
								: "إرسال التعليق"}
						</Button>
						<Button
							size="lg"
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
							className="flex-1"
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CommentTruckDialog;
