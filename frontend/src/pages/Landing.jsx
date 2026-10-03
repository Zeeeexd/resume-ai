import { Link } from 'react-router-dom'
import { Brain, Zap, Target, FileText, TrendingUp, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Instant AI Analysis', desc: 'Upload your resume and get a complete AI-powered analysis in under 30 seconds.' },
  { icon: Target, title: 'ATS Compatibility', desc: 'Know exactly how your resume performs against Applicant Tracking Systems before applying.' },
  { icon: FileText, title: 'Smart Rewrites', desc: 'AI rewrites weak bullet points into powerful, impact-driven statements.' },
  { icon: TrendingUp, title: 'Skill Gap Analysis', desc: 'See exactly which skills you\'re missing for your target role.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your resume is analyzed securely. We never share your data.' },
  { icon: Brain, title: 'Gemini AI Powered', desc: 'Backed by Google\'s Gemini 1.5 Flash for deep, accurate resume insights.' },
]

const steps = [
  { n: '01', title: 'Upload Your Resume', desc: 'Upload a PDF or DOCX file up to 10 MB.' },
  { n: '02', title: 'Choose Target Role', desc: 'Tell us what job you\'re applying for.' },
  { n: '03', title: 'Get AI Analysis', desc: 'Receive a detailed score, insights, and an actionable improvement plan.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -top-40 right-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-8">
            <Brain className="w-4 h-4" /> Powered by Google Gemini AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Turn your resume into<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              your career advantage
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            AI-powered resume analysis that tells you exactly what's holding you back,
            what skills you're missing, and what to fix — with specific, actionable steps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2">
              Analyze My Resume <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {['Free to use', 'No credit card required', 'PDF & DOCX supported', 'Demo mode available'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to land the job</h2>
            <p className="text-gray-400 max-w-xl mx-auto">ResumeAI doesn't just score your resume — it gives you a complete action plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:border-indigo-500/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center mb-4 group-hover:bg-indigo-600/25 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white mb-4">
                  {n}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to improve your resume?</h2>
          <p className="text-gray-400 mb-8">Create your free account and analyze your resume in minutes.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-sm">ResumeAI</span>
          </div>
          <p className="text-xs text-gray-500">© 2024 ResumeAI — AI Resume Analyzer & Career Assistant</p>
        </div>
      </footer>
    </div>
  )
}
