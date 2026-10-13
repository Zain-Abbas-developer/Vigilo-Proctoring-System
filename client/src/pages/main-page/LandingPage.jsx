import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Camera,
  MonitorCheck,
  Users,
  ScanFace,
  Eye,
  Brain,
  LockKeyhole,
  CheckCircle2,
  PlayCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: ScanFace,
    title: "AI Face Detection",
    description:
      "Verify student identity and continuously monitor face presence during examinations.",
  },
  {
    icon: Users,
    title: "Multiple Face Detection",
    description:
      "Detect additional faces in the camera view and automatically flag suspicious activity.",
  },
  {
    icon: MonitorCheck,
    title: "Screen Monitoring",
    description:
      "Monitor the candidate's screen activity and identify unauthorized actions during exams.",
  },
  {
    icon: Eye,
    title: "Tab Switch Detection",
    description:
      "Detect when students leave the examination tab and record every suspicious event.",
  },
  {
    icon: Brain,
    title: "AI-Powered Monitoring",
    description:
      "Use intelligent monitoring to identify unusual behavior and potential exam violations.",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Alerts",
    description:
      "Teachers and administrators can monitor active exams and receive violation alerts instantly.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Exam",
    description:
      "Teachers create exams, questions, schedules and configure proctoring rules.",
  },
  {
    number: "02",
    title: "Student Verification",
    description:
      "Students complete system checks, camera verification and identity verification.",
  },
  {
    number: "03",
    title: "Take the Exam",
    description:
      "Students complete their examination while Vigilo continuously monitors activity.",
  },
  {
    number: "04",
    title: "Review Results",
    description:
      "Teachers review results, attempts, violations and detailed monitoring reports.",
  },
];

