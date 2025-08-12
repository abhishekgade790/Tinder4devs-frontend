import React, { useState, useEffect } from 'react';
import { Heart, Code, Users, Zap, Github, Coffee, MessageCircle, Star, ArrowRight, Globe, Cpu, Terminal, Rocket } from 'lucide-react';
import { Link } from 'react-router';

export default function Tinder4DevsLanding() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const features = [
    {
      icon: "💬",
      title: "Match by Tech Stack",
      description: "Swipe right on people who code what you code — React, Rust, Python or Ruby.",
      tag: "#TechCompatibility",
      color: "primary"
    },
    {
      icon: "📚",
      title: "Share Projects",
      description: "Show off your GitHub, blog, or side hustle. Let your work speak for you.",
      tag: "#CodeShowcase",
      color: "secondary"
    },
    {
      icon: "⚡",
      title: "Real-time Geek Chat",
      description: "Talk tech, banter, or debug together with our specialized chat.",
      tag: "#PairProgramming",
      color: "accent"
    },
    {
      icon: "🎯",
      title: "Niche Interests",
      description: "Filter by interests like Web3, Anime, AI, Open Source, Gaming, and more.",
      tag: "#GeekPassions",
      color: "info"
    }
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Full Stack Dev", text: "Found my perfect coding partner! We built 3 projects together.", avatar: "SC" },
    { name: "Alex Rodriguez", role: "Frontend Dev", text: "Amazing platform! Met incredible developers and learned so much.", avatar: "AR" },
    { name: "Mike Johnson", role: "DevOps Engineer", text: "Finally, a place where geeks can connect over code and coffee.", avatar: "MJ" }
  ];

  const techStack = ["React", "Vue", "Angular", "Node.js", "Python", "Go", "Rust", "TypeScript", "Web3", "AI/ML"];

  const steps = [
    {
      number: "01",
      title: "Create Your Dev Profile",
      description: "Showcase your skills, projects, and what you're looking to build. Connect your GitHub for instant credibility.",
      icon: <Code className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Swipe & Match",
      description: "Browse developer profiles, swipe right on interesting skills and projects. When they swipe right back, it's a match!",
      icon: <Heart className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Code Together",
      description: "Start collaborating immediately with built-in chat, project boards, and GitHub integration.",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[90vh] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
        <div className="hero-content text-center max-w-6xl relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="stats stats-horizontal shadow-2xl bg-base-100/90 backdrop-blur-md">
                <div className="stat place-items-center">
                  <div className="stat-title text-primary font-semibold">Active Devs</div>
                  <div className="stat-value text-2xl text-primary">25K+</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title text-secondary font-semibold">Matches</div>
                  <div className="stat-value text-2xl text-secondary">50K+</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title text-accent font-semibold">Projects</div>
                  <div className="stat-value text-2xl text-accent">12K+</div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-primary">Tinder</span>
              <span className="text-secondary">For</span>
              <span className="text-accent">Geeks</span>
              <span className="text-primary">!</span>
            </h1>

            <h2 className="text-xl md:text-2xl mb-4 font-medium">
              Where tech minds connect{" "}
              <span className="text-primary font-bold">Beyond The Code.</span>
            </h2>

            <div className="mb-8 text-lg space-y-2">
              <p>💬 Match with devs who love the same tech stack</p>
              <p>🤝 Connect with like-minded developers</p>
              <p>📚 Share knowledge and learn from each other</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {techStack.map((tech, index) => (
                <div
                  key={tech}
                  className="badge badge-outline badge-lg hover:badge-primary transition-all duration-300 cursor-pointer transform hover:scale-110"
                >
                  {tech}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={"/login"}>
                <button className="btn btn-primary btn-lg group hover:scale-105 transform transition-all duration-300">
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="btn btn-outline btn-secondary btn-lg hover:scale-105 transform transition-all duration-300">
                <Github className="w-5 h-5 mr-2" />
                Connect GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Cpu className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <Terminal className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Globe className="w-14 h-14 text-accent animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Rocket className="w-10 h-10 text-info animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Built for Coders Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              👨‍💻 Built for Coders, by a Coder
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              A dating experience designed around what matters to techies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card bg-base-100 shadow-xl hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 ${currentFeature === index ? 'ring-2 ring-primary scale-105' : ''
                  }`}
              >
                <div className="card-body text-center h-full">
                  <div className={`bg-${feature.color}/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className={`card-title justify-center text-${feature.color} mb-3`}>
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 flex-grow mb-4">
                    {feature.description}
                  </p>
                  <div className="divider my-2"></div>
                  <div className="text-xs font-mono opacity-60">
                    {feature.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={"/login"}>
              <button className="btn btn-primary btn-lg">
                Explore All Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-base-content/70">Three simple steps to find your coding soulmate</p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}>
                <div className="lg:w-1/2">
                  <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="badge badge-primary badge-lg text-lg font-bold px-4 py-3">
                          {step.number}
                        </div>
                        <div className="text-primary">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-primary">{step.title}</h3>
                      <p className="text-base-content/80 text-lg">{step.description}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="mockup-phone border-primary">
                    <div className="camera"></div>
                    <div className="display">
                      <div className="artboard artboard-demo phone-1 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <div className="text-center text-secondary p-4">
                          <div className="text-4xl mb-2">{step.icon}</div>
                          <div className="text-sm font-semibold">{step.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-base-content/70">Real developers, real connections</p>
          </div>

          <div className="flex justify-center">
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
              <div className="card-body text-center">
                <div className="flex justify-center mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-r from-primary to-secondary text-neutral-content rounded-full w-16">
                      <span className="text-xl font-bold text-white">
                        {testimonials[currentTestimonial].avatar}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg mb-6 italic">"{testimonials[currentTestimonial].text}"</p>
                <div className="text-center">
                  <p className="font-bold text-primary">{testimonials[currentTestimonial].name}</p>
                  <p className="text-base-content/70">{testimonials[currentTestimonial].role}</p>
                </div>
                <div className="rating rating-sm mt-4">
                  {[...Array(5)].map((_, i) => (
                    <input key={i} type="radio" className="mask mask-star-2 bg-warning" defaultChecked />
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${currentTestimonial === index ? 'bg-primary' : 'bg-base-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mindset Tagline */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Find Your Coding Partner?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of developers who have already found their perfect match.
              Your next great collaboration is just a swipe away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn btn-neutral btn-lg hover:scale-105 transform transition-all duration-300">
                <Github className="w-5 h-5 mr-2" />
                Sign Up with GitHub
              </button>
              <Link to={"/login"}>
                <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary hover:scale-105 transform transition-all duration-300">
                  <Coffee className="w-5 h-5 mr-2" />
                  Join the Community
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}