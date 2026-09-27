import { useEffect, useState } from "react";
import EnquiryForm from "./EnquiryForm";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  GraduationCap,
  MapPin,
  Menu,
  MessageSquare,
  Monitor,
  Plus,
  Sigma,
  Sparkles,
  Target,
  Terminal,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

const subjects = [
  {
    id: "coding",
    number: "01",
    icon: Code2,
    title: "Code with confidence.",
    category: "Coding & development",
    description:
      "Go from understanding the syntax to solving real problems. Build a way of thinking that goes beyond the tutorial.",
    tags: ["Python", "C++", "SQL"],
    topics: [
      "Programming fundamentals and problem solving",
      "Data structures and algorithms",
      "Working with data in Python",
      "Writing clear, testable code",
    ],
  },
  {
    id: "finance",
    number: "02",
    icon: Sigma,
    title: "Make the theory click.",
    category: "Mathematics & finance",
    description:
      "Connect mathematical ideas to the markets. Develop the intuition behind the formulas, one concept at a time.",
    tags: ["Probability", "Statistics", "Markets"],
    topics: [
      "Probability, statistics and linear algebra",
      "Financial markets and instruments",
      "Derivatives and pricing foundations",
      "Turning mathematical ideas into code",
    ],
  },
  {
    id: "tools",
    number: "03",
    icon: Wrench,
    title: "Build your toolkit.",
    category: "Practical industry skills",
    description:
      "Get comfortable with the tools that turn knowledge into useful work, and build projects you can talk about.",
    tags: ["Git", "Excel", "Data analysis"],
    topics: [
      "Version control and collaborative workflows",
      "Excel and analytical modelling",
      "Data cleaning and visualisation",
      "Planning and presenting a personal project",
    ],
  },
  {
    id: "careers",
    number: "04",
    icon: Target,
    title: "Take the next step.",
    category: "Interviews & career direction",
    description:
      "Understand the roles, find where you fit, and walk into interviews with a clearer story and stronger preparation.",
    tags: ["Mock interviews", "CVs", "Applications"],
    topics: [
      "Understanding quant and quant development roles",
      "Identifying firms and opportunities to research",
      "CV, application and project feedback",
      "Technical questions and mock interviews",
    ],
  },
] as const;

const faqs = [
  {
    question: "Do I need to know how to code already?",
    answer:
      "No. We can start with the fundamentals or build on what you already know. In your enquiry, tell us about your background and what you would like to work towards so we can find a sensible starting point.",
  },
  {
    question: "Who is the tutoring for?",
    answer:
      "Our tutoring is aimed at university students, recent graduates and people exploring a move into quantitative finance. Whether you are choosing your first programming language or preparing for a technical interview, we can discuss a plan around your goals.",
  },
  {
    question: "How do the sessions work?",
    answer:
      "Sessions are one-to-one and shaped around your needs. We combine clear explanations, practical exercises and feedback, with time for the questions that matter to you. You can discuss online sessions and any London arrangements when you get in touch.",
  },
  {
    question: "Can you help me decide where to apply?",
    answer:
      "Yes. We can help you understand the differences between quant, quant development and related roles, and think through firms and teams to research. We also work on how you present your skills in applications and interviews.",
  },
  {
    question: "What are your rates and availability?",
    answer:
      "Get in touch with your goals, current level and preferred times. We will discuss the scope, session format, availability and pricing with you before you commit.",
  },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`brand${light ? " brand-light" : ""}`}
      href="#top"
      aria-label="Bekaert and Pastuszka, home"
    >
      <svg
        className="brand-mark"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 32V12h12M38 12v20H26M13 29l9-14 9 14"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand-text">
        Bekaert <span className="ampersand">&</span> Pastuszka
        <span className="brand-caption">QUANT TUTORING & MENTORING</span>
      </span>
    </a>
  );
}

function TutorPortraits() {
  return (
    <div className="avatar-stack" aria-hidden="true">
      <img
        src="/images/paul-portrait.jpg"
        alt=""
        width={48}
        height={48}
        decoding="async"
      />
      <img
        src="/images/kasia.jpg"
        alt=""
        width={48}
        height={48}
        decoding="async"
      />
    </div>
  );
}

