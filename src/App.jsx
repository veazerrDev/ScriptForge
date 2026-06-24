import { useState, useCallback } from "react";
import Toolbar from "./components/Toolbar";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useScriptEditor } from "./hooks/useScriptEditor";
import "./App.css";

export default function App() {
  const [projectTitle, setProjectTitle] = useState("Новий сценарій");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const editor = useScriptEditor();

  return (
    <div className="app">
      <Header
        title={projectTitle}
        onTitleChange={setProjectTitle}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        onExport={editor.handleExport}
        onExportJson={editor.handleExportJson}
        onImport={editor.handleImport}
        importError={editor.importError}
      />
      <div className="app-body">
        <Toolbar
          onBold={editor.toggleBold}
          onItalic={editor.toggleItalic}
          onUnderline={editor.toggleUnderline}
          onFontSize={editor.setFontSize}
          onFontFamily={editor.setFontFamily}
          onAddARoll={editor.insertARoll}
          onAddBRoll={editor.insertBRoll}
          onAddMotion={editor.insertMotion}
          onUndo={editor.undo}
          onRedo={editor.redo}
          activeFormats={editor.activeFormats}
          fontSize={editor.fontSize}
          fontFamily={editor.fontFamily}
        />
        <div className="workspace">
          {sidebarOpen && (
            <Sidebar sections={editor.sections} onJump={editor.jumpToSection} />
          )}
          <Editor
            editorRef={editor.editorRef}
            onSelectionChange={editor.handleSelectionChange}
            onChange={editor.handleChange}
          />
        </div>
      </div>
    </div>
  );
}
