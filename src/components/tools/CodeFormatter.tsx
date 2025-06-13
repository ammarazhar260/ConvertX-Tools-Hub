import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CodeFormatter = () => {
  const [rawCode, setRawCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const formatCode = (code) => {
    // Remove extra spaces and empty lines
    let lines = code.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    // Normalize indentation
    const indentChar = "  "; // Use spaces for indentation
    let indentLevel = 0;
    const formattedLines = lines.map(line => {
      if (line.endsWith("}") || line.endsWith(")")) {
        indentLevel = Math.max(indentLevel - 1, 0);
      }
      const indentedLine = indentChar.repeat(indentLevel) + line;
      if (line.endsWith("{") || line.endsWith(":")) {
        indentLevel++;
      }
      return indentedLine;
    });

    // Handle nested structures and language-specific rules
    if (language === "python") {
      // Example: Python-specific formatting
      // Adjust indentation for Python blocks
      // This is a placeholder for more complex logic
    }

    return formattedLines.join("\n");
  };

  useEffect(() => {
    setFormattedCode(formatCode(rawCode));
  }, [rawCode, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    alert("Formatted code copied to clipboard!");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Raw Code Input</label>
            <Textarea
              placeholder="Enter your code here..."
              className="min-h-[150px] resize-none"
              value={rawCode}
              onChange={(e) => setRawCode(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded p-1 bg-transparent"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Formatted Code Output</label>
            <Textarea
              className="min-h-[150px] resize-none"
              value={formattedCode}
              readOnly
            />
          </div>

          <Button onClick={handleCopy} className="w-full">
            Copy to Clipboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeFormatter; 