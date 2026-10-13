import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  UserPlus,
  FilePlus2,
  Settings2,
  ScanFace,
  Camera,
  PlayCircle,
  Activity,
  FileCheck2,
  BarChart3,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

const process = [
  {
    number: "01",
    icon: UserPlus,
    title: "Set Up Your Account",
    description:
      "Administrators and teachers create their accounts and configure the examination environment.",
  },
  {
    number: "02",
    icon: FilePlus2,
    title: "Create an Examination",
    description:
      "Create an exam with questions, marks, duration, schedule, instructions and proctoring settings.",
  },
  {
    number: "03",
    icon: Settings2,
    title: "Configure Proctoring",
    description:
      "Choose which monitoring capabilities should be active for the examination.",
  },
  {
    number: "04",
    icon: ScanFace,
    title: "Student Verification",
    description:
      "Before starting the exam, students complete system checks and face verification.",
  },
  {
    number: "05",
    icon: Camera,
    title: "Secure Examination",
    description:
      "Vigilo monitors configured activities while the student completes the examination.",
  },
  {
    number: "06",
    icon: Activity,
    title: "Monitor in Real Time",
    description:
      "Teachers can observe active attempts and review suspicious activity as it happens.",
  },
  {
    number: "07",
    icon: FileCheck2,
    title: "Submit & Evaluate",
    description:
      "Once an attempt is submitted, examination answers, violations and relevant activity are stored.",
  },
  {
    number: "08",
    icon: BarChart3,
    title: "Review Reports",
    description:
      "Teachers and administrators can analyze performance, attempts and detected violations.",
  },
];

const HowItWorks = () => {
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
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              How Vigilo Works
            </span>

            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              A simple workflow for
              <span className="block text-indigo-400">
                secure online examinations.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Vigilo connects exam creation, student verification, intelligent
              monitoring and reporting into one seamless workflow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-slate-200 md:block" />

            <div className="space-y-12">
              {process.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04,
                    }}
                    className="relative flex gap-6 md:gap-10"
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-sm font-bold text-white shadow-lg">
                      {item.number}
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                          <Icon className="h-5 w-5 text-indigo-600" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Designed For Everyone
            </span>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              One system. Three experiences.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Administrators",
                text: "Manage users, examinations, violations, analytics and the overall platform.",
              },
              {
                title: "Teachers",
                text: "Create exams, manage questions, monitor active attempts and review reports.",
              },
              {
                title: "Students",
                text: "Complete system checks, verify identity and take examinations in a guided environment.",
              },
            ].map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-slate-200 bg-white p-7"
              >
                <CheckCircle2 className="h-7 w-7 text-indigo-600" />

                <h3 className="mt-5 text-xl font-bold">{role.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {role.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 px-8 py-16 text-center">
          <PlayCircle className="mx-auto h-12 w-12 text-indigo-100" />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to experience secure online testing?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-indigo-100">
            Create your examination environment and let Vigilo handle the
            monitoring.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600"
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

export default HowItWorks;