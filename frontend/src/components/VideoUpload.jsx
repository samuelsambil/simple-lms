import { useState } from 'react';

function VideoUpload({ onUpload, maxSize = 500 }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const allowedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
  const maxSizeBytes = maxSize * 1024 * 1024;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError('');

    if (!allowedFormats.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload MP4, MOV, AVI, MKV, or WEBM');
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      await onUpload(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      setFile(null);
      setPreview(null);
      setProgress(0);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all">

      {!file ? (
        <label className="cursor-pointer group block">
          <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-blue-400 transition-all bg-gray-50/50 group-hover:bg-gray-100">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎬</div>

            <p className="text-xl font-semibold text-gray-900 mb-1">
              Upload a Video
            </p>

            <p className="text-sm text-gray-600 mb-5">
              MP4, MOV, AVI, MKV, WEBM — max {maxSize}MB
            </p>

            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all inline-block group-hover:shadow-md">
              Choose File
            </span>
          </div>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-5">

          {/* Preview */}
          <div className="relative rounded-lg overflow-hidden shadow-sm">
            <video
              src={preview}
              controls
              className="w-full max-h-64 bg-black"
            />
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">File Name:</span>
              <span className="text-gray-700 truncate max-w-[60%] text-right">{file.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Size:</span>
              <span className="text-gray-700">{formatFileSize(file.size)}</span>
            </div>
          </div>

          {/* Uploading Progress */}
          {uploading && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Uploading...</span>
                <span className="font-medium text-gray-700">{progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {uploading ? `Uploading ${progress}%...` : 'Upload Video'}
            </button>

            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setError('');
              }}
              disabled={uploading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Cancel
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default VideoUpload;