function QuantVisual() {
  const project = (u: number, v: number) => {
    const z =
      86 * Math.exp(-((u - 0.22) ** 2 + (v + 0.16) ** 2) * 2.6) +
      22 * Math.sin(u * 2.2 + v);
    return [270 + (u - v) * 120, 205 + (u + v) * 47 - z];
  };
  const mesh = Array.from({ length: 23 }, (_, i) => -1 + i / 11);
  const pathFor = (value: number, cross: boolean) =>
    Array.from({ length: 55 }, (_, i) => {
      const variable = -1 + i / 27;
      const [x, y] = cross
        ? project(variable, value)
        : project(value, variable);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");

  return (
    <div className="visual-wrap" aria-hidden="true">
      <div className="quant-visual">
        <div className="visual-header">
          <span>
            <span className="tiny-dot" /> THEORY, MEET PRACTICE
          </span>
          <ArrowUpRight size={19} strokeWidth={1.3} />
        </div>
        <svg className="surface-plot" viewBox="0 0 540 340" fill="none">
          <defs>
            <linearGradient
              id="mesh-gradient"
              x1="120"
              y1="90"
              x2="400"
              y2="290"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#d3df8f" />
              <stop offset="0.5" stopColor="#9bc7ad" />
              <stop offset="1" stopColor="#497f69" />
            </linearGradient>
            <radialGradient id="plot-glow">
              <stop stopColor="#aac480" stopOpacity=".12" />
              <stop offset="1" stopColor="#aac480" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="278" cy="194" rx="230" ry="145" fill="url(#plot-glow)" />
          <path
            d="M30 225L270 320L510 225M270 320V66"
            stroke="#90b4a0"
            strokeOpacity=".22"
            strokeDasharray="3 5"
          />
          <g stroke="url(#mesh-gradient)" strokeWidth=".8">
            {mesh.map((value, i) => (
              <path key={`u${i}`} d={pathFor(value, false)} opacity=".76" />
            ))}
            {mesh.map((value, i) => (
              <path key={`v${i}`} d={pathFor(value, true)} opacity=".76" />
            ))}
          </g>
          <circle cx="289" cy="124" r="4" fill="#e0dfa2" />
          <circle
            className="plot-pulse"
            cx="289"
            cy="124"
            r="10"
            stroke="#e0dfa2"
            strokeOpacity=".5"
          />
          <path
            d="M301 119L345 79H408"
            stroke="#c4d4b6"
            strokeOpacity=".55"
            strokeWidth=".7"
          />
          <text
            x="350"
            y="69"
            fill="#bacbbd"
            fontSize="10"
            fontFamily="monospace"
          >
            a new perspective
          </text>
          <text
            x="257"
            y="45"
            fill="#8dae9a"
            fontSize="11"
            fontFamily="serif"
            fontStyle="italic"
          >
            f(x, y)
          </text>
          <text
            x="516"
            y="230"
            fill="#8dae9a"
            fontSize="11"
            fontFamily="serif"
            fontStyle="italic"
          >
            x
          </text>
          <text
            x="17"
            y="230"
            fill="#8dae9a"
            fontSize="11"
            fontFamily="serif"
            fontStyle="italic"
          >
            y
          </text>
        </svg>
        <div className="visual-footer">
          <span>
            A little guidance.
            <br />
            <em>A world of possibility.</em>
          </span>
          <span className="visual-index">
            FIG. 01
            <br />
            POTENTIAL, REALISED
          </span>
        </div>
      </div>
      <div className="code-note">
        <div className="code-note-top">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>your_next_chapter.py</span>
        </div>
        <code>
          <span className="code-muted"># Start with curiosity.</span>
          <br />
          <span className="code-keyword">while</span> learning:
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;potential{" "}
          <span className="code-keyword">+=</span> practice
        </code>
        <span className="code-check">
          <Check size={11} /> Progress, one step at a time
        </span>
      </div>
      <span className="visual-side-note">
        LONDON MINDS. OPEN POSSIBILITIES.
      </span>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [interest, setInterest] = useState("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <Analytics/>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header" id="top">
        <div className="container header-inner">
          <Brand />
          <button
            className="mobile-toggle icon-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            className={menuOpen ? "navigation navigation-open" : "navigation"}
            aria-label="Main navigation"
          >
            <a href="#subjects" onClick={() => setMenuOpen(false)}>
              What we teach
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              Who we are
            </a>
            <a href="#approach" onClick={() => setMenuOpen(false)}>
              Our approach
            </a>
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk
              <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> A CLEARER PATH INTO FINANCE
            </span>
            <h1 id="hero-title">
              A sharper mind.
              <br />
              <em>A clearer path.</em>
            </h1>
            <p className="hero-description">
              Build the skills to move forward in quantitative finance. Personal
              tutoring and career guidance from two people who work in the
              industry, every day.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#subjects">
                Find your starting point
                <ArrowUpRight size={17} />
              </a>
              <a className="text-link" href="#about">
                Meet your tutors
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-people">
              <TutorPortraits />
              <p>
                Paul Bekaert & Katarzyna Pastuszka
                <span>
                  <MapPin size={12} /> London based. Personally invested.
                </span>
              </p>
            </div>
          </div>
          <QuantVisual />
        </section>

        <div className="principles-strip">
          <div className="container principles-inner">
            <span>
              <Users size={19} strokeWidth={1.5} />
              One-to-one, always
            </span>
            <span>
              <GraduationCap size={21} strokeWidth={1.5} />
              Strong academic foundations
            </span>
            <span>
              <Terminal size={19} strokeWidth={1.5} />
              Real industry perspective
            </span>
            <span>
              <Sparkles size={19} strokeWidth={1.5} />
              Built around your ambitions
            </span>
          </div>
        </div>

        <section
          className="subjects-section section-space container"
          id="subjects"
          aria-labelledby="subjects-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / WHAT WE TEACH</span>
              <h2 id="subjects-title">
                The skills behind
                <br />
                <em>your next opportunity.</em>
              </h2>
            </div>
            <p>
              Start with what you need.
              <br />
              We’ll connect the dots as you grow.
            </p>
          </div>
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject.id}>
                <div className="subject-top">
                  <subject.icon size={27} strokeWidth={1.4} />
                  <span>{subject.number}</span>
                </div>
                <p className="subject-category">{subject.category}</p>
                <h3>{subject.title}</h3>
                <p className="subject-description">{subject.description}</p>
                <div className="tags">
                  {subject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <details className="subject-details">
                  <summary>
                    Explore the topics
                    <Plus size={17} />
                  </summary>
                  <div className="subject-expanded">
                    <ul>
                      {subject.topics.map((topic) => (
                        <li key={topic}>
                          <Check size={14} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <a
                      className="text-link"
                      href="#contact"
                      onClick={() => setInterest(subject.category)}
                    >
                      Let’s work on this
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </details>
              </article>
            ))}
          </div>
          <div className="subjects-footnote">
            <span>
              <MessageSquare size={16} /> Not sure where to start? That’s a good
              place to begin.
            </span>
            <a
              href="#contact"
              className="text-link"
              onClick={() => setInterest("a little guidance on where to start")}
            >
              Let’s figure it out
              <ArrowRight size={15} />
            </a>
          </div>
        </section>

        <section
          className="about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="container about-inner">
            <div className="about-copy">
              <span className="eyebrow">02 / YOUR TUTORS</span>
              <h2 id="about-title">
                A shared background.
                <br />
                <em>A personal approach.</em>
              </h2>
              <p>
                We’re Paul and Katarzyna — a quant developer and a quant working
                in London’s finance industry.
              </p>
              <p>
                Having studied at leading universities, we know how demanding
                the learning curve can feel. We bring our academic foundations
                and day-to-day industry experience to help you take the next
                step with confidence.
              </p>
              <div className="about-note">
                <span className="small-rule" />
                <span>Two perspectives. One focus: your progress.</span>
              </div>
              <figure className="london-photo">
                <img
                  src="/images/london-skyline.webp"
                  alt="The City of London skyline above the River Thames"
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>
                    <MapPin size={12} /> London perspective. Wherever you are.
                  </span>
                  <a
                    href="https://unsplash.com/photos/city-skyline-under-blue-sky-during-daytime-mVXskviY-PQ"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Photo: Jamie / Unsplash <ArrowUpRight size={10} />
                  </a>
                </figcaption>
              </figure>
            </div>
            <div className="tutors">
              <article className="tutor-card">
                <div className="tutor-avatar tutor-avatar-paul">
                  <img
                    src="/images/paul-portrait.jpg"
                    alt="Paul Bekaert"
                    width={480}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <span aria-hidden="true">
                    <Code2 size={17} />
                  </span>
                </div>
                <div className="tutor-details">
                  <span className="tutor-role">
                    THE DEVELOPMENT PERSPECTIVE
                  </span>
                  <h3>Paul Bekaert</h3>
                  <p className="tutor-job">Quant Developer · London</p>
                  <p>
                    Connecting code, problem solving and the practical demands
                    of working in finance.
                  </p>
                  <span className="tutor-focus">CODE / BUILD / UNDERSTAND</span>
                </div>
              </article>
              <article className="tutor-card">
                <div className="tutor-avatar tutor-avatar-katarzyna">
                  <img
                    src="/images/kasia.jpg"
                    alt="Katarzyna Pastuszka"
                    width={200}
                    height={200}
                    loading="lazy"
                    decoding="async"
                  />
                  <span aria-hidden="true">
                    <Sigma size={18} />
                  </span>
                </div>
                <div className="tutor-details">
                  <span className="tutor-role">
                    THE QUANTITATIVE PERSPECTIVE
                  </span>
                  <h3>Katarzyna Pastuszka</h3>
                  <p className="tutor-job">Quant · London</p>
                  <p>
                    Bringing mathematical thinking and financial intuition
                    together, from theory to application.
                  </p>
                  <span className="tutor-focus">
                    QUESTION / ANALYSE / CONNECT
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className="approach-section section-space container"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / HOW WE WORK</span>
              <h2 id="approach-title">
                Your goals.
                <br />
                <em>Our starting point.</em>
              </h2>
            </div>
            <p>
              No one-size-fits-all syllabus.
              <br />
              Just a thoughtful plan to move you forward.
            </p>
          </div>
          <div className="approach-content">
            <figure className="study-photo">
              <div className="study-photo-frame">
                <img
                  src="/images/study-desk.webp"
                  alt="A laptop displaying code on a bright desk beside a monitor and a small plant"
                  width={1000}
                  height={750}
                  loading="lazy"
                  decoding="async"
                />
                <div className="study-photo-note">
                  <span className="eyebrow">SPACE TO THINK. ROOM TO GROW.</span>
                  <p>
                    A little focus.
                    <br />
                    <em>A step forward.</em>
                  </p>
                </div>
              </div>
              <figcaption>
                <span>Your questions. Your pace.</span>
                <a
                  href="https://unsplash.com/photos/a-macbook-with-lines-of-code-on-its-screen-on-a-busy-desk-m_HRfLhgABo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Photo: Christopher Gower / Unsplash <ArrowUpRight size={10} />
                </a>
              </figcaption>
            </figure>
            <div className="steps">
              <article className="step">
                <div className="step-number">
                  <span>01</span>
                  <span className="step-line" />
                </div>
                <h3>Tell us where you are.</h3>
                <p>
                  We start with your background, your questions and what you
                  want to achieve. You don’t need to have it all figured out.
                </p>
              </article>
              <article className="step">
                <div className="step-number">
                  <span>02</span>
                  <span className="step-line" />
                </div>
                <h3>Make a plan together.</h3>
                <p>
                  We identify what matters most and shape a learning plan around
                  your level, your schedule and your next milestone.
                </p>
              </article>
              <article className="step">
                <div className="step-number">
                  <span>03</span>
                  <Check size={21} strokeWidth={1.4} />
                </div>
                <h3>Learn. Apply. Progress.</h3>
                <p>
                  Work through ideas, put them into practice and get honest
                  feedback. Build understanding you can take with you.
                </p>
              </article>
            </div>
          </div>
          <div className="approach-banner">
            <span>
              <Monitor size={21} strokeWidth={1.4} />
              One-to-one learning, wherever you are.
            </span>
            <span>
              Practical sessions. Room for questions. A pace that fits.
            </span>
          </div>
        </section>

        <section className="faq-section container" aria-labelledby="faq-title">
          <div>
            <span className="eyebrow">A FEW THINGS TO KNOW</span>
            <h2 id="faq-title">
              Good questions.
              <br />
              <em>Clear answers.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details className="faq-item" name="faq" key={faq.question}>
                <summary>
                  <span className="faq-number">0{index + 1}</span>
                  <span>{faq.question}</span>
                  <Plus size={18} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container contact-inner">
            <div className="contact-copy">
              <span className="eyebrow">
                <span className="tiny-dot" /> YOUR NEXT CHAPTER
              </span>
              <h2 id="contact-title">
                Big ambitions
                <br />
                start with a<br /> <em>small conversation.</em>
              </h2>
              <p>
                Tell us a little about yourself and where you’d like to go.
                We’ll work out how we can help.
              </p>
              <div className="contact-people">
                <TutorPortraits />
                <div className="contact-signature">
                  <span>Paul & Katarzyna</span>
                  <span>
                    <MapPin size={13} /> London, United Kingdom
                  </span>
                </div>
              </div>
              <ArrowDown className="contact-arrow" size={34} strokeWidth={1} />
            </div>
            <EnquiryForm
              interest={interest}
              onInterestChange={setInterest}
              categories={subjects.map((subject) => subject.category)}
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <Brand />
          <span>Good foundations. Greater possibilities.</span>
          <a className="text-link" href="#top">
            Back to top
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Bekaert & Pastuszka. All rights
            reserved.
          </span>
          <span>Independent tutoring & mentoring · London</span>
        </div>
      </footer>
    </>
  );
}
