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

    // Validate file type
    if (!allowedFormats.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload MP4, MOV, AVI, MKV, or WEBM');
      return;
    }

    // Validate file size
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

      // Success - reset form
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
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
      {!file ? (
        <div>
          <label className="cursor-pointer">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload Video File
              </p>
              <p className="text-sm text-gray-600 mb-4">
                MP4, MOV, AVI, MKV, or WEBM (max {maxSize}MB)
              </p>
              <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
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
        </div>
      ) : (
        <div>
          {/* Video Preview */}
          <div className="mb-4">
            <video
              src={preview}
              controls
              className="w-full max-h-64 bg-black rounded-lg"
            />
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">File name:</span>
              <span className="text-gray-600">{file.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">File size:</span>
              <span className="text-gray-600">{formatFileSize(file.size)}</span>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Uploading...</span>
                <span className="text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
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
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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