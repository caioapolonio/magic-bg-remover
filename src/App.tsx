import { removeBackground } from "@imgly/background-removal";
import { useRef, useState } from "react";
import { FaDownload, FaRedo } from "react-icons/fa";
import Footer from "./components/Footer";

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("No file selected");
      return;
    }

    setError(null);

    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setOriginalImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const blob = await removeBackground(file);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError("Error processing image");
      console.error("Background removal error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    handleFileSelect(file);
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "processed-image.png";
    link.click();
  };

  const resetApp = () => {
    setOriginalImage(null);
    setError(null);
    setIsProcessing(false);
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-fuchsia-950 via-neutral-900 to-purple-950 p-4">
      <h1 className="inline-block text-center text-4xl leading-snug font-bold sm:text-5xl">
        <span className="animate-star animate-float inline-block text-yellow-300">
          ✨
        </span>{" "}
        <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Magic Background Remover
        </span>{" "}
        <span className="animate-star animate-float inline-block text-yellow-300 delay-200">
          ✨
        </span>
      </h1>

      <div className="w-full max-w-2xl rounded-3xl border border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-900 to-indigo-950 p-4 shadow-2xl backdrop-blur-md sm:p-6">
        {!originalImage && (
          <div
            className="flex h-96 cursor-pointer flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-indigo-950/40 to-fuchsia-950/50 p-4 text-center opacity-80 shadow-2xl transition-all duration-400 hover:shadow-fuchsia-700"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mb-4 text-4xl sm:text-5xl">📸</div>
            <p className="mb-2 text-lg text-fuchsia-200 sm:text-xl">
              Drag & drop an image or click to upload
            </p>
            <p className="text-sm text-fuchsia-400">JPG, PNG, WEBP supported</p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}

        {error && <p className="mb-4 text-center text-pink-400">{error}</p>}

        {originalImage && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <p className="mb-2 text-xl text-fuchsia-300">Original image</p>
                <div className="mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border-2 border-fuchsia-600/50">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="mb-2 text-xl text-fuchsia-300">Processed Image</p>
                <div className="mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border-2 border-fuchsia-600/50">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-fuchsia-400">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-fuchsia-300/30 border-t-fuchsia-100"></div>
                          <span className="text-sm">Processing...</span>
                        </div>
                      ) : (
                        <p className="text-sm">
                          Processed image will appear here
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col items-center justify-center gap-3 md:flex-row">
              <button
                onClick={resetApp}
                disabled={isProcessing}
                className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-400 px-6 py-3 text-center font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
              >
                <FaRedo /> Process other image
              </button>

              <button
                onClick={downloadImage}
                disabled={!processedImage || isProcessing}
                className="flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-400 px-6 py-3 text-center font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
              >
                <FaDownload />{" "}
                {processedImage ? "Download Image" : "Processing..."}
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default App;
