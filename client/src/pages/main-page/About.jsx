import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Eye,
  Users,
  Lightbulb,
  CheckCircle2,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity First",
    description:
      "We believe online examinations should provide a trustworthy environment for both educators and students.",
  },
  {
    icon: Target,
    title: "Purpose Driven",
    description:
      "Every feature is designed around one goal: making digital examinations easier to manage and more reliable.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Monitoring should be clear, understandable and supported by meaningful examination records.",
  },
  {
    icon: Users,
    title: "People Centered",
    description:
      "Technology should support teachers and students rather than make the examination experience unnecessarily complicated.",
  },
];

const About = () => {
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
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>

            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Rethinking the way
              <span className="block text-indigo-400">
                online exams are conducted.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Vigilo is an intelligent online proctoring system built to help
              educators create secure, transparent and manageable digital
              examinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Our Mission
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Make digital assessment more trustworthy.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Online education has changed how students learn and how
              institutions evaluate them. But conducting examinations
              remotely introduces a new challenge: maintaining examination
              integrity without creating unnecessary complexity.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Vigilo aims to bridge that gap by combining examination
              management with intelligent monitoring tools in one platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-indigo-50 p-8 sm:p-12"
          >
            <div className="rounded-2xl border border-indigo-100 bg-white p-7 shadow-xl">
              <Lightbulb className="h-10 w-10 text-indigo-600" />

              <h3 className="mt-6 text-2xl font-bold">
                Technology should simplify trust.
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Instead of relying on disconnected tools, Vigilo brings
                identity verification, monitoring, exam management and
                reporting together into one workflow.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Create secure examinations",
                  "Verify student identity",
                  "Monitor examination activity",
                  "Review meaningful reports",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Our Principles
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              What Vigilo stands for
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.06,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h3 className="mt-5 font-bold">{value.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Our Vision
          </span>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            A future where distance never compromises examination integrity.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            We envision online examinations where institutions can confidently
            assess students remotely while students receive a fair,
            transparent and guided examination experience.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-6xl rounded-3xl bg-indigo-600 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Build the future of secure online assessment.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-indigo-100">
            Explore Vigilo and discover a smarter way to manage digital
            examinations.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/features"
              className="rounded-xl border border-indigo-400 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-500"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <p className="text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Vigilo Proctoring System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;