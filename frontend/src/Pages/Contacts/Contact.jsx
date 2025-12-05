import React from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="bg-base-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-secondary text-secondary-content py-12 text-center">
        <h1 className="text-4xl font-bold font-aladin tracking-wider">Contact Us</h1>
        <p className="mt-2 opacity-80">We'd love to hear from you. Get in touch with us.</p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our products, services, or want to become a partner?
                Reach out to our team and we will get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Location</h3>
                  <p className="text-gray-600">123 Green Valley Road,<br />Dhaka, Bangladesh 1200</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone Number</h3>
                  <p className="text-gray-600">+880 123 456 7890</p>
                  <p className="text-gray-500 text-sm">Mon-Fri 9am-6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary mt-1">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Address</h3>
                  <p className="text-gray-600">contact@damaloy.com</p>
                  <p className="text-gray-600">support@damaloy.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-base-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-secondary mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input type="text" placeholder="John" className="input input-bordered w-full focus:input-primary" />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input type="text" placeholder="Doe" className="input input-bordered w-full focus:input-primary" />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input type="email" placeholder="john@example.com" className="input input-bordered w-full focus:input-primary" />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Subject</span>
                </label>
                <input type="text" placeholder="How can we help?" className="input input-bordered w-full focus:input-primary" />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea className="textarea textarea-bordered h-32 focus:textarea-primary" placeholder="Type your message here..."></textarea>
              </div>

              <button type="button" className="btn btn-primary w-full text-white gap-2 text-lg">
                Send Message <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;