import { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, Plus } from "lucide-react";

export default function ImageUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputRef = useRef(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      alert("Please upload image files only");
      return;
    }

    setImageFiles((prev) => [...prev, ...validFiles]);

    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);

    simulateUpload();

    // Reset input so the exact same files can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]); // Free memory
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl transition-all duration-300">
      {/* Hidden input field for all clicks */}
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {/* Main Dropzone Area when empty */}
      {previewUrls.length === 0 ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-16 cursor-pointer transition-all duration-200 group
            ${
              dragActive
                ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                : "border-slate-600 hover:border-blue-400 hover:bg-slate-700/30"
            }`}
        >
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/20">
            <UploadCloud
              className={`w-12 h-12 ${
                dragActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"
              } transition-colors`}
            />
          </div>
          <p className="text-2xl font-semibold mb-3 text-slate-200 text-center">
            Click or drag images to upload
          </p>
          <p className="text-base text-slate-400 text-center">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
          <div className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full shadow-lg shadow-blue-500/30 transition-colors">
            Browse Files
          </div>
        </div>
      ) : (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Uploaded Images</h2>
              <p className="text-slate-400 text-sm mt-1">{imageFiles.length} file(s) selected</p>
            </div>
            {!isUploading && (
              <button
                onClick={onButtonClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add More Images
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mb-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <p className="text-blue-400 font-medium animate-pulse">Processing Images...</p>
                <p className="text-slate-400 text-sm font-medium">{uploadProgress}%</p>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Image Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-lg bg-slate-900 border border-slate-700 group aspect-square flex items-center justify-center"
              >
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay for individual image removal */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {!isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-red-500/90 text-white rounded-full transition-all duration-200 transform scale-0 group-hover:scale-100 shadow-lg backdrop-blur-md"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* File Details List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">File Details</h3>
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="bg-slate-900/50 hover:bg-slate-800/80 transition-colors rounded-xl p-4 flex items-center gap-4 border border-slate-700/50"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {!isUploading && (
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Ready</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sub-Dropzone below uploads when dealing with lots of files */}
          <div 
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}
             onClick={onButtonClick}
             className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
               dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-blue-400 hover:bg-slate-700/30"
             }`}
          >
             <p className="text-slate-400 text-sm font-medium">Drag and drop more images here</p>
          </div>

        </div>
      )}
    </div>
  );
}