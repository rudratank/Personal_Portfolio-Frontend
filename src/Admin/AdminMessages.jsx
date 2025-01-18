import React, { useState, useEffect } from 'react';
import { Mail, Check, X, MessageCircle, ArrowRight } from 'lucide-react';
import { GET_MESSAGE_ROUTES, EDIT_MESSAGE_ROUTES, DELETE_MESSAGE_ROUTE } from '@/lib/constant';
import { toast } from 'sonner';
import axios from 'axios';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(GET_MESSAGE_ROUTES);
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id, newStatus) => {
    try {
      if (!id) {
        toast.error('Invalid message ID');
        return;
      }

      // Find current message status
      const currentMessage = messages.find(msg => msg._id === id);
      if (!currentMessage) return;

      // Determine the status to set
      const statusToSet = currentMessage.status === newStatus ? 'unread' : newStatus;

      const response = await axios.patch(
        `${EDIT_MESSAGE_ROUTES}${id}/status`,
        { status: statusToSet },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Since we're using axios, the response is already parsed
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, status: statusToSet } : msg
        ));
        
        if (selectedMessage?._id === id) {
          setSelectedMessage(prev => ({ ...prev, status: statusToSet }));
        }

        toast.success(`Message marked as ${statusToSet}`);
      } else {
        throw new Error(response.data.message || 'Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      if (!id) {
        toast.error('Invalid message ID');
        return;
      }

      const response = await axios.delete(`${DELETE_MESSAGE_ROUTE}${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setMessages(messages.filter(msg => msg._id !== id));
        
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
        
        toast.success('Message deleted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete message');
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-600';
      case 'read': return 'bg-yellow-100 text-yellow-600';
      case 'responded': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 bg-white rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Messages
        </h3>
        
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No messages yet</div>
          ) : (
            messages.map((message) => (
              <button
                key={message._id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full text-left p-4 rounded-lg border hover:border-blue-200 transition-colors duration-200 ${
                  selectedMessage?._id === message._id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{message.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)}`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2 bg-white rounded-xl border p-6">
        {selectedMessage ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedMessage.name}</h3>
                <p className="text-gray-500">{selectedMessage.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateMessageStatus(selectedMessage._id, 'read')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedMessage.status === 'read'
                      ? 'bg-yellow-200 text-yellow-700'
                      : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  }`}
                  title={selectedMessage.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateMessageStatus(selectedMessage._id, 'responded')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedMessage.status === 'responded'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                  title={selectedMessage.status === 'responded' ? 'Mark as unread' : 'Mark as responded'}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this message?')) {
                      handleDeleteMessage(selectedMessage._id);
                    }
                  }}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Delete message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Subject</h4>
              <p className="text-gray-600">{selectedMessage.subject}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Message</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="border-t pt-4 mt-6">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                Reply via Email
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;