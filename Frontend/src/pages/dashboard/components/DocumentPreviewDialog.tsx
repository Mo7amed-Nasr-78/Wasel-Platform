import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DocumentPreviewDialogProps {
	document: {
		src: string;
		alt: string;
	} | null;
	onClose: () => void;
}

function DocumentPreviewDialog({
	document,
	onClose,
}: DocumentPreviewDialogProps) {
	return (
		<Dialog
			open={!!document}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent className="max-w-4xl">
				{document && (
					<img
						src={document.src}
						alt={document.alt}
						className="max-h-[70vh] w-full rounded-lg object-contain"
					/>
				)}
				<DialogHeader>
					<DialogTitle className="text-(--primary-text) text-center">
						{document?.alt}
					</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

export default DocumentPreviewDialog;
