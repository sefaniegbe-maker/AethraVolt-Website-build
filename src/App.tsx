import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Globe, Menu, X, ChevronDown, ArrowRight, Zap, Leaf, ShieldCheck, MapPin, Mail, Building, Server, Cpu, Cloud } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// --- Constants & Data ---
const NAV_LINKS = [
  { name: '首页', href: '#home' },
  { name: '产品中心', href: '#products' },
  { name: '案例中心', href: '#cases' },
  { name: '关于我们', href: '#about' },
  { name: '联系我们', href: '#contact' },
];

const LANGUAGES = ['中文', 'English', 'ภาษาไทย', 'Tiếng Việt', 'Deutsch'];

const BRAND_SERVICES = [
  {
    title: 'Aethra·臻电™',
    desc: '主动式电能治理。针对高端制造业痛点，提供基于AI的主动式电能治理方案，保障生产“大动脉”稳定运行。',
    features: ['三相不平衡治理', '谐波抑制', '无功补偿', 'AI主动防御'],
    icon: Zap,
  },
  {
    title: 'Aethra·驭能™',
    desc: 'AI驱动的能源自动驾驶。构建“源-网-荷-储”多维灵活性资源池，实现AI驱动的能源自动驾驶，将成本中心转化为收益资产。',
    features: ['AI削峰填谷', '智能水蓄冷', 'VPP收益', '绿电最大化'],
    icon: Leaf,
  },
  {
    title: 'Aethra·绿擎™',
    desc: '碳管理与ESG合规。以能源数字化和AI驱动，提供可量化、可核查的碳管理报告，助力企业实现全球供应链的绿色合规。',
    features: ['AethraGrid平台', 'EMS+MES联动', '碳足迹追踪', 'ESG合规服务'],
    icon: ShieldCheck,
  },
];

const CASES = [
  { title: '零碳工厂：光储一体化项目', category: '零碳工厂', img: 'https://picsum.photos/seed/factory1/800/600' },
  { title: '零碳工厂：绿电+水蓄冷项目', category: '零碳工厂', img: 'https://picsum.photos/seed/factory2/800/600' },
  { title: '零碳园区：光伏+污水处理项目', category: '零碳园区', img: 'https://picsum.photos/seed/park1/800/600' },
  { title: '零碳园区：德国光储充一体化项目', category: '零碳园区', img: 'https://picsum.photos/seed/park2/800/600' },
];

