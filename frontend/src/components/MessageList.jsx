import { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwn = message.sender._id === currentUserId;
        
        return (
          <div
            key={message._id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwn
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-50 border border-gray-600'
              }`}
            >
              {/* Text message */}
              {message.text && (
                <p className="text-sm">{message.text}</p>
              )}
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index}>
                      {isImage(attachment.mimeType) && (
                        <img
                          src={`http://localhost:3000${attachment.url}`}
                          alt={attachment.filename}
                          className="max-w-full h-auto rounded-lg cursor-pointer"
                          onClick={() => window.open(`http://localhost:3000${attachment.url}`, '_blank')}
                        />
                      )}
                      
                      {isVideo(attachment.mimeType) && (
                        <video
                          src={`http://localhost:3000${attachment.url}`}
                          controls
                          className="max-w-full h-auto rounded-lg"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      
                      {!isImage(attachment.mimeType) && !isVideo(attachment.mimeType) && (
                        <a
                          href={`http://localhost:3000${attachment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-gray-50"
                        >
                          {isDocument(attachment.mimeType) ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          )}
                          <span className="text-sm">{attachment.filename}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Message metadata */}
              <div
                className={`text-xs mt-1 ${
                  isOwn ? 'text-blue-100' : 'text-gray-300'
                }`}
              >
                {formatTime(message.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
