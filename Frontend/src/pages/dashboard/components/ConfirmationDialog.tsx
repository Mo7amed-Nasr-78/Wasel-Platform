import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmLabel?: string;
	loadingLabel?: string;
	isLoading?: boolean;
}

function ConfirmationDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	confirmLabel = "تأكيد",
	loadingLabel = "جارٍ التنفيذ...",
	isLoading = false,
}: ConfirmationDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="max-w-lg [&>button]:left-4 [&>button]:right-auto"
				dir="rtl"
			>
				<DialogHeader>
					<div className="mb-0 flex items-center gap-3">
						<div className="rounded-full bg-amber-100 p-3">
							<AlertCircle className="h-6 w-6 text-amber-600" />
						</div>
						<DialogTitle className="text-lg">
							{title}
						</DialogTitle>
					</div>
				</DialogHeader>

				<DialogDescription className="mb-2 text-base">
					{description}
				</DialogDescription>

				<DialogFooter className="gap-1">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? loadingLabel : confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default ConfirmationDialog;
