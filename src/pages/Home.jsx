import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Package, Users, Zap, Lock, Monitor, Clock,
  Phone, Mail, MapPin, ChevronRight, ArrowRight, MessageCircle
} from 'lucide-react'

const slides = [
  {
    image: '/posimage01.jpg',
    title: 'Run Your Shop Smarter',
    subtitle: 'Track sales, manage inventory, and grow your business with ease.',
    cta: { label: 'Request Free Demo', to: '#contact' },
    accent: 'from-indigo-600 to-violet-600',
  },
  {
    image: '/posimage02.jpg',
    title: 'Instant Reports & Insights',
    subtitle: 'Get real-time analytics to make smarter business decisions.',
    cta: { label: 'Learn More', to: '#features' },
    accent: 'from-emerald-600 to-teal-600',
  },
  {
    image: '/posimage03.jpg',
    title: 'Simplify Daily Operations',
    subtitle: 'From cash management to receipts — MyDuka POS has you covered.',
    cta: { label: 'Discover More', to: '#benefits' },
    accent: 'from-amber-500 to-orange-500',
  },
]

const features = [
  { icon: TrendingUp, label: 'Smart Sales Tracking', desc: 'Monitor daily sales and generate instant reports to understand performance.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: Package, label: 'Inventory Management', desc: 'Stay informed on your stock levels and manage suppliers easily.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Users, label: 'Customer Insights', desc: 'Build loyalty with insights on customer spending and preferences.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
]

const benefits = [
  { icon: Zap, label: 'Easy to Use', desc: 'Simple and intuitive interface for faster checkout and smooth operations.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Lock, label: 'Secure Cloud Backup', desc: 'Your sales data is safely backed up and accessible anytime, anywhere.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: Monitor, label: 'Works on Any Device', desc: 'Access MyDuka POS seamlessly from desktop, tablet, or phone.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Clock, label: '24/7 Support', desc: "We're always available to assist you whenever you need help.", color: 'text-rose-400', bg: 'bg-rose-500/10' },
]

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[currentSlide]

  const scrollTo = (e, to) => {
    e.preventDefault()
    document.querySelector(to)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[500px] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(120deg, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.3) 100%)' }}
            />
          </div>
        ))}

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl">
          <div key={currentSlide} style={{ animation: 'slideUp 0.6s ease' }}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${slide.accent} text-white`}>
              <Zap size={12} /> MyDuka POS
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">{slide.subtitle}</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href={slide.cta.to}
                onClick={(e) => scrollTo(e, slide.cta.to)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${slide.accent} transition-all hover:scale-105 shadow-xl`}
              >
                {slide.cta.label} <ArrowRight size={16} />
              </a>
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Get Started <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-widest">Capabilities</span>
            <h2 className="font-display text-4xl font-bold text-white mt-2">Powerful Features</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, label, desc, color, bg }) => (
              <div
                key={label}
                className="p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300"
                style={{ background: '#1a1a24', border: '1px solid #2e2d3d' }}
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7a7890' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-20 px-6" style={{ background: '#0a0a0e' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-medium uppercase tracking-widest">Why Us</span>
            <h2 className="font-display text-4xl font-bold text-white mt-2">Why Choose MyDuka POS</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon: Icon, label, desc, color, bg }) => (
              <div
                key={label}
                className="p-5 rounded-2xl text-center hover:scale-[1.03] transition-all duration-300"
                style={{ background: '#13131c', border: '1px solid #1e1d2a' }}
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} className={color} />
                </div>
                <h4 className="font-display font-semibold text-white mb-2">{label}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#6b6980' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">Reach Out</span>
            <h2 className="font-display text-4xl font-bold text-white mt-2">Get in Touch</h2>
            <p className="text-gray-400 mt-2">We'd love to hear from you!</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
              <input type="hidden" name="access_key" value="823a10a0-0c4a-449e-ac91-5f26a92630f2" />
              {[
                { name: 'name', type: 'text', placeholder: 'Your Name' },
                { name: 'email', type: 'email', placeholder: 'Your Email' },
              ].map(f => (
                <input
                  key={f.name}
                  type={f.type}
                  name={f.name}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  style={{ background: '#1a1a24', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
                />
              ))}
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                style={{ background: '#1a1a24', border: '1px solid #2e2d3d', color: '#e8e6f0' }}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                Send Message
              </button>
            </form>

            <div className="space-y-5 pt-2">
              {[
                { icon: MapPin, label: 'Nairobi, Kenya', color: 'text-indigo-400' },
                { icon: Phone, label: '+254 792 213 329', color: 'text-emerald-400' },
                { icon: Mail, label: 'support@mydukapos.com', color: 'text-amber-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon size={18} className={color} />
                  </div>
                  <span className="text-gray-300">{label}</span>
                </div>
              ))}
              <p className="text-sm mt-6" style={{ color: '#6b6980' }}>
                We typically reply within 1 business hour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp float */}
      <a
        href="https://wa.me/254792213329"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110"
        style={{ background: '#25d366' }}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}

export default Home
