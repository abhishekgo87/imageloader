import { useState, useRef, useCallback } from "react";
import { UploadCloud, Plus } from "lucide-react";

const UploadBox = ({ onUpload, hasImages }) => {
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);

    const openFilePicker = () => {
        inputRef.current?.click();
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const processFiles = useCallback(
        (files) => {
            const validFiles = files.filter((file) => file.type.startsWith("image/"));
            if (validFiles.length === 0) {
                alert("Please upload image files only");
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            let processed = 0;
            const results = [];

            validFiles.forEach((file) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    results.push({
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                        name: file.name,
                        size: file.size,
                        url: reader.result,
                        date: new Date().toLocaleString(),
                    });

                    processed++;
                    setUploadProgress(Math.round((processed / validFiles.length) * 100));

                    if (processed === validFiles.length) {
                        onUpload(results);
                        setIsUploading(false);
                    }
                };

                reader.readAsDataURL(file);
            });

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        },
        [onUpload]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files?.length > 0) {
                processFiles(Array.from(e.dataTransfer.files));
            }
        },
        [processFiles]
    );

    const handleChange = useCallback(
        (e) => {
            if (e.target.files?.length > 0) {
                processFiles(Array.from(e.target.files));
            }
        },
        [processFiles]
    );

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />

            {!hasImages ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFilePicker}
                    className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-16 cursor-pointer transition-all duration-200 group
            ${dragActive
                            ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                            : "border-slate-600 hover:border-blue-400 hover:bg-slate-700/30"
                        }`}
                >
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/20">
                        <UploadCloud
                            className={`w-12 h-12 ${dragActive
                                    ? "text-blue-400"
                                    : "text-slate-400 group-hover:text-blue-400"
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
                <div className="flex flex-col">
                    {!isUploading && (
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={openFilePicker}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add More Images
                            </button>
                        </div>
                    )}

                    {isUploading && (
                        <div className="mb-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-blue-400 font-medium animate-pulse">
                                    Processing Images...
                                </p>
                                <p className="text-slate-400 text-sm font-medium">
                                    {uploadProgress}%
                                </p>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-200 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={openFilePicker}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragActive
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-slate-700 hover:border-blue-400 hover:bg-slate-700/30"
                            }`}
                    >
                        <p className="text-slate-400 text-sm font-medium">
                            Drag and drop more images here
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadBox;