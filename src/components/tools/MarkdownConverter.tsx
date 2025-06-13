import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState("");

  const convertMarkdownToHtml = (markdownText) => {
    // Convert Markdown to HTML
    let html = markdownText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
      .replace(/\*(.*?)\*/gim, '<i>$1</i>')
      .replace(/^- (.*)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*)/gim, '<ol><li>$1</li></ol>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\n/gim, '<br />');

    return html.trim();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Markdown Input</label>
            <Textarea
              placeholder="Type your Markdown here..."
              className="min-h-[150px] resize-none"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">HTML Preview</label>
            <div
              className="min-h-[150px] p-4 border rounded bg-transparent"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdown) }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownConverter; 