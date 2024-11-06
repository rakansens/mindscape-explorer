const handleSaveDialog = (title: string) => {
  if (dialogMode === 'save') {
    // 通常の保存
    const newFile: MindMapFile = {
      id: generateId(),  // 必ず新しいIDを生成
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { nodes, edges }
    };
    
    // 常に新規ファイルとして保存
    addFile(newFile);
    
    toast({
      title: "保存完了",
      description: "マインドマップを保存しました",
    });
  } else {
    // 新規作成前の保存
    const currentFile: MindMapFile = {
      id: generateId(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { nodes, edges }
    };
    addFile(currentFile);
    createNewFile();
  }
  setIsSaveDialogOpen(false);
}; 