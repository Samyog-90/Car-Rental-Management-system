import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Camera, Upload, Check, X, RefreshCw, Loader2, AlertCircle } from "lucide-react";

interface ExtractedData {
  fullName: string;
  licenseNumber?: string;
  nidNumber?: string;
  dob: string;
  issueDate?: string;
  expiryDate?: string;
  gender?: string;
  address?: string;
  categories?: string;
  issuingAuthority?: string;
  additionalInfo?: string;
}

interface DocumentOCRProps {
  onConfirm: (data: any) => void;
  title: string;
  docType?: "LICENSE_FRONT" | "LICENSE_BACK" | "NID_FRONT" | "NID_BACK";
}

const DocumentOCR: React.FC<DocumentOCRProps> = ({ onConfirm, title, docType }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [detectedType, setDetectedType] = useState<string>("");

  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    processOCR(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setIsCameraOpen(false);
      
      // Convert base64 to File
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
          processOCR(file);
        });
    }
  }, [webcamRef]);

  const processOCR = async (file: File) => {
    setLoading(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append("documentImage", file);
    if (docType) formData.append("docType", docType);

    try {
      const response = await axios.post("http://localhost:5000/api/ocr/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExtractedData(response.data.extractedData.fields);
      setDetectedType(response.data.docType);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to process image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: keyof ExtractedData, value: string) => {
    if (extractedData) {
      setExtractedData({ ...extractedData, [key]: value });
    }
  };

  const handleConfirm = async () => {
    if (extractedData) {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      try {
        await axios.post("http://localhost:5000/api/ocr/save", {
          data: extractedData,
          docType: detectedType || docType
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        onConfirm({ ...extractedData, docType: detectedType || docType });
        // Optional: show success state or reset
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to save document data");
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setImage(null);
    setExtractedData(null);
    setError(null);
    setDetectedType("");
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        {title}
      </h3>

      {!image && !isCameraOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">Drag & drop or Click to upload</p>
            <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, WEBP</p>
          </div>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <Camera className="w-12 h-12 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
            <p className="text-gray-600 font-medium">Capture from Camera</p>
            <p className="text-gray-400 text-sm mt-2">Use your device's camera</p>
          </button>
        </div>
      )}

      {isCameraOpen && (
        <div className="relative rounded-xl overflow-hidden bg-black">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto"
            videoConstraints={{ facingMode: "environment" }}
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capture}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
            >
              <Camera size={24} />
            </button>
            <button
              onClick={() => setIsCameraOpen(false)}
              className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-transform active:scale-95"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {image && (
        <div className="space-y-6">
          <div className="relative group overflow-hidden rounded-xl bg-gray-100">
            <img src={image} alt="Preview" className="w-full max-h-80 object-contain mx-auto transition-transform group-hover:scale-105 duration-500" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={reset}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-red-500 shadow-md hover:bg-white transition-colors"
              >
                <RefreshCw size={18} />
              </button>
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <p className="text-blue-600 font-semibold animate-pulse">Scanning Document...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {extractedData && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  Verified Extracted Data
                </h4>
                <span className="text-xs font-bold uppercase py-1 px-3 bg-blue-100 text-blue-700 rounded-full">
                  {detectedType.replace("_", " ")}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleFieldChange(key as keyof ExtractedData, e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={reset}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentOCR;
