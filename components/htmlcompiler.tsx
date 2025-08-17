"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Editor } from "@monaco-editor/react";
import { Check, Code, Eye, RotateCcw } from "lucide-react"; // Add Format icon
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import { Button } from "./button";
import useDebounce from "@/hooks/useDebounce";
import { defaultHTML } from "@/lib/utils/defaultHTML";

interface HTMLCompilerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function HTMLCompiler({
  value,
  onChange,
  onClose,
}: HTMLCompilerProps) {
  const [htmlCode, setHtmlCode] = useState(value);
  const [showRight, setShowRight] = useState(false);
  const [editorMounted, setEditorMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  // Debounce the html code to avoid unnecessary re-rendering
  const debouncedHtmlCode = useDebounce(htmlCode, 300);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = debouncedHtmlCode;
    }
  }, [debouncedHtmlCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setEditorMounted(true);

    try {
      editor.layout();
    } catch (error) {
      if (error instanceof Error && error.message.includes("ResizeObserver")) {
        return;
      }
      console.warn("Editor layout error:", error);
    }
  };

  useEffect(() => {
    if (!editorMounted || !editorRef.current) return;

    const handleResize = () => {
      try {
        editorRef.current?.layout();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("ResizeObserver")
        ) {
          return;
        }
      }
    };

    const debouncedResize = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(debouncedResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [editorMounted]);

  const resetCode = () => {
    setHtmlCode(defaultHTML);
  };

  const formatCode = async () => {
    try {
      const formattedCode = await prettier.format(htmlCode, {
        parser: "html",
        plugins: [parserHtml],
      });
      setHtmlCode(formattedCode);
      onChange(formattedCode);
    } catch (error) {
      console.error("Error formatting code:", error);
    }
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    setHtmlCode(value || "");
    onChange(value || "");
  }, []);

  return (
    <div className="bg-opacity-60 fixed inset-0 z-20 p-4">
      <div className="bg-background absolute inset-0 z-10 h-full w-full">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="text-primary h-6 w-6" />
              <h1 className="text-xl font-semibold">HTML Compiler</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="lg:hidden"
                onClick={() => setShowRight(!showRight)}
              >
                {showRight ? (
                  <>
                    <Code className="mr-2 h-4 w-4" />
                    Code
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>

              <Button className="ml-auto" onClick={onClose}>
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="flex h-[calc(100vh-80px)] flex-col max-md:overflow-y-scroll md:h-[calc(100vh-110px)] lg:flex-row">
          <div
            className={`h-full w-full lg:w-1/2 ${showRight ? "hidden lg:block" : "block border-r"}`}
          >
            <div className="relative h-full">
              <div className="border-b px-4 py-2">
                <h2 className="text-muted-foreground text-sm font-medium">
                  HTML Editor
                </h2>
              </div>
              <div className="absolute right-7 bottom-7 z-10 flex flex-col gap-2">
                <Button onClick={formatCode}>
                  <img
                    src="/prettier.svg"
                    alt="Prettier"
                    width={20}
                    height={20}
                    className="h-5 w-5 invert"
                  />
                </Button>
                <Button onClick={resetCode}>
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-full">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  value={htmlCode}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 1,
                    insertSpaces: true,
                    overviewRulerBorder: false,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={`h-full w-full lg:w-1/2 ${showRight ? "block border-l" : "hidden lg:block"}`}
          >
            <div className="h-full">
              <div className="border-b px-4 py-2">
                <h2 className="text-muted-foreground text-sm font-medium">
                  Live Preview
                </h2>
              </div>
              <div className="h-full overflow-hidden">
                <iframe
                  ref={iframeRef}
                  className="min-h-full w-full border-0"
                  title="HTML Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
