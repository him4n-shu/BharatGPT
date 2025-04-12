'use client';

import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import VoiceAssistant from '../components/VoiceAssistant';
import SarkariFormCard from '../components/SarkariFormCard';
import AutoFormFiller from '../components/AutoFormFiller';
import EmergencyAlerts from '../components/EmergencyAlerts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 text-dark-gray">
            <span className="text-primary">Bharat</span>
            <span className="text-accent">GPT</span> 
            <span className="text-secondary"> Services</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <VoiceAssistant />
            <AutoFormFiller />
            <SarkariFormCard title="Gaon Connect" 
              description="Get updates on your Kisan Credit Card, PM Kisan Yojana, and other rural schemes" 
              icon="🌾" />
            <SarkariFormCard title="Paise Bachao Tips" 
              description="Find the cheapest LPG, petrol, and other essential services in your area" 
              icon="💰" />
            <EmergencyAlerts />
            <SarkariFormCard title="Sarkari Naukri Updates" 
              description="Get latest government job notifications and application deadlines" 
              icon="📋" />
          </div>
        </div>
      </section>
    </div>
  );
}