// Bundles Monaco with the app instead of letting @monaco-editor/react fetch it from cdn.jsdelivr.net at runtime.
// Safari's tracking protection / content blockers often stall that CDN script, leaving the editor blank for a long time.
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";

self.MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
};

loader.config({ monaco });
