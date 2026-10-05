// Bundles Monaco with the app instead of letting @monaco-editor/react fetch it from cdn.jsdelivr.net at runtime.
// for some other browsers and devices thre's a content blocker that would make loading in monaco on run time really slow so this way if its built within it'll be much faster
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";

self.MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
};

loader.config({ monaco });
