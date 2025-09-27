import React, { useState } from 'react';

const SummoningForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Please describe your chaos';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success animation
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', organization: '', message: '' });
      }, 3000);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-black to-purple-900/30 py-20 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="mb-8 animate-pulse">
            <img
              src="https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924792510_54a1357e.webp"
              alt="Summoning Complete"
              className="w-32 h-32 mx-auto rounded-full shadow-2xl shadow-cyan-500/50"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            The Pact is Sealed
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Your signal has been received. Our wizards will echo back with your blueprint in hand.
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-purple-900/30 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/68d70fc5f56f108d4e4b2f69_1758924792510_54a1357e.webp"
                alt="Summoning Rune"
                className="w-24 h-24 mx-auto rounded-full shadow-2xl shadow-cyan-500/30 animate-pulse"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600">
              The Summoning Rite
            </h2>
            <p className="text-xl text-gray-300">
              The pact is struck. Share your signal—name your quest. Our wizards will echo back, blueprint in hand.
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
              {/* Name Field */}
              <div className="mb-6">
                <label className="block text-cyan-400 font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-cyan-400 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              
              {/* Organization Field */}
              <div className="mb-6">
                <label className="block text-purple-400 font-semibold mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  placeholder="Your company/organization (optional)"
                />
              </div>
              
              {/* Message Field */}
              <div className="mb-6">
                <label className="block text-cyan-400 font-semibold mb-2">
                  Describe Your Chaos *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                    errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                  }`}
                  placeholder="What tasks are consuming your empire? What bots do you need?"
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-cyan-400 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Summoning FUTUR...</span>
                  </div>
                ) : (
                  'Summon FUTUR'
                )}
              </button>
            </div>
          </form>
          
          {/* Privacy Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Your data fuels only your legend—secure & swift.
          </p>
          
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400">
              <span className="text-cyan-400 font-semibold">FUTUR INC</span> • 
              <a href="https://www.futur.ca" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ml-1">
                www.futur.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummoningForm;