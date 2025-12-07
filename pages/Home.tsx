import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Globe, Shield, CreditCard, Lock, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold mb-8 border border-brand-gold/20">
            <span className="w-2 h-2 rounded-full bg-brand-gold mr-2 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide uppercase">New: Crypto Payments Supported</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-dark dark:text-white mb-6">
            Smart & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">Secure</span> Escrow
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
            Johnescrow protects buyers and sellers by holding funds securely until terms are met. The safest way to transact online for domains, services, and goods.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-brand-darker bg-brand-gold hover:bg-brand-goldHover transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-brand-gold/40">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-base font-bold rounded-full text-gray-700 dark:text-white hover:border-brand-gold hover:text-brand-gold transition-all bg-transparent backdrop-blur-sm">
              How It Works
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Partner Logos */}
             <div className="flex justify-center items-center h-12">
               <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">Shopify</span>
             </div>
             <div className="flex justify-center items-center h-12">
               <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">GoDaddy</span>
             </div>
             <div className="flex justify-center items-center h-12">
               <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">Flippa</span>
             </div>
             <div className="flex justify-center items-center h-12">
               <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">eBay</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-brand-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-brand-gold font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-dark dark:text-white sm:text-4xl">
              Complete Protection for Every Transaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-brand-gold" />}
              title="Buyer & Seller Protection"
              description="We verify all parties and hold funds securely. Funds are only released when you are satisfied with the service or product."
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-brand-gold" />}
              title="International Service"
              description="Transact with anyone, anywhere. We support over 150 countries and handle currency conversions automatically."
            />
            <FeatureCard 
              icon={<CreditCard className="h-8 w-8 text-brand-gold" />}
              title="Flexible Payments"
              description="Pay via Bank Wire, Credit Card, PayPal, or Cryptocurrency. Low fees and instant processing for verified users."
            />
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 bg-brand-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-gold mb-2">$500M+</div>
              <div className="text-gray-400">Transactions Secured</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-gold mb-2">50k+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-brand-gold mb-2">0%</div>
              <div className="text-gray-400">Fraud Incidents</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Steps Section */}
      <section className="py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-extrabold text-brand-dark dark:text-white">How It Works</h2>
               <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Five simple steps to secure your peace of mind.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
               {[
                 { step: 1, title: "Agreement", desc: "Buyer and Seller agree to terms." },
                 { step: 2, title: "Payment", desc: "Buyer pays Johnescrow." },
                 { step: 3, title: "Delivery", desc: "Seller delivers service/product." },
                 { step: 4, title: "Inspection", desc: "Buyer approves the delivery." },
                 { step: 5, title: "Payout", desc: "Funds released to Seller." }
               ].map((item, idx) => (
                 <div key={idx} className="relative flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-brand-dark dark:bg-brand-gold/20 border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold text-lg mb-4 z-10">
                      {item.step}
                    </div>
                    {idx < 4 && <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>}
                    <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 hover:border-brand-gold/50 transition-all duration-300 hover:transform hover:-translate-y-2 group">
    <div className="bg-brand-lightBg dark:bg-brand-darker w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);
