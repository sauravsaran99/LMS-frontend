import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadReport } from "../../api/report.api";
import { getDoctors } from "../../api/doctor.api";

const UploadReportModal = ({ booking, onClose, onSuccess }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [tagType, setTagType] = useState<"SELF" | "DOCTOR">("SELF");
  const [doctors, setDoctors] = useState<{ id: number; name: string; specialization?: string }[]>(
    []
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

      const fetchDoctors = async () => {
      try {
        const { data } = await getDoctors({ page: 1, limit: 100 });
        setDoctors(data);
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      }
    };

  // Fetch doctors
  useEffect(() => {

    fetchDoctors();
  }, [setTagType]);

  const submit = async () => {
    if (!file) {
      toast.error("Please select a report file");
      return;
    }

    if (tagType === "DOCTOR" && !selectedDoctorId) {
      toast.error("Please select a doctor");
      return;
    }

    setIsLoading(true);
    try {
      await uploadReport(
        booking.id,
        file,
        tagType === "DOCTOR" ? selectedDoctorId! : undefined
      );
      toast.success("Report uploaded successfully");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to upload report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md animate-scale-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Test Report
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, JPG, or PNG (Max 10MB)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            {/* File Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-8 transition-all ${dragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.03] hover:border-purple-300 dark:hover:border-purple-600"
                }`}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,image/jpeg,image/jpg,image/png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isLoading}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 mb-3">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                {!file && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Supported formats: PDF, JPG, PNG
                  </p>
                )}
              </label>
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      File selected
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Tagging Options */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tag Report To
              </label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tagType"
                    value="SELF"
                    checked={tagType === "SELF"}
                    onChange={() => setTagType("SELF")}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Self (Patient)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tagType"
                    value="DOCTOR"
                    checked={tagType === "DOCTOR"}
                    onChange={() => setTagType("DOCTOR")}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Doctor</span>
                </label>
              </div>

              {tagType === "DOCTOR" && (
                <div className="animation-fade-in">
                  <select
                    value={selectedDoctorId || ""}
                    onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-colors"
                  >
                    <option value="" disabled>
                      Select a Doctor
                    </option>
                    {doctors?.data.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialization || "General"})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3 flex gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Upload the test report document. This will be attached to the booking for reference.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={isLoading || !file}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default UploadReportModal;
