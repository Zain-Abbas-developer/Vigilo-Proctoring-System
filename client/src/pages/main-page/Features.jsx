import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  ScanFace,
  Users,
  MonitorCheck,
  Eye,
  Brain,
  BellRing,
  FileWarning,
  BarChart3,
  Settings2,
  CheckCircle2,
  X,
  Menu,
} from "lucide-react";

const features = [
  {
    icon: ScanFace,
    title: "AI Face Verification",
    description:
      "Verify a student's identity before an examination starts and make sure the correct candidate is taking the exam.",
  },
  {
    icon: Users,
    title: "Multiple Face Detection",
    description:
      "Detect additional faces appearing in the camera view and automatically record the event as a potential violation.",
  },
  {
    icon: MonitorCheck,
    title: "Screen Monitoring",
    description:
      "Monitor the examination screen to help identify unauthorized activity while students are taking their exams.",
  },
  {
    icon: Eye,
    title: "Tab Switch Detection",
    description:
      "Detect when a student leaves the examination environment and record tab-switch activity for review.",
  },
  {
    icon: Brain,
    title: "AI Behavior Monitoring",
    description:
      "Use intelligent monitoring signals to identify suspicious activity and provide useful information to exam supervisors.",
  },
  {
    icon: BellRing,
    title: "Real-Time Alerts",
    description:
      "Teachers and administrators can receive alerts about suspicious events while an examination is in progress.",
  },
  {
    icon: FileWarning,
    title: "Violation Management",
    description:
      "Keep a detailed record of detected violations, their type, severity and associated examination attempt.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Analyze exam attempts, student performance, violations and examination activity through centralized dashboards.",
  },
  {
    icon: Settings2,
    title: "Flexible Proctoring Settings",
    description:
      "Configure monitoring rules according to the requirements of each examination.",
  },
];

const capabilities = [
  "Face verification",
  "Multiple face detection",
  "Camera monitoring",
  "Screen monitoring",
  "Tab-switch detection",
  "Violation tracking",
  "Real-time monitoring",
  "Attempt management",
  "Performance analytics",
];

const Features = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-slate-900">
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
      <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
              Powerful Proctoring Technology
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need to conduct
              <span className="block text-indigo-400">
                secure online exams.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Vigilo brings intelligent monitoring, examination management
              and real-time insights together in one powerful platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Core Features
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built around exam integrity
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Every part of Vigilo is designed to make online assessments
              easier to manage and more trustworthy.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 transition group-hover:bg-indigo-600">
                    <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">
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

      {/* Capabilities */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Complete Toolkit
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              One platform for the entire examination lifecycle.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              From creating an exam to reviewing student attempts, Vigilo
              provides the tools required by teachers and administrators.
            </p>

            <Link
              to="/how-it-works"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              See How It Works
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Make every online examination more trustworthy.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-indigo-100">
            Start using intelligent proctoring tools to create a more secure
            digital examination experience.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <p className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Vigilo Proctoring System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Features;