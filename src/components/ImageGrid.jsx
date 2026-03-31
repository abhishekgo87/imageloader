import ImageCard from "./ImageCard";

const ImageGrid = ({ images, onRemove, onRename, onPreview }) => {
  if (images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-[40px_1fr_120px_80px_auto] items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-700 mb-1">
        <span />
        <span>Name</span>
        <span className="hidden sm:block">Date</span>
        <span className="hidden sm:block">Size</span>
        <span>Actions</span>
      </div>

      <div>
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onRemove={onRemove}
            onRename={onRename}
            onPreview={onPreview}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;