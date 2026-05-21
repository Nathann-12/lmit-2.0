import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { labApi } from '../services/api';
import { toast } from 'sonner';

const Contact = () => {
  const [labInfo, setLabInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    labApi.getLabInfo()
      .then(data => setLabInfo(data))
      .catch(err => console.error('Failed to fetch lab info:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await labApi.submitContact(formData);
      toast.success(response.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      const errMsg = error.response?.data?.detail || 'Failed to send message. Please try again.';
      toast.error(typeof errMsg === 'string' ? errMsg : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4" data-testid="contact-heading">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Interested in collaboration, visiting our lab, or learning more about our research?
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <a 
                      href={`mailto:${labInfo?.email || 'contact@multiscalelab.edu'}`}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      data-testid="contact-email"
                    >
                      {labInfo?.email || 'contact@multiscalelab.edu'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
                    <a 
                      href={`tel:${labInfo?.phone || ''}`}
                      className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
                      data-testid="contact-phone"
                    >
                      {labInfo?.phone || ''}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Address</h3>
                    <p className="text-slate-600" data-testid="contact-address">{labInfo?.address || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-slate-700 mb-2 block">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        data-testid="contact-name-input"
                        className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-700 mb-2 block">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        data-testid="contact-email-input"
                        className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-slate-700 mb-2 block">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      data-testid="contact-subject-input"
                      className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-slate-700 mb-2 block">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      data-testid="contact-message-input"
                      className="border-gray-300 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    data-testid="contact-submit-button"
                    className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-base font-semibold transition-colors duration-200 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
