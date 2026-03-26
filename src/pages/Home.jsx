import ImageUpload from "../components/ImageUpload";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 tracking-tight">
            Image Upload
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Experience lightning-fast image processing with our state-of-the-art drag and drop interface.
          </p>
        </div>
        
        <ImageUpload />
      </div>
    </div>
  );
}