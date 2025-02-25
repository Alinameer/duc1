import { marked } from "marked";
import { Button } from "@/app/components/torch/components/Button";

interface PrintButtonProps {
  markdownContent: string;
  documentTitle: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  markdownContent,
  documentTitle,
}) => {
  const handlePrint = () => {
    const htmlContent = marked(markdownContent);
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { padding: 20px; }
              pre, code { white-space: pre-wrap; word-wrap: break-word; }
              button { display: none; } /* Hide button when printing */
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            <div>${htmlContent}</div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Button size={"L"} onClick={handlePrint}>
      Print Layout
    </Button>
  );
};

export default PrintButton;