const stats = [
  { value: "99.9%", label: "Monitoring Reliability" },
  { value: "24/7", label: "Exam Protection" },
  { value: "Real-Time", label: "Violation Alerts" },
  { value: "AI", label: "Powered Detection" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Vigilo
              </h1>
              <p className="-mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-600">
                Proctoring System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link 
              to="/features"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Features
            </Link>


            <Link
              to="/how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              How It Works
            </Link>

            <Link
              to="/security"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Security
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                to="/features"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Features
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                How It Works
              </Link>

              <Link
                to="/security"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                Security
              </Link>

              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                About
              </Link>

              <div className="flex gap-3 border-t border-slate-200 pt-4">
                <Link
                  to="/login"
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <main>
        <section className="relative isolate pt-32 pb-20 lg:pt-40 lg:pb-28">
          {/* Background decoration */}
          <div className="absolute inset-x-0 top-0 -z-10 h-162.5 overflow-hidden">
            <div className="absolute left-1/2 top-10 h-125 w-175 -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="absolute left-0 top-72 h-72 w-72 rounded-full bg-violet-100/40 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
            {/* Hero Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                AI-Powered Online Proctoring
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Smarter Exams.
                <span className="block text-indigo-600">
                  Stronger Integrity.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Vigilo is an intelligent online proctoring platform that
                helps institutions conduct secure, reliable and transparent
                examinations from anywhere.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <PlayCircle className="h-5 w-5 text-indigo-600" />
                  See How It Works
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Secure monitoring
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Real-time alerts
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Detailed reports
                </div>
              </div>
            </motion.div>

            {/* Hero Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-4xl bg-indigo-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/80">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      LIVE EXAM MONITOR
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">
                      Mathematics Midterm
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">
                      Live
                    </span>
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="col-span-2 rounded-2xl bg-slate-950 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Active Students
                      </span>

                      <Users className="h-4 w-4 text-indigo-400" />
                    </div>

                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-white">128</span>

                      <span className="text-xs font-medium text-emerald-400">
                        +12%
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                      <ScanFace className="h-5 w-5 text-indigo-600" />
                    </div>

                    <p className="mt-4 text-xl font-bold text-slate-900">
                      124
                    </p>

                    <p className="text-xs text-slate-500">
                      Verified Students
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <ShieldCheck className="h-5 w-5 text-amber-600" />
                    </div>

                    <p className="mt-4 text-xl font-bold text-slate-900">
                      04
                    </p>

                    <p className="text-xs text-slate-500">
                      Warnings
                    </p>
                  </div>
                </div>

                {/* Monitoring Rows */}
                <div className="mt-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        JD
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          John Doe
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Student #1024
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                      Normal
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        SA
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Sarah Ahmed
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Student #1025
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
                      Warning
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Exam Progress
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      72%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[72%] rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Floating Security Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                    <LockKeyhole className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Exam Protected
                    </p>
                    <p className="text-[10px] text-slate-500">
                      AI monitoring active
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-5 py-8 text-center lg:py-10"
              >
                <p className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                Powerful Features
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Everything you need for secure online exams
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Vigilo combines intelligent monitoring and powerful exam
                management tools to create a trusted digital examination
                environment.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition group-hover:bg-indigo-600">
                      <Icon className="h-6 w-6 text-indigo-600 transition group-hover:text-white" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 bg-slate-950 py-24 text-white lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                  Simple Workflow
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  From exam creation to final report.
                </h2>

                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                  Vigilo keeps the entire online examination process organized,
                  secure and easy to manage.
                </p>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Start Using Vigilo
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <span className="text-sm font-bold text-indigo-400">
                      {step.number}
                    </span>

                    <h3 className="mt-5 text-lg font-bold">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="scroll-mt-24 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              {/* Security Visual */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl bg-indigo-50 p-8 sm:p-12">
                  <div className="mx-auto max-w-sm rounded-2xl border border-indigo-100 bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                          <ShieldCheck className="h-5 w-5 text-white" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            Security Status
                          </p>
                          <p className="text-xs text-slate-400">
                            Examination protected
                          </p>
                        </div>
                      </div>

                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>

                    <div className="mt-7 space-y-4">
                      {[
                        "Face verification",
                        "Camera monitoring",
                        "Screen monitoring",
                        "Tab activity",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                        >
                          <span className="text-xs font-medium text-slate-600">
                            {item}
                          </span>

                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
                      <p className="text-xs font-semibold text-emerald-700">
                        All monitoring systems operational
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                  Built for Integrity
                </span>

                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Protect every examination with intelligent monitoring.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Vigilo gives educators the tools they need to maintain
                  examination integrity without making the student experience
                  complicated.
                </p>

                <div className="mt-8 space-y-5">
                  {[
                    {
                      icon: Camera,
                      title: "Continuous Camera Monitoring",
                      description:
                        "Monitor student presence and detect unusual activity during an exam.",
                    },
                    {
                      icon: MonitorCheck,
                      title: "Screen Activity Protection",
                      description:
                        "Track screen activity and identify unauthorized behavior.",
                    },
                    {
                      icon: LockKeyhole,
                      title: "Secure Examination Environment",
                      description:
                        "Keep examination data and monitoring information protected.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex gap-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-indigo-600 px-7 py-16 text-center sm:px-12 lg:px-20"
            >
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <ShieldCheck className="mx-auto h-12 w-12 text-indigo-100" />

                <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ready to make online examinations more secure?
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                  Start building a more reliable and transparent examination
                  experience with Vigilo.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-indigo-400 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-500"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">Vigilo</p>
                  <p className="text-[9px] uppercase tracking-widest text-indigo-600">
                    Proctoring System
                  </p>
                </div>
              </Link>

              <p className="mt-3 max-w-sm text-sm text-slate-500">
                Intelligent online proctoring for secure and trusted digital
                examinations.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <Link to="/features" className="hover:text-indigo-600">
                Features
              </Link>

              <Link to="/how-it-works" className="hover:text-indigo-600">
                How It Works
              </Link>

              <Link to="/security" className="hover:text-indigo-600">
                Security
              </Link>

              <Link to="/login" className="hover:text-indigo-600">
                Login
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Vigilo Proctoring System. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;