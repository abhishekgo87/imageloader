import { useState, useRef, useEffect } from "react";
import { Eye, Pencil, Trash2, Check, X } from "lucide-react";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const ImageCard = ({ image, onRemove, onRename, onPreview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(image.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const submitRename = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== image.name) {
      onRename(image.id, trimmed);
    } else {
      setEditName(image.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitRename();
    if (e.key === "Escape") {
      setEditName(image.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="group grid grid-cols-[40px_1fr_120px_80px_auto] items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors border-b border-slate-800 last:border-b-0">
      <div
        className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 cursor-pointer border border-slate-700"
        onClick={() => onPreview(image)}
      >
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={submitRename}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 bg-slate-800 border border-blue-500 rounded-md px-2 py-0.5 text-slate-200 text-sm focus:outline-none"
            />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={submitRename}
              className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setEditName(image.name);
                setIsEditing(false);
              }}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p
            className="text-slate-200 text-sm font-medium truncate cursor-default"
            title={image.name}
          >
            {image.name}
          </p>
        )}
      </div>

      <p className="text-slate-500 text-xs whitespace-nowrap hidden sm:block">
        {image.date}
      </p>

      <p className="text-slate-500 text-xs whitespace-nowrap hidden sm:block">
        {formatSize(image.size)}
      </p>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPreview(image)}
          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-md transition-colors"
          title="Rename"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(image.id)}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ImageCard;