const MARKERS: { name: string; coordinates: [number, number] }[] = [
  { name: '深圳', coordinates: [114.0579, 22.5431] },
  { name: '加州', coordinates: [-119.4179, 36.7783] },
  { name: '泰国', coordinates: [100.9925, 15.8700] },
  { name: '德国', coordinates: [10.4515, 51.1657] },
  { name: '越南', coordinates: [108.2772, 14.0583] },
  { name: '澳大利亚', coordinates: [133.7751, -25.2744] },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// --- Components ---

const AnimatedCounter = ({ value, suffix = '', duration = 2 }: { value: number | string, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = parseInt(value.toString().replace(/,/g, ''));
          if (start === end) return;
          const incrementTime = (duration / end) * 1000;
          const timer = setInterval(() => {
            start += Math.ceil(end / (duration * 60));
            if (start >= end) {
              clearInterval(timer);
              setCount(end);
            } else {
              setCount(start);
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={nodeRef} className="font-mono">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#home" className="flex items-center group">
          <div className="relative h-8 flex items-center overflow-hidden">
            <span className="text-2xl font-bold text-white tracking-wider">AE</span>
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: scrolled ? 'auto' : 0, opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center overflow-hidden whitespace-nowrap"
            >
              <span className="text-2xl font-bold text-white tracking-wider">thra<span className="text-[#00E5FF]">V</span>olt</span>
              <span className="ml-2 text-sm text-gray-400 font-light">| 合擎源动</span>
            </motion.div>
          </div>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="text-sm text-gray-300 hover:text-[#00E5FF] transition-colors tracking-widest font-light">
              {link.name}
            </a>
          ))}
          
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center text-sm text-gray-300 hover:text-[#00E5FF] transition-colors font-light">
              <Globe className="w-4 h-4 mr-1" />
              语言
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                >
                  {LANGUAGES.map((lang) => (
                    <button key={lang} onClick={() => setLangOpen(false)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-[#00E5FF] transition-colors">
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg text-gray-300 hover:text-[#00E5FF] font-light">
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-wind-turbines-in-a-field-at-sunset-29805-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00E5FF]/20 rounded-full blur-[120px]"></div>
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            AI+能源驱动的<br />
            运营商
          </h1>
          
          <motion.a
            href="#products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-gradient-to-r from-[#0066FF] to-[#00E5FF] rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)] transition-all"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center tracking-widest">
              探索解决方案与了解我们
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const Products = () => {
  const [filter, setFilter] = useState('全部');
  const filters = ['全部', '智能设备', '软件系统', '解决方案'];

  return (
    <section id="products" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">产品中心</h2>
          <p className="text-gray-400 font-light tracking-widest">以 AethraCore AI 模型为核心的 1+5 多维产品矩阵</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-light tracking-widest transition-all ${
                filter === f 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50' 
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-[#00E5FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center tracking-widest">“端-边-云”架构</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'AethraEdge', desc: '边缘能量控制', icon: Server },
                { title: 'AethraPilot', desc: 'AI智能控制', icon: Cpu },
                { title: 'AethraGrid', desc: '能源管理云平台', icon: Cloud },
                { title: '擎苍AethraCore', desc: '能源中枢大模型', icon: Zap },
              ].map((item, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center hover:border-[#00E5FF]/30 transition-colors">
                  <item.icon className="w-10 h-10 text-[#00E5FF] mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-xl font-medium text-white mb-6 text-center tracking-widest">六维建设体系</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {['科学算碳', '源头减碳', '过程脱碳', '智能控碳', '协同降碳', '抵消披露'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-black/50 rounded-full text-sm text-gray-300 font-light border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRAND_SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#00E5FF]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#00E5FF] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <service.icon className="w-12 h-12 text-[#00E5FF] mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wider">{service.title}</h3>
              <p className="text-gray-400 font-light mb-6 leading-relaxed">{service.desc}</p>
              <ul className="space-y-3">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-sm text-gray-300 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Cases = () => {
  return (
    <section id="cases" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">案例中心</h2>
          <p className="text-gray-400 font-light tracking-widest">全球标杆项目展示</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-light tracking-widest rounded-full mb-3 backdrop-blur-md border border-[#00E5FF]/30">
                  {item.category}
                </span>
                <h3 className="text-xl md:text-2xl font-medium text-white tracking-wider">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#0066FF]/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">关于我们</h2>
          <p className="text-gray-400 font-light tracking-widest">成立于2017年加州，2025年设立深圳总部</p>
        </motion.div>

        {/* Value Creation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 text-center">
          {[
            { value: 1, suffix: 'GW+', label: '累计运营可再生能源资产' },
            { value: 5, suffix: '亿度', label: '累计节约电能' },
            { value: 30, suffix: '万吨', label: '累计减少碳排放' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="text-6xl md:text-8xl font-thin text-white mb-4 group-hover:text-[#00E5FF] transition-colors duration-500 tracking-tighter">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-gray-400 font-light tracking-widest uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mb-24">
          <p className="text-xl text-gray-300 font-light tracking-widest">
            “我们不仅提供能源解决方案，更构建可持续发展的底层能源能力。”
          </p>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {[
            { title: '核心愿景', desc: '以AI与数据重塑能源世界，成为全球领先的零碳新质生产力运营商。' },
            { title: '核心定位', desc: 'AI+数据驱动的“零碳新质生产力”能源运营商。' },
            { title: '聚焦领域', desc: '低碳绿色能源、能源精益运营、ESG价值创造。' },
            { title: '客户价值', desc: '省成本、创收益、高效率、ESG标杆。' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-[#00E5FF] mb-4 tracking-widest">{item.title}</h3>
              <p className="text-gray-300 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Global Map */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center tracking-widest">全球化布局</h3>
          <div className="w-full max-w-4xl mx-auto h-[400px]">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1a1a1a"
                      stroke="#333333"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#2a2a2a", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {MARKERS.map(({ name, coordinates }) => (
                <Marker key={name} coordinates={coordinates}>
                  <motion.circle
                    r={4}
                    fill="#00E5FF"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <circle r={2} fill="#0066FF" />
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{ fontFamily: "Inter", fill: "#9ca3af", fontSize: "10px", fontWeight: 300 }}
                  >
                    {name}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white tracking-wider">Aethra<span className="text-[#00E5FF]">V</span>olt</span>
            </div>
            <p className="text-gray-400 font-light mb-8 max-w-md leading-relaxed">
              AI+能源驱动的“零碳新质生产力”运营商。致力于通过技术创新，为全球企业提供一站式综合能源解决方案。
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 tracking-widest">快速链接</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#00E5FF] font-light transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 tracking-widest">联系我们</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400 font-light">
                <Mail className="w-5 h-5 mr-3 text-[#00E5FF] shrink-0" />
                <a href="mailto:info@aethravolt.com" className="hover:text-white transition-colors">info@aethravolt.com</a>
              </li>
              <li className="flex items-start text-gray-400 font-light">
                <Building className="w-5 h-5 mr-3 text-[#00E5FF] shrink-0 mt-1" />
                <span>深圳南山区清华信息港科研楼 (总部)</span>
              </li>
              <li className="flex items-start text-gray-400 font-light">
                <MapPin className="w-5 h-5 mr-3 text-[#00E5FF] shrink-0 mt-1" />
                <span>California, USA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-light">
            &copy; {new Date().getFullYear()} AethraVolt 合擎源动. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-light">隐私政策</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-light">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-[#00E5FF]/30 selection:text-white">
      <Navbar />
      <Hero />
      <Products />
      <Cases />
      <About />
      <Footer />
    </div>
  );
}
