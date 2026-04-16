import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

type Locale = 'vi' | 'en';

const hlsSource = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
const portrait = `${import.meta.env.BASE_URL}profile-cv-1-1.png`;
const gmailComposeUrl = (email: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

const copy = {
  vi: {
    nav: ['Trang chủ', 'Dự án', 'Hồ sơ'],
    sayHi: 'Liên hệ',
    collection: "PROFILE '26",
    name: 'Nguyễn Bằng',
    roles: ['Business Analyst', 'Information Systems', 'Team Leader', 'Problem Solver'],
    roleLineStart: 'Một ',
    roleLineEnd: ' sống tại TP. Hồ Chí Minh.',
    description:
      'Sinh viên năm cuối Hệ thống Thông tin, tập trung vào phân tích yêu cầu, mô hình hóa nghiệp vụ, thiết kế dữ liệu và chuyển nhu cầu kinh doanh thành đặc tả rõ ràng.',
    seeWorks: 'Xem dự án',
    reachOut: 'Kết nối...',
    selectedWork: 'Dự án nổi bật',
    featured: 'Featured',
    projectsWord: 'projects',
    workSubtext: 'Những dự án tôi đã tham gia từ phân tích, thiết kế hệ thống đến triển khai.',
    viewAll: 'Xem tất cả',
    works: [
      {
        title: 'Smart Agriculture',
        label: 'E-commerce platform',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'DAT Group PRD',
        label: 'Product requirements',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'Mebione Inventory',
        label: 'Warehouse workflow',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'BA Documentation',
        label: 'UML, ERD, PRD',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
      },
    ],
    thoughts: 'Ghi chú gần đây',
    thoughtsWord: 'thoughts',
    journalSubtext: 'Các điểm mạnh trong hồ sơ Business Analyst của tôi.',
    journals: [
      ['Phân tích 11 lĩnh vực cần tin học hóa', '4 phút đọc', '2025'],
      ['Thiết kế ERD hơn 33 bảng chuẩn 3NF', '5 phút đọc', '2025'],
      ['Viết PRD cho hệ sinh thái Tech - Solar - Power', '6 phút đọc', '2025'],
      ['Đặc tả quy trình kho 2 cấp cho Mebione', '4 phút đọc', '2025'],
    ],
    explorations: 'Khám phá',
    playground: 'Visual',
    playgroundWord: 'playground',
    playgroundSubtext:
      'Một số lát cắt về kỹ năng, học vấn và định hướng nghề nghiệp được trình bày như một hồ sơ tương tác.',
    dribbble: 'Xem CV',
    stats: [
      ['3.3/4.0', 'GPA tại HUTECH'],
      ['95+', 'Use case, epic và bảng dữ liệu đã phân tích'],
      ['2026', 'Sẵn sàng thực tập BA'],
    ],
    contactHeadline: 'Sẵn sàng cho cơ hội thực tập Business Analyst.',
    email: 'nguyenbang280204@gmail.com',
    available: 'Available for internship',
    socials: ['GitHub', 'LinkedIn', 'Portfolio', 'Email'],
    footerLoop: 'BUILDING BUSINESS CLARITY • ',
  },
  en: {
    nav: ['Home', 'Work', 'Resume'],
    sayHi: 'Say hi',
    collection: "PROFILE '26",
    name: 'Nguyen Bang',
    roles: ['Business Analyst', 'Information Systems', 'Team Leader', 'Problem Solver'],
    roleLineStart: 'A ',
    roleLineEnd: ' lives in Ho Chi Minh City.',
    description:
      'Final-year Information Systems student focused on requirement analysis, business modeling, data design, and turning business needs into clear product specifications.',
    seeWorks: 'See Works',
    reachOut: 'Reach out...',
    selectedWork: 'Selected Work',
    featured: 'Featured',
    projectsWord: 'projects',
    workSubtext: "A selection of projects I've worked on, from analysis and system design to launch.",
    viewAll: 'View all work',
    works: [
      {
        title: 'Smart Agriculture',
        label: 'E-commerce platform',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'DAT Group PRD',
        label: 'Product requirements',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'Mebione Inventory',
        label: 'Warehouse workflow',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85',
      },
      {
        title: 'BA Documentation',
        label: 'UML, ERD, PRD',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85',
      },
    ],
    thoughts: 'Recent',
    thoughtsWord: 'thoughts',
    journalSubtext: 'Highlights from my Business Analyst profile and project work.',
    journals: [
      ['Analyzed 11 business areas for digitalization', '4 min read', '2025'],
      ['Designed 33+ normalized ERD tables', '5 min read', '2025'],
      ['Wrote PRD for Tech - Solar - Power ecosystem', '6 min read', '2025'],
      ['Specified two-level warehouse workflow', '4 min read', '2025'],
    ],
    explorations: 'Explorations',
    playground: 'Visual',
    playgroundWord: 'playground',
    playgroundSubtext:
      'A visual slice of my skills, education, and career direction presented as an interactive profile.',
    dribbble: 'Open CV',
    stats: [
      ['3.3/4.0', 'GPA at HUTECH'],
      ['95+', 'Use cases, epics, and data tables analyzed'],
      ['2026', 'Ready for a BA internship'],
    ],
    contactHeadline: 'Ready for a Business Analyst internship opportunity.',
    email: 'nguyenbang280204@gmail.com',
    available: 'Available for internship',
    socials: ['GitHub', 'LinkedIn', 'Portfolio', 'Email'],
    footerLoop: 'BUILDING BUSINESS CLARITY • ',
  },
} as const;

const gallery = [
  { title: 'Requirement Analysis', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85' },
  { title: 'UML Modeling', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85' },
  { title: 'Database Design', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=85' },
  { title: 'Functional Testing', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85' },
  { title: 'Power BI', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85' },
  { title: 'Agile Teamwork', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85' },
];

function BackgroundVideo({ flipped = false }: { flipped?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsSource);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSource;
    }
  }, []);

  return <video ref={videoRef} className={flipped ? 'hls-video flipped' : 'hls-video'} autoPlay muted loop playsInline />;
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['Design', 'Create', 'Inspire'];

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const fallback = window.setTimeout(() => {
      setCount(100);
      onComplete();
    }, 3600);

    const tick = (now: number) => {
      const progress = Math.min((now - started) / 2700, 1);
      setCount(Math.round(progress * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      window.clearTimeout(fallback);
      window.setTimeout(onComplete, 400);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [onComplete]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 900);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div className="loading-screen" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="loading-label">
        Portfolio
      </motion.p>
      <AnimatePresence mode="wait">
        <motion.div
          key={words[wordIndex]}
          className="loading-word"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          {words[wordIndex]}
        </motion.div>
      </AnimatePresence>
      <div className="loading-count">{String(count).padStart(3, '0')}</div>
      <div className="loading-progress">
        <div style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  first,
  italic,
  subtext,
  action,
}: {
  eyebrow: string;
  first: string;
  italic: string;
  subtext: string;
  action: string;
}) {
  return (
    <motion.div
      className="section-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div>
        <div className="section-eyebrow">
          <span />
          {eyebrow}
        </div>
        <h2>
          {first} <em>{italic}</em>
        </h2>
        <p>{subtext}</p>
      </div>
      <a className="ghost-link desktop-only" href="#contact">
        {action} <span>↗</span>
      </a>
    </motion.div>
  );
}

export default function CreativeProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('vi');
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeNav, setActiveNav] = useState('Home');
  const rootRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const current = copy[locale];
  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);
  const navTargets = ['#home', '#work', '#resume'];
  const marqueeText = useMemo(() => Array.from({ length: 10 }, () => current.footerLoop).join(''), [current.footerLoop]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % current.roles.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [current.roles.length, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline.from('.name-reveal', { opacity: 0, y: 50, duration: 1.2, delay: 0.1 });
      timeline.from('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20, duration: 1, stagger: 0.1 }, 0.3);

      if (pinnedRef.current) {
        ScrollTrigger.create({
          trigger: '.explorations-section',
          pin: pinnedRef.current,
          pinSpacing: false,
          start: 'top top',
          end: 'bottom bottom',
        });
      }

      gsap.utils.toArray<HTMLElement>('.gallery-card').forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -160 : 160,
          rotate: index % 2 === 0 ? -4 : 4,
          ease: 'none',
          scrollTrigger: {
            trigger: '.explorations-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 40,
          ease: 'none',
          repeat: -1,
        });
      }
    }, rootRef);

    return () => context.revert();
  }, [isLoading]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 900) {
        setActiveNav(current.nav[1]);
      } else {
        setActiveNav(current.nav[0]);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [current.nav]);

  return (
    <div ref={rootRef} className="creative-shell">
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}</AnimatePresence>

      <header className={activeNav === current.nav[0] ? 'floating-nav' : 'floating-nav scrolled'}>
        <div className="nav-pill">
          <a className="logo-ring" href="#home" aria-label="Nguyen Bang home">
            <span>NB</span>
          </a>
          <span className="nav-divider" />
          <nav>
            {current.nav.map((item, index) => (
              <a className={activeNav === item ? 'active' : ''} href={navTargets[index]} key={item}>
                {item}
              </a>
            ))}
          </nav>
          <span className="nav-divider" />
          <button className="language-pill" type="button" onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}>
            {locale === 'vi' ? 'EN' : 'VI'}
          </button>
          <a className="say-hi" href={gmailComposeUrl(current.email)} target="_blank" rel="noreferrer">
            <span>
              {current.sayHi} ↗
            </span>
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero-video-section">
          <BackgroundVideo />
          <div className="hero-overlay" />
          <div className="hero-fade" />
          <div className="hero-center">
            <p className="hero-eyebrow blur-in">{current.collection}</p>
            <h1 className="name-reveal">{current.name}</h1>
            <p className="role-line blur-in">
              {current.roleLineStart}
              <span key={roleIndex}>{current.roles[roleIndex]}</span>
              {current.roleLineEnd}
            </p>
            <p className="hero-description blur-in">{current.description}</p>
            <div className="hero-buttons blur-in">
              <a className="solid-cta" href="#work">
                {current.seeWorks}
              </a>
              <a className="outline-cta" href={gmailComposeUrl(current.email)} target="_blank" rel="noreferrer">
                {current.reachOut}
              </a>
            </div>
          </div>
          <div className="scroll-indicator">
            <span>SCROLL</span>
            <div>
              <i />
            </div>
          </div>
        </section>

        <section id="work" className="works-section">
          <div className="section-inner">
            <SectionHeading
              eyebrow={current.selectedWork}
              first={current.featured}
              italic={current.projectsWord}
              subtext={current.workSubtext}
              action={current.viewAll}
            />
            <div className="bento-grid">
              {current.works.map((work, index) => (
                <motion.article
                  className={index === 0 || index === 3 ? 'work-card wide' : 'work-card narrow'}
                  key={work.title}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                >
                  <img alt="" src={work.image} />
                  <div className="halftone" />
                  <div className="work-meta">
                    <h3>{work.title}</h3>
                    <p>{work.label}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="journal-section">
          <div className="section-inner">
            <SectionHeading
              eyebrow={current.thoughts}
              first={current.thoughts}
              italic={current.thoughtsWord}
              subtext={current.journalSubtext}
              action={current.viewAll}
            />
            <div className="journal-list">
              {current.journals.map(([title, time, date], index) => (
                <motion.article className="journal-pill" key={title} whileHover={{ x: 8 }}>
                  <img alt="" src={current.works[index].image} />
                  <h3>{title}</h3>
                  <span>{time}</span>
                  <time>{date}</time>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" className="explorations-section">
          <div className="pinned-copy" ref={pinnedRef}>
            <p className="section-eyebrow center">{current.explorations}</p>
            <h2>
              {current.playground} <em>{current.playgroundWord}</em>
            </h2>
            <p>{current.playgroundSubtext}</p>
            <a className="ghost-link" href={portrait} target="_blank" rel="noreferrer">
              {current.dribbble} <span>↗</span>
            </a>
          </div>
          <div className="gallery-columns">
            {gallery.map((item, index) => (
              <motion.button className="gallery-card" type="button" key={item.title} whileHover={{ scale: 1.04 }}>
                <img alt="" src={item.image} />
                <span>{item.title}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="section-inner stats-grid">
            {current.stats.map(([value, label]) => (
              <motion.div key={label} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 28 }} viewport={{ once: true }}>
                <strong>{value}</strong>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <footer id="contact" className="contact-footer">
          <BackgroundVideo flipped />
          <div className="footer-overlay" />
          <div className="footer-marquee">
            <div ref={marqueeRef}>{marqueeText}</div>
          </div>
          <div className="footer-cta">
            <h2>{current.contactHeadline}</h2>
            <a className="email-cta" href={gmailComposeUrl(current.email)} target="_blank" rel="noreferrer">
              {current.email}
            </a>
          </div>
          <div className="footer-bar">
            <div>
              {current.socials.map((social) => (
                <a href={gmailComposeUrl(current.email)} target="_blank" rel="noreferrer" key={social}>
                  {social}
                </a>
              ))}
            </div>
            <p>
              <span /> {current.available}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
