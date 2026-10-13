import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  UserCheck,
  Database,
  EyeOff,
  Server,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const securityItems = [
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description:
      "Role-based authentication helps ensure that users only access the areas and information relevant to their role.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Access",
    description:
      "Administrators, teachers and students have different permissions across the examination platform.",
  },
  {
    icon: Database,
    title: "Protected Examination Data",
    description:
      "Exam information, attempts, answers and monitoring events are handled through controlled application workflows.",
  },
  {
    icon: EyeOff,
    title: "Privacy-Aware Monitoring",
    description:
      "Monitoring features are designed around examination integrity while keeping the student experience clear and transparent.",
  },
  {
    icon: Server,
    title: "Controlled Backend Access",
    description:
      "Application APIs use authenticated requests and authorization checks to protect platform resources.",
  },
  {
    icon: FileCheck2,
    title: "Audit-Friendly Records",
    description:
      "Important examination events and violations can be stored for later review and investigation.",
  },
];

const principles = [
  "Authentication before protected resources",
  "Role-based authorization",
  "Secure API communication",
  "Controlled examination access",
  "Detailed violation records",
  "Transparent monitoring events",
];

const Security = () => {
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
      <section className="bg-slate-950 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-900">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>

            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Security built into every
              <span className="block text-indigo-400">
                examination.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Vigilo is designed with authentication, authorization,
              controlled access and examination integrity at its core.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Security Architecture
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Protection at every layer
            </h2>

            <p className="mt-5 text-lg text-slate-600">
              The platform combines application security with examination
              monitoring to create a controlled digital assessment environment.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {securityItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-2xl border border-slate-200 p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Model */}
      <section className="bg-slate-950 py-24 text-white lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              Security Principles
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Designed around controlled access and accountability.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Every important part of the platform follows a controlled
              workflow so examination activity can be monitored and reviewed.
            </p>
          </div>

          <div className="space-y-3">
            {principles.map((principle) => (
              <div
                key={principle}
                className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                <span className="text-sm font-medium text-slate-300">
                  {principle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-7">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />

            <div>
              <h3 className="font-bold text-amber-900">
                Responsible monitoring
              </h3>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Automated monitoring signals should support human review
                rather than automatically determine academic misconduct.
                Institutions should establish clear policies for handling
                violations and student privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Build trust into your online examinations.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            Give teachers the visibility they need while creating a clear and
            controlled experience for students.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
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

export default Security;