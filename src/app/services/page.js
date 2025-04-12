'use client';

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold mb-8 text-center">
        <span className="text-primary">Our</span> <span className="text-accent">Services</span>
      </h1>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center text-white text-3xl mb-4">
              🎤
            </div>
            <h3 className="text-xl font-bold mb-3">Voice Assistant</h3>
            <p className="text-dark-gray mb-4">
              Interact with BharatGPT using your voice in multiple Indian languages. Perfect for those who find typing difficult or time-consuming.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
          
          {/* Service 2 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center text-white text-3xl mb-4">
              📝
            </div>
            <h3 className="text-xl font-bold mb-3">Auto Form Filling</h3>
            <p className="text-dark-gray mb-4">
              Upload your Aadhaar card and let BharatGPT automatically fill government forms for you, saving time and reducing errors.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
          
          {/* Service 3 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-3xl mb-4">
              🏥
            </div>
            <h3 className="text-xl font-bold mb-3">Emergency Alerts</h3>
            <p className="text-dark-gray mb-4">
              Get real-time information about hospital beds, ambulance services, and other emergency resources in your area.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
          
          {/* Service 4 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center text-white text-3xl mb-4">
              🌾
            </div>
            <h3 className="text-xl font-bold mb-3">Gaon Connect</h3>
            <p className="text-dark-gray mb-4">
              Get updates on your Kisan Credit Card, PM Kisan Yojana, and other rural schemes directly in your language.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
          
          {/* Service 5 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center text-white text-3xl mb-4">
              💰
            </div>
            <h3 className="text-xl font-bold mb-3">Paise Bachao Tips</h3>
            <p className="text-dark-gray mb-4">
              Find the cheapest LPG, petrol, and other essential services in your area to help you save money.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
          
          {/* Service 6 */}
          <div className="bg-white p-6 rounded-card shadow-card hover:shadow-card-hover transition-shadow">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-3xl mb-4">
              📋
            </div>
            <h3 className="text-xl font-bold mb-3">Sarkari Naukri Updates</h3>
            <p className="text-dark-gray mb-4">
              Get latest government job notifications and application deadlines tailored to your qualifications.
            </p>
            <a href="#" className="text-primary font-medium hover:underline">Learn more →</a>
          </div>
        </div>
        
        <div className="bg-light-gray p-8 rounded-card">
          <h2 className="text-2xl font-bold mb-4 text-center">Need a Custom Solution?</h2>
          <p className="text-dark-gray text-center mb-6">
            We can develop specialized AI solutions for government departments, NGOs, and businesses serving rural India.
          </p>
          <div className="flex justify-center">
            <a href="/contact" className="bg-primary text-white px-6 py-3 rounded-button hover:bg-opacity-90 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
