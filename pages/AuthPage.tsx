



import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AerugoIcon } from '../components/icons/DockerIcon';
import { BriefcaseIcon } from '../components/icons/BriefcaseIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { CodeBracketIcon } from '../components/icons/CodeBracketIcon';
import { ServerStackIcon } from '../components/icons/ServerStackIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CloudIcon } from '../components/icons/CloudIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

const AuthPage: React.FC = () => {
  const introductionSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDocsClick = () => {
    introductionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Particle animation logic
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000, radius: 150 };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        init();
    };

    class Particle {
        x: number;
        y: number;
        size: number;
        baseX: number;
        baseY: number;
        density: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.size = 1.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(165, 180, 252, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = (forceDirectionX * force * this.density);
            let directionY = (forceDirectionY * force * this.density);

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    const init = () => {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    };

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        animationFrameId = requestAnimationFrame(animate);
    };

    const connect = () => {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                               ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(129, 140, 248, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();
    animate();

    // Intersection observer for cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (cardsContainerRef.current) {
        observer.observe(cardsContainerRef.current);
    }
    
    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        if (cardsContainerRef.current) {
            observer.unobserve(cardsContainerRef.current);
        }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-800/50">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-3">
            <AerugoIcon className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold text-slate-50">Aerugo Registry</span>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6">
             <button
                onClick={handleDocsClick}
                className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 transition-colors"
             >
                Introduction
                           
              </button>
              <Link
                to="/docs"
                className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 transition-colors"
              >
                Docs
              </Link>
            <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1 transition-colors"
              >
                Sign In
              </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative pt-20 pb-16 sm:pt-24 lg:pt-32 text-center bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70"></canvas>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-indigo-300 text-transparent bg-clip-text animate-shimmer">
            The Modern, Secure Container Registry
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
            Streamline your development workflow with a private, scalable, and easy-to-use registry for all your container images.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </main>

      {/* Introduction Section */}
      <section ref={introductionSectionRef} id="introduction" className="relative py-24 sm:py-32 bg-slate-900/70 scroll-mt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
            {/* Pulsing Core */}
            <div className="absolute inset-0 bg-indigo-950/30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] animate-pulse-glow"></div>
            {/* Scrolling Grid */}
            <div 
                className="absolute inset-0 opacity-[0.05] animate-scroll-grid" 
                style={{
                    backgroundImage: 'linear-gradient(rgba(203, 213, 225, 0.5) 1px, transparent 1px), linear-gradient(to right, rgba(203, 213, 225, 0.5) 1px, transparent 1px)',
                    backgroundSize: '4rem 4rem',
                }}
            />
            {/* Running Lights */}
            <div className="absolute inset-0 animate-running-lights-vertical"></div>
            <div className="absolute inset-0 animate-running-lights-horizontal"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-sky-400 to-indigo-400 text-transparent bg-clip-text animate-shimmer">
                    Built for the Future of Development
                </h2>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300/90">
                    Aerugo is a next-generation, distributed, and multi-tenant container registry built with Rust. Designed for high performance and scalability, leveraging an S3-compatible object storage backend.
                </p>
            </div>
            <div ref={cardsContainerRef} className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4 feature-card-container">
                {techFeatures.map((feature, index) => (
                    <TechFeatureCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        animationDelay={`${150 * index}ms`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-indigo-300 text-transparent bg-clip-text animate-shimmer">
                    Designed for a Modern Workflow
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                    Everything you need to build, secure, and deploy your applications at scale.
                </p>
            </div>
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                    <InteractiveWorkflowCard 
                        {...workflowFeatures[0]} 
                        className="h-full"
                    >
                        <AnimatedCodeSnippet />
                    </InteractiveWorkflowCard>
                </div>
                <div className="grid gap-8 mt-8 lg:mt-0">
                    <InteractiveWorkflowCard {...workflowFeatures[1]} />
                    <InteractiveWorkflowCard {...workflowFeatures[2]} />
                </div>
            </div>
        </div>
      </section>
      
      {/* Core Concepts Section */}
      <section className="py-24 sm:py-32 bg-slate-900/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-sky-400 to-indigo-400 text-transparent bg-clip-text animate-shimmer">
                        Powerful Core Concepts
                    </h2>
                    <p className="mt-6 text-lg text-slate-300/90">
                        Aerugo is built around a flexible, hierarchical structure that makes managing your software supply chain intuitive and secure.
                    </p>
                    <ul className="mt-8 space-y-4 text-left">
                        <li className="flex items-start">
                            <BriefcaseIcon className="w-6 h-6 mr-4 mt-1 text-sky-300 flex-shrink-0"/>
                            <div>
                                <h3 className="font-semibold text-slate-50">Organizations</h3>
                                <p className="text-slate-400">Create dedicated workspaces for your teams or projects. Each organization is a self-contained unit with its own members and repositories.</p>
                            </div>
                        </li>
                         <li className="flex items-start">
                            <ServerStackIcon className="w-6 h-6 mr-4 mt-1 text-sky-300 flex-shrink-0"/>
                            <div>
                                <h3 className="font-semibold text-slate-50">Repositories</h3>
                                <p className="text-slate-400">Store and manage your container images. Repositories belong to organizations, inheriting their access policies.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <UsersIcon className="w-6 h-6 mr-4 mt-1 text-sky-300 flex-shrink-0"/>
                            <div>
                                <h3 className="font-semibold text-slate-50">Members & Roles</h3>
                                <p className="text-slate-400">Invite users to your organizations with role-based access control (Owner, Admin, Member) to ensure security and proper governance.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                    <HubAndSpokeDiagram />
                </div>
             </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center space-x-3">
                        <AerugoIcon className="w-8 h-8 text-indigo-400" />
                        <span className="text-xl font-bold text-slate-50">Aerugo Registry</span>
                    </div>
                    <p className="mt-4 text-slate-400 text-sm max-w-xs">
                        A modern, secure, and performant container registry built for developers and teams.
                    </p>
                </div>

                {/* Product Links */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Product</h3>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <button onClick={handleDocsClick} className="text-sm text-slate-400 hover:text-white transition-colors">
                                Introduction
                            </button>
                        </li>
                        <li>
                            <Link to="/repositories" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Repositories
                            </Link>
                        </li>
                        <li>
                            <Link to="/organizations" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Organizations
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Resources Links */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Resources</h3>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link to="/docs" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Docs
                            </Link>
                        </li>
                         <li>
                             <Link to="/docs#tos" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Terms of Service
                             </Link>
                         </li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} Aerugo Registry. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

const HubAndSpokeDiagram = () => {
    const nodes = [
        { icon: <BriefcaseIcon className="w-8 h-8"/>, label: 'Organizations' },
        { icon: <ServerStackIcon className="w-8 h-8"/>, label: 'Repositories' },
        { icon: <UsersIcon className="w-8 h-8"/>, label: 'Members & Roles' },
        { icon: <ShieldCheckIcon className="w-8 h-8"/>, label: 'Security' },
        { icon: <CodeBracketIcon className="w-8 h-8"/>, label: 'CI/CD Pipelines' },
    ];
    const radius = 150; // Radius of the circle on which nodes are placed
    const center = 175; // Center of the SVG viewBox

    return (
        <div className="relative w-[350px] h-[350px]">
            <svg viewBox="0 0 350 350" className="absolute inset-0 w-full h-full animate-diagram-rotate">
                 {nodes.map((_, index) => {
                    const angle = (index / nodes.length) * 2 * Math.PI;
                    const x2 = center + radius * Math.cos(angle);
                    const y2 = center + radius * Math.sin(angle);
                    return (
                         <line
                            key={index}
                            x1={center} y1={center}
                            x2={x2} y2={y2}
                            stroke="rgba(79, 70, 229, 0.2)"
                            strokeWidth="1.5"
                            className="animate-pulse-spoke-line"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                    );
                 })}
            </svg>
            <div className="relative w-full h-full">
                {/* Central Hub */}
                 <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-900/40 rounded-full flex flex-col items-center justify-center text-center p-2 border-2 border-indigo-500/50 animate-pulse-hub"
                >
                    <AerugoIcon className="w-10 h-10 text-indigo-300"/>
                    <span className="text-sm font-bold text-slate-100 mt-1">Aerugo Registry</span>
                </div>
                {/* Spoke Nodes */}
                {nodes.map((node, index) => {
                    const angle = (index / nodes.length) * 2 * Math.PI;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <div
                            key={node.label}
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 flex flex-col items-center justify-center text-center p-2 animate-float-node"
                            style={{ 
                                left: `${(x / 350) * 100}%`, 
                                top: `${(y / 350) * 100}%`,
                                animationDelay: `${index * 0.5}s` 
                            }}
                        >
                            <div className="p-3 bg-slate-800 border border-slate-700 rounded-full text-sky-300">
                                {node.icon}
                            </div>
                             <span className="text-xs font-semibold text-slate-300 mt-2">{node.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const techFeatures = [
    {
        icon: <ServerStackIcon className="h-8 w-8 text-sky-300" />,
        title: "Distributed & Highly Available",
        description: "Designed to run in a clustered environment with no single point of failure.",
    },
    {
        icon: <UsersIcon className="h-8 w-8 text-sky-300" />,
        title: "Multi-tenancy",
        description: "First-class support for users and organizations with granular access control.",
    },
    {
        icon: <CloudIcon className="h-8 w-8 text-sky-300" />,
        title: "S3-Compatible Backend",
        description: "Uses any S3-compatible object storage for durability and infinite scalability.",
    },
    {
        icon: <RocketLaunchIcon className="h-8 w-8 text-sky-300" />,
        title: "Written in Rust",
        description: "Provides memory safety, concurrency, and performance for a secure, efficient core.",
    },
];

const AnimatedCodeSnippet = () => {
  const codeLines = [
    '# repository-policy.yaml',
    'repository: a-team/webapp-frontend',
    '',
    '# Access rules define team and user permissions.',
    'permissions:',
    "  - team: 'frontend-developers'",
    "    level: 'read-write'",
    "  - team: 'platform-engineering'",
    "    level: 'read-only'",
  ];
  const fullCode = codeLines.join('\n');
  const [displayedCode, setDisplayedCode] = useState('');
  
  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: number;

    const type = () => {
        if (currentIndex < fullCode.length) {
            setDisplayedCode(prev => fullCode.substring(0, currentIndex + 1));
            currentIndex++;
            timeoutId = window.setTimeout(type, Math.random() * 20 + 10);
        } else {
            timeoutId = window.setTimeout(() => {
                setDisplayedCode('');
                currentIndex = 0;
                type();
            }, 4000);
        }
    };

    timeoutId = window.setTimeout(type, 500);

    return () => clearTimeout(timeoutId);
  }, [fullCode]);

  return (
    <div className="mt-6 w-full h-80 bg-slate-900/70 rounded-lg border border-slate-700 font-mono text-sm text-indigo-300 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="p-4 overflow-hidden">
        <pre className="whitespace-pre-wrap">
            <code>
            {displayedCode}
            <span className="inline-block w-2.5 h-4 bg-indigo-300 animate-blinking-cursor ml-0.5"></span>
            </code>
        </pre>
      </div>
    </div>
  );
};


const workflowFeatures = [
    {
        icon: <BriefcaseIcon className="h-8 w-8 text-indigo-300" />,
        title: "Centralized Organizations",
        description: "Group repositories under organizations for powerful, team-based access control and management.",
        bgClass: 'animate-bg-grid-flow',
    },
    {
        icon: <ShieldCheckIcon className="h-8 w-8 text-indigo-300" />,
        title: "Robust Security",
        description: "Secure your software supply chain with private repositories and granular, role-based permissions.",
        bgClass: 'animate-bg-shift'
    },
    {
        icon: <CodeBracketIcon className="h-8 w-8 text-indigo-300" />,
        title: "Seamless Integration",
        description: "Fully compatible with the Docker CLI and designed to integrate perfectly with your existing CI/CD pipelines.",
        bgClass: 'animate-bg-lines'
    }
];


interface TechFeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    animationDelay: string;
}

const TechFeatureCard: React.FC<TechFeatureCardProps> = ({ icon, title, description, animationDelay }) => {
    return (
        <div
            className="feature-card group relative bg-transparent rounded-xl transition-all duration-300 ease-out opacity-0"
            style={{ animationDelay }}
        >
             <div 
                className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden transition-all duration-300 group-hover:bg-slate-800/60 group-hover:border-slate-600 animate-bg-pan"
             >
                <div className="relative z-10 p-6 h-full flex flex-col transition-transform duration-300 group-hover:scale-105">
                    <div className="mb-4 inline-block p-3 bg-slate-800 rounded-lg border border-slate-700 transition-colors duration-300 group-hover:bg-slate-700">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
                    <p className="mt-2 text-sm text-slate-400 flex-grow">{description}</p>
                </div>
            </div>
        </div>
    );
};


interface InteractiveWorkflowCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgClass: string;
    className?: string;
    children?: React.ReactNode;
}

const InteractiveWorkflowCard: React.FC<InteractiveWorkflowCardProps> = ({ icon, title, description, bgClass, className = '', children }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={`group relative p-8 bg-slate-900 rounded-xl border border-slate-700/80 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 overflow-hidden ${className}`}
        >
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(79, 70, 229, 0.15), transparent 80%)`,
                }}
            />
            <div className={`absolute -inset-px z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 ${bgClass}`} />
            
            <div className="relative z-10 flex flex-col items-start h-full">
                <div className="mb-4 p-4 bg-slate-800 border border-slate-700 rounded-lg transition-colors duration-300 group-hover:bg-slate-700/50">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
                <p className="mt-2 text-slate-400">{description}</p>
                {children}
            </div>
        </div>
    );
};


export default AuthPage;