import { useState, useRef } from 'react';
import axios from 'axios';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/api/chat/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const validAttachments = results.filter(result => result !== null);
      setAttachments(prev => [...prev, ...validAttachments]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isImage = (mimeType) => {
    return mimeType?.startsWith('image/');
  };

  const isVideo = (mimeType) => {
    return mimeType?.startsWith('video/');
  };

  const isDocument = (mimeType) => {
    return mimeType?.includes('application/pdf') ||
           mimeType?.includes('application/msword') ||
           mimeType?.includes('application/vnd.openxmlformats-officedocument') ||
           mimeType?.includes('text/') ||
           mimeType?.includes('application/zip') ||
           mimeType?.includes('application/x-rar-compressed');
  };

  return (
    <div className="border-t border-gray-500 bg-gray-800 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4 space-y-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative inline-block mr-2">
              {isImage(attachment.mimeType) && (
                <div className="relative">
                  <img
                    src={`http://localhost:3000${attachment.url}`}
                    alt={attachment.filename}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {isVideo(attachment.mimeType) && (
                <div className="relative">
                  <video
                    src={`http://localhost:3000${attachment.url}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {!isImage(attachment.mimeType) && !isVideo(attachment.mimeType) && (
                <div className="relative bg-gray-600 p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs text-gray-50 truncate max-w-20">
                      {attachment.filename}
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 text-gray-300 hover:text-gray-100 disabled:opacity-50"
        >
          {uploading ? (
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Message Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-500 bg-gray-700 text-gray-50 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || uploading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Upload progress indicator */}
      {uploading && (
        <div className="mt-2 text-sm text-gray-300">
          Uploading files...
        </div>
      )}
    </div>
  );
};

export default MessageInput;